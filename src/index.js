// Could break if GitHub changes its markup
import createNoteBox from './noteBox';
import minAjax from './ajax';
import { URL } from './constants';
import './style.css';
// Retrieve user id from session
const userId = '5d4145e999c6db6b9d23380b';
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
  if (e.target.value.length > 0) {
    addPrivateNoteButton.disabled = false;
  } else {
    addPrivateNoteButton.disabled = true;
  }
}

// Load main input area and add some behaviors
function initInputArea() {
  const textArea = document.getElementById('new_comment_field');
  textArea.addEventListener('change', e => {
    onInputValueChange(e);
  });
  textArea.addEventListener('input', e => {
    onInputValueChange(e);
  });
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
  button.onclick = e => {
    button.disabled = true;
    const textArea = document.getElementById('new_comment_field');
    let commentBoxes = document.querySelectorAll('.js-comment-container:not(.private-note)');
    let commentBoxCount = commentBoxes.length;
    // Find nearest comment id
    let nearestBox = commentBoxes[commentBoxCount - 2].querySelector('.js-comment-container [id]').id;
    nearestCommentId = nearestBox.split('-').pop();
    minAjax({
      url: `${URL}note`, // request URL
      type: 'POST', // Request type GET/POST
      data: {
        userId,
        noteContent,
        noteType,
        issueId,
        nearestCommentId,
      },
      success(data) {
        allNotes.push(JSON.parse(data));
        commentBoxes = document.querySelectorAll('.js-comment-container');
        commentBoxCount = commentBoxes.length;
        nearestBox = commentBoxes[commentBoxCount - 2];
        // eslint-disable-next-line no-underscore-dangle
        nearestBox.after(createNoteBox(allNotes[allNotes.length - 1]));
        textArea.value = '';
      },
    });
  };
  return button;
}

function init() {
  initInputArea();
  const positionMarker = document.getElementById('partial-new-comment-form-actions');
  if (positionMarker) {
    minAjax({
      url: `${URL}note/${userId}`, // request URL
      type: 'GET', // Request type GET/POST
      success(data) {
        // Retrieve all the notes based on issue id
        allNotes = JSON.parse(data);
        // Add the private note add button
        positionMarker.prepend(createPrivateNoteAddButton());
        // Retrieve all the comments and append notes
        const commentBoxes = document.querySelectorAll('.js-comment-container');
        commentBoxes.forEach((commentBox, index) => {
          const commentBoxId = commentBox.querySelector('.timeline-comment-group');
          if (commentBoxId) {
            const commentId = commentBoxId.id.split('-').pop();
            const findNotesNearestToComment = obj => obj.nearestCommentId === commentId;
            const notesNearestToCommentBox = allNotes.filter(findNotesNearestToComment);
            notesNearestToCommentBox.reverse().forEach(element => {
              commentBox.after(createNoteBox(element));
            });
          }
        });
      },
    });
  } else {
    console.log('Extension: position marker not found.');
  }
}
window.onload = () => {
  init();
};
