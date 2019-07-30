// Could break if GitHub changes its markup
import createNoteBox from './noteBox';
import minAjax from './ajax';
import { URL } from './constants';
const userId = '5d4014afee31519f2dbcecd2';
let note = null;
let allNotes = [];

function loadAllTheNotes() {
  minAjax({
    url: `${URL}note/${userId}`, //request URL
    type: 'GET', //Request type GET/POST
    success: function(data) {
      allNotes = JSON.parse(data);
      console.log('All Notes', allNotes);
    },
  });
}
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
    minAjax({
      url: URL + 'note', //request URL
      type: 'POST', //Request type GET/POST
      data: {
        user_id: userId,
        note_content: note,
        type: 'issue',
      },
      success: function(data) {},
    });
  };
  return button;
}

function init() {
  initInputArea();
  const positionMarker = document.getElementById('partial-new-comment-form-actions');
  if (positionMarker) {
    positionMarker.prepend(createPrivateNoteAddButton());
    createNoteBox();
  } else {
    console.log('Extension: position marker not found.');
  }
}
window.onload = () => {
  init();
};
loadAllTheNotes();
