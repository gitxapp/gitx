// eslint-disable-next-line import/no-cycle
import NoteService from './note.service';

async function createNoteController(req, res) {
  const action = await NoteService.createNote(req.body);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {},
  });
}

async function getNotesController(req, res) {
  const action = await NoteService.getNotes(req.params.userId, req.params.issueId);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {},
  });
}

export default {
  createNoteController,
  getNotesController,
};
