import mongoose from 'mongoose';
import showdown from 'showdown';

import Note from './note.model';

const converter = new showdown.Converter();

async function createNote(noteDetails) {
  const { userId } = noteDetails;
  const { issueId, projectName } = noteDetails;
  const note = new Note(noteDetails);

  note.noteContent = converter.makeHtml(note.noteContent);
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
    await note.save();
    return {
      status: 200,
      data: note,
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

async function getNotes(userId, noteDetails) {
  try {
    const { projectName, issueId, noteType } = noteDetails;
    const notes = await Note.find({
      $and: [{ userId }, { issueId }, { projectName }, { noteType }],
    }).populate('userId', 'userName avatarUrl githubId');
    notes.forEach(note => {
      // eslint-disable-next-line
      note.noteContent = converter.makeHtml(note.noteContent);
    });
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
export default {
  createNote,
  getNotes,
  deleteNote,
};
