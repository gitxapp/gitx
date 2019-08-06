// eslint-disable-next-line import/no-cycle
import NoteService from './note.service';

async function createNoteController(req, res) {
  const noteDetails = req.body;
  noteDetails.userId = req.user._id;
  const action = await NoteService.createNote(noteDetails);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {},
  });
}

async function getNotesController(req, res) {
  const action = await NoteService.getNotes(req.user._id, req.params.issueId);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {},
  });
}

async function deleteNotesController(req, res) {
  const action = await NoteService.deleteNote(req.user._id, req.params.noteId);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {},
  });
}

export default {
  createNoteController,
  getNotesController,
  deleteNotesController,
};
