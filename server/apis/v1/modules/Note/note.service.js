import mongoose from "mongoose";
import showdown from "showdown";

import Note from "./note.model";

import {
  getRepoOwnerType,
  checkUserIsACollaborator
} from "../../../../utils/githubapi";

const converter = new showdown.Converter();

async function createNote(user, noteDetails) {
  const {
    noteContent,
    noteType,
    issueId,
    projectName,
    repoOwner,
    noteVisibility,
    nearestCommentId
  } = noteDetails;

  let userHasAccessToRepo = false;
  const { _id: userId, userName, accessToken } = user;

  userHasAccessToRepo = await checkUserIsACollaborator({
    repoOwner,
    projectName,
    userName,
    accessToken
  });
  if (!userHasAccessToRepo) {
    return {
      status: 400,
      message: "You don't have authorization to create the private note"
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
    userId
  });

  note.noteContent = converter.makeHtml(note.noteContent);
  if (!userId) {
    return {
      status: 400,
      message: "User id is required"
    };
  }
  if (!issueId) {
    return {
      status: 400,
      message: "Issue id or Pull id is required"
    };
  }
  if (!projectName) {
    return {
      status: 400,
      message: "Project name is required"
    };
  }

  try {
    await note.save();
    return {
      status: 200,
      data: note,
      message: "Note created successfully"
    };
  } catch (err) {
    return {
      status: 401,
      data: { error: err },
      message: "Note not created"
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
      accessToken
    });

    if (userHasAccessToRepo) {
      notes = await Note.find({
        $and: [
          { issueId },
          { projectName },
          { noteType },
          { $or: [{ userId }, { noteVisibility: true }] }
        ]
      });

      notes = notes.map(note => {
        return {
          ...note._doc,
          noteContent: converter.makeHtml(note.noteContent),
          userId: { userName, avatarUrl, githubId }
        };
      });
    }

    return {
      status: 200,
      message: "Fetched notes",
      data: notes
    };
  } catch (err) {
    return {
      status: 200,
      message: "Failed to fetch notes",
      data: { error: err }
    };
  }
}

async function deleteNote(userId, noteDetails) {
  const { projectName, issueId, noteType, noteId } = noteDetails;
  if (!noteId) {
    return {
      status: 400,
      message: "Note id is required"
    };
  }

  try {
    const note = await Note.findOne({
      $and: [
        { _id: mongoose.Types.ObjectId(noteId) },
        { userId },
        { issueId },
        { projectName },
        { noteType }
      ]
    }).populate("userId", "userName avatarUrl githubId");
    if (note) note.remove();
    return {
      status: 200,
      data: note,
      message: "Note removed successfully"
    };
  } catch (err) {
    return {
      status: 401,
      data: { error: err },
      message: "Invalid note id"
    };
  }
}
export default {
  createNote,
  getNotes,
  deleteNote
};
