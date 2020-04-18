import mongoose from 'mongoose';
import showdown from 'showdown';

import Note from './note.model';

import { getRepoOwnerType, checkUserIsACollaborator } from '../../../../utils/githubapi';

const converter = new showdown.Converter();

async function createNote(user, noteDetails) {
  const {
    noteContent,
    noteType,
    issueId,
    projectName,
    repoOwner,
    noteVisibility,
    nearestCommentId,
  } = noteDetails;

  let userHasAccessToRepo = false;
  const { _id: userId, userName, accessToken, avatarUrl, githubId } = user;

  const userDetails = { userName, avatarUrl, githubId };

  userHasAccessToRepo = await checkUserIsACollaborator({
    repoOwner,
    projectName,
    userName,
    accessToken,
  });
  if (!userHasAccessToRepo) {
    return {
      status: 400,
      message: 'You cannot add private notes to this repository since you are not a collaborator',
    };
  }

  const repoOwnerType = await getRepoOwnerType({ repoOwner });

  const note = new Note({
    noteContent,
    repoOwnerType,
    noteType,
    issueId,
    nearestCommentId,
    projectName,
    repoOwner,
    noteVisibility,
    userId,
    userDetails,
  });

  if (!userId) {
    return {
      status: 400,
      message: 'User id is required',
    };
  }
  if (!issueId) {
    return {
      status: 400,
      message: 'Issue id or Pull id is required',
    };
  }
  if (!projectName) {
    return {
      status: 400,
      message: 'Project name is required',
    };
  }

  try {
    const result = await note.save();

    const newlyCreatedNote = {
      _id: result._id,
      noteContent: converter.makeHtml(result.noteContent),
      author: result.userId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      nearestCommentId: result.nearestCommentId,
      noteVisibility: result.noteVisibility,
      userDetails,
    };

    return {
      status: 200,
      data: newlyCreatedNote,
      message: 'Note created successfully',
    };
  } catch (err) {
    return {
      status: 401,
      data: { error: err },
      message: 'Note not created',
    };
  }
}

async function getNotes(user, noteDetails) {
  try {
    let notes = [];
    let userHasAccessToRepo = false;
    const { _id: userId, userName, avatarUrl, githubId, accessToken } = user;
    const { projectName, issueId, noteType, repoOwner } = noteDetails;

    userHasAccessToRepo = await checkUserIsACollaborator({
      repoOwner,
      projectName,
      userName,
      accessToken,
    });

    if (userHasAccessToRepo) {
      notes = await Note.find({
        $and: [
          { issueId },
          { projectName },
          { noteType },
          { $or: [{ userId }, { noteVisibility: true }] },
        ],
      }).populate('userId', 'userName avatarUrl githubId');
      const userDetails = { userName, avatarUrl, githubId };

      notes = notes.map(note => ({
        _id: note._id,
        noteContent: converter.makeHtml(note.noteContent),
        author: note.userId,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        nearestCommentId: note.nearestCommentId,
        noteVisibility: note.noteVisibility,
        userDetails,
      }));
    }

    return {
      status: 200,
      message: 'Fetched notes',
      data: notes,
    };
  } catch (err) {
    return {
      status: 200,
      message: 'Failed to fetch notes',
      data: { error: err },
    };
  }
}

async function deleteNote(userId, noteDetails) {
  const { projectName, issueId, noteType, noteId } = noteDetails;
  if (!noteId) {
    return {
      status: 400,
      message: 'Note id is required',
    };
  }

  try {
    const note = await Note.findOne({
      $and: [
        { _id: mongoose.Types.ObjectId(noteId) },
        { userId },
        { issueId },
        { projectName },
        { noteType },
      ],
    }).populate('userId', 'userName avatarUrl githubId');
    if (note) note.remove();
    return {
      status: 200,
      data: note,
      message: 'Note removed successfully',
    };
  } catch (err) {
    return {
      status: 401,
      data: { error: err },
      message: 'Invalid note id',
    };
  }
}

async function editNote(userId, noteDetails) {
  const { noteVisibility, noteId } = noteDetails;
  if (!noteId) {
    return {
      status: 400,
      message: 'Note id is required',
    };
  }

  try {
    await Note.findOneAndUpdate({ _id: mongoose.Types.ObjectId(noteId) }, { noteVisibility });

    return {
      status: 200,
      message: 'Note updated successfully',
    };
  } catch (err) {
    return {
      status: 401,
      data: { error: err },
      message: 'Invalid note id',
    };
  }
}
export default {
  createNote,
  getNotes,
  deleteNote,
  editNote,
};
