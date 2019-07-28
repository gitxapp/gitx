import './style.css';
import creteNoteBox from './noteBox';

function toggleDisabled(e) {
  const showTextButton = document.getElementById('showEditor');
  if (e.target.value.length > 0) {
    showTextButton.disabled = false;
  } else {
    showTextButton.disabled = true;
  }
}



function getTextAreaInput () {
  const textArea = document.getElementById('new_comment_field');
  textArea.addEventListener('onblur', (e) => {
    console.log(e.target.value)

  });
  textArea.addEventListener('change', (e) => {
    toggleDisabled(e);
  });
  textArea.addEventListener('input', (e) => {
    toggleDisabled(e);
  });

}

function createTextEditorBtn() {
  const button = document.createElement('button');
  button.textContent = 'Add private notes';
  button.id = `showEditor`;
  button.type = 'button';
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.disabled = true;
  button.onclick = function (e) {
    document.getElementById(`parent${e.target.value}`).style.display = 'block';
    document.getElementById(`closeEditor${e.target.value}`).style.display = 'block';
    button.style.display = 'none';
  }
  return button
}

function closeTextEditorBtn() {
  const button = document.createElement('button');
  button.textContent = 'Save notes';
  button.id = 'closeEditor';
  button.type = 'button';
  button.classList.add('pvt-cmt-btn');
  button.classList.add('close-editor');
  button.style.display = 'none';
  button.onclick = function (e) {
    document.getElementById(`parent${e.target.value}`).style.display = 'none';
    document.getElementById(`showEditor${e.target.value}`).style.display = 'block';
    button.style.display = 'none';
  }
  return button
}

// Could break if GitHub changes its markup
function init() {
  getTextAreaInput();
  const positionMarker = document.getElementById('partial-new-comment-form-actions');
  if (positionMarker) {
    const div = document.createElement('div');
    div.setAttribute('class', 'post');
    div.appendChild(createTextEditorBtn());
    div.appendChild(closeTextEditorBtn());
    positionMarker.prepend(div);
    creteNoteBox();
  } else {
    console.log('Dashboard extension: position marker not found.');
  }
}
window.onload = () => {
  init();
};