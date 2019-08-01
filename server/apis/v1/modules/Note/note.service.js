import Note from './note.model';

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

async function getNotes(id) {
  try {
    const notes = await Note.find({ userId: id }).populate('userId', 'userName avatarUrl githubId');
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

export default {
  createNote,
  getNotes,
};
