// Could break if GitHub changes its markup
import createNoteBox from './noteBox';
import minAjax from './ajax';
import { URL } from './constants';
import './style.css';
// Retrieve user id from session
const userId = '5d4145e999c6db6b9d23380b';
let note = '';
let allNotes = [];
let nearest_comment_id = null;

// Check the url is issue or pull
const currentUrl = document.location.toString().toLowerCase();
const urlParams = currentUrl.split('/');
const issue_id = urlParams[urlParams.length - 1];
const note_type = currentUrl.includes('issue') ? 'issue' : 'pull';

// Disable/Enable Add private button based on value entered
function onInputValueChange(e) {
  const addPrivateNoteButton = document.getElementById('add_private_note_button');

  note = e.target.value;

  if (e.target.value.length > 0) {
    addPrivateNoteButton.disabled = false;
  } else {
    addPrivateNoteButton.disabled = true;
  }
}

// Load main input area and add some behaviors
function initInputArea() {
  const textArea = document.getElementById('new_comment_field');
  textArea.addEventListener('onblur', e => {});
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
    const commentBoxes = document.querySelectorAll('.js-comment-container:not(.private-note)');
    const commentBoxCount = commentBoxes.length;
    // Find nearest comment id
    const nearestBox = commentBoxes[commentBoxCount - 2].querySelector('.js-comment-container [id]').id;
    nearest_comment_id = nearestBox.split('-').pop();
    minAjax({
      url: `${URL}note`, // request URL
      type: 'POST', // Request type GET/POST
      data: {
        user_id: userId,
        note_content: note,
        type: note_type,
        issue_id,
        nearest_comment_id,
        nearest_created_date: new Date(),
      },
      success(data) {
        allNotes.push(JSON.parse(data));
        const commentBoxes = document.querySelectorAll('.js-comment-container');
        const commentBoxCount = commentBoxes.length;

        const nearestBox = commentBoxes[commentBoxCount - 2];

        nearestBox.after(createNoteBox(data._id, allNotes[allNotes.length - 1]));
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
            const findNotesNearestToComment = obj => {
              return obj.nearest_comment_id === commentId;
            };
            const notesNearestToCommentBox = allNotes.filter(findNotesNearestToComment);

            notesNearestToCommentBox.reverse().forEach(element => {
              commentBox.after(createNoteBox(index, element));
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
