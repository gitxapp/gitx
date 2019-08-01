import { Router } from 'express';

import NoteController from '../apis/v1/modules/Note/note.controller';

const router = Router();
// Create a new note
router.post('/', NoteController.createNoteController);
// Get note details from userId
router.get('/:userId/issue/:issueId', NoteController.getNotesController);
export default router;
