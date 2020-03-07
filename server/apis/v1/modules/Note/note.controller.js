// eslint-disable-next-line import/no-cycle
import NoteService from "./note.service";

async function createNoteController(req, res) {
  const noteDetails = req.body;
  const action = await NoteService.createNote(req.user, noteDetails);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {}
  });
}

async function getNotesController(req, res) {
  const noteDetails = req.body;

  const action = await NoteService.getNotes(req.user, noteDetails);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {}
  });
}

async function deleteNotesController(req, res) {
  const noteDetails = req.body;

  const action = await NoteService.deleteNote(req.user._id, noteDetails);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {}
  });
}

export default {
  createNoteController,
  getNotesController,
  deleteNotesController
};
