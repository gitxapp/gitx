// Could break if GitHub changes its markup

import './style.css';
import createNoteBox from './noteBox';

// Disable/Enable Add private button based on value entered
function onInputValueChange(e) {
  const addPrivateNoteButton = document.getElementById('add_private_note_button');
  if (e.target.value.length > 0) {
    addPrivateNoteButton.disabled = false;
  } else {
    addPrivateNoteButton.disabled = true;
  }
}

// Load main input area and add some behaviors
function initInputArea() {
  const textArea = document.getElementById('new_comment_field');
  textArea.addEventListener('onblur', e => {
    console.log('Value', e.target.value);
  });
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
  button.id = `add_private_note_button`;
  button.type = 'button';
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.disabled = true;
  button.onclick = function(e) {
    document.getElementById(`parent${e.target.value}`).style.display = 'block';
    document.getElementById(`close_private_note_button${e.target.value}`).style.display = 'block';
    button.style.display = 'none';
  };
  return button;
}

// Create close private note  button

function createPrivateNoteCloseButton() {
  const button = document.createElement('button');
  button.textContent = 'Save notes';
  button.id = 'close_private_note_button';
  button.type = 'button';
  button.classList.add('pvt-cmt-btn');
  button.classList.add('close-editor');
  button.style.display = 'none';
  button.onclick = function(e) {
    document.getElementById(`parent${e.target.value}`).style.display = 'none';
    document.getElementById(`add_private_note_button${e.target.value}`).style.display = 'block';
    button.style.display = 'none';
  };
  return button;
}

function init() {
  initInputArea();
  const positionMarker = document.getElementById('partial-new-comment-form-actions');
  if (positionMarker) {
    const div = document.createElement('div');
    div.setAttribute('class', 'post');
    div.appendChild(createPrivateNoteAddButton());
    div.appendChild(createPrivateNoteCloseButton());
    positionMarker.prepend(div);
    createNoteBox();
  } else {
    console.log('Extension: position marker not found.');
  }
}
window.onload = () => {
  init();
};
