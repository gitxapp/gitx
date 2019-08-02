/* eslint-disable no-console */
// Could break if GitHub changes its markup
import Cookie from 'js-cookie';
import createNoteBox from './noteBox';
import createFooter from './footer';
import { getAllNotes, removeNote, createNote } from './api';
import './style.css';
// Retrieve user id from session
const userId = '5d43c19fdfe146fa6a9a905b';
let noteContent = '';
let allNotes = [];
let nearestCommentId = null;

// Check the url is issue or pull
const currentUrl = document.location.toString().toLowerCase();
const urlParams = currentUrl.split('/');
const issueId = urlParams[urlParams.length - 1];
const noteType = currentUrl.includes('issue') ? 'issue' : 'pull';

// Disable/Enable Add private button based on value entered
function onInputValueChange(e) {
  const addPrivateNoteButton = document.getElementById('add_private_note_button');
  noteContent = e.target.value;
  if (e.target.value.length > 0 && addPrivateNoteButton) {
    addPrivateNoteButton.disabled = false;
  } else {
    addPrivateNoteButton.disabled = true;
  }
}

// Load main input area and add some behaviors
function initInputArea() {
  const textArea = document.getElementById('new_comment_field');
  if (textArea) {
    textArea.addEventListener('change', e => {
      onInputValueChange(e);
    });
    textArea.addEventListener('input', e => {
      onInputValueChange(e);
    });
  }
}

async function deleteNote(noteId) {
  try {
    await removeNote({
      noteId,
    });

    // Remove deleted note from node
    const commentBoxes = document.querySelectorAll('.private-note');
    commentBoxes.forEach(commentBox => {
      const commentBoxPrivateId = commentBox.getAttribute('private-id');
      if (commentBoxPrivateId === noteId) {
        commentBox.remove();
      }
    });
  } catch (error) {
    console.log('error', error);
  }
}
// Create add private note  button
function createPrivateNoteAddButton() {
  const button = document.createElement('button');
  button.textContent = 'Add private notes';
  button.id = 'add_private_note_button';
  button.type = 'button';
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.disabled = true;
  button.onclick = async () => {
    button.disabled = true;
    const textArea = document.getElementById('new_comment_field');
    let commentBoxes = document.querySelectorAll('.js-comment-container:not(.private-note)');
    let commentBoxCount = commentBoxes.length;
    // Find nearest comment id
    let nearestBox = commentBoxes[commentBoxCount - 2].querySelector('.js-comment-container [id]').id;
    nearestCommentId = nearestBox.split('-').pop();
    try {
      const newlyCreatedNote = await createNote({
        userId,
        noteContent,
        noteType,
        issueId,
        nearestCommentId,
      });

      allNotes.push(newlyCreatedNote);
      commentBoxes = document.querySelectorAll('.js-comment-container');
      commentBoxCount = commentBoxes.length;
      nearestBox = commentBoxes[commentBoxCount - 2];
      // eslint-disable-next-line no-underscore-dangle
      nearestBox.after(createNoteBox(allNotes[allNotes.length - 1]));
      textArea.value = '';
    } catch (error) {
      console.log('error', error);
    }
  };
  return button;
}

async function init() {
  initInputArea();
  const positionMarker = document.getElementById('partial-new-comment-form-actions');
  if (positionMarker) {
    try {
      // Load all the notes based on issue id
      allNotes = await getAllNotes({
        userId,
        issueId,
      });

      positionMarker.prepend(createPrivateNoteAddButton());
      if (allNotes.length) {
        // Iterate all the comments and append notes
        const commentBoxes = document.querySelectorAll('.js-comment-container');
        commentBoxes.forEach(commentBox => {
          const commentBoxId = commentBox.querySelector('.timeline-comment-group');
          if (commentBoxId) {
            const commentId = commentBoxId.id.split('-').pop();

            const findNotesNearestToComment = obj => obj.nearestCommentId === commentId;
            const notesNearestToCommentBox = allNotes.filter(findNotesNearestToComment);
            notesNearestToCommentBox.reverse().forEach(element => {
              commentBox.after(createNoteBox(element));
              if (commentBox) {
                document.getElementById(`comment-box-${element._id}`).addEventListener('click', e => {
                  console.log('deleteNote', element);
                  deleteNote(element._id);
                });
              }
            });
          }
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  } else {
    console.log('Extension: position marker not found.');
  }
}
window.onload = () => {
  const authToken = Cookie.get('private-user-token');
  console.log('authToken-->', authToken);
  init();
  // if (!authToken) {
  //   createFooter();
  // } else {
  //   init();
  // }
};
