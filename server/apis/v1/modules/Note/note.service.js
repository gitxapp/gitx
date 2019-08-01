import Note from './note.model';
import mongoose from 'mongoose';

async function createNote(noteDetails) {
  const { userId } = noteDetails;

  const note = new Note(noteDetails);
  if (!userId) {
    return {
      status: 400,
      message: 'User id is required',
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

async function getNotes(userId, issueId) {
  try {
    const notes = await Note.find({ $and: [{ userId }, { issueId }] }).populate('userId', 'userName avatarUrl githubId');
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

async function deleteNote(noteId) {
  if (!noteId) {
    return {
      status: 400,
      message: 'Note id is required',
    };
  }
  try {
    const note = await Note.findOne({ _id: mongoose.Types.ObjectId(noteId) }).populate('userId', 'userName avatarUrl githubId');
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
