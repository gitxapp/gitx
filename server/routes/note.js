const express = require('express');
const async = require('async');
const router = express.Router();
const mongoose = require('mongoose');
const Note = mongoose.model('Note');
// Create a new note
router.post('/', async (req, res) => {
  const { type, note_content, user_id, nearest_comment_id, issue_id, nearest_created_date } = req.body;

  const note = new Note({
    note_content,
    type,
    user_id,
    nearest_comment_id,
    issue_id,
    nearest_created_date,
  });
  if (!user_id) {
    return res.status(404).json('User id is required');
  }

  try {
    await note.save();
    res.status(200).json(note);
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notes = await Note.find({ user_id: req.params.id }).populate('user_id', 'user_name avatar_url github_id');
    res.status(200).json(notes);
  } catch (err) {
    res.status(404).json({ err: 'Invalid User Id' });
  }
});
module.exports = router;
