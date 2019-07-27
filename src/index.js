import Quill from 'quill';
import './quill.css';
import './style.css';

function getTextAreaInput () {
  const textArea = document.getElementById('new_comment_field');
  textArea.addEventListener('blur', (e) => {
    console.log(e.target.value);
  })
}

function createTextEditorBtn() {
  const button = document.createElement('button');
  button.textContent = 'Add private notes';
  button.id = `showEditor`;
  button.type = 'button';
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.disabled = 
  button.onclick = function (e) {
    document.getElementById(`parent${e.target.value}`).style.display = 'block';
    document.getElementById(`closeEditor${e.target.value}`).style.display = 'block';
    button.style.display = 'none';
  }
  getTextAreaInput();
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


function createEditorWrapper() {
  const parent = document.createElement('div');
  const div = document.createElement('div');
  parent.id = 'parent'
  parent.classList.add('parent')
  div.id = 'editor';
  div.classList.add('editor');
  parent.style.display = 'none';
  parent.appendChild(div);
  return parent;
}

function createEditor() {
  const editor = new Quill('#editor', {
    modules: {
      toolbar: [
        [{
          header: [1, 2, false]
        }],
        ['bold', 'italic', 'underline'],
        ['code-block', {
          list: 'ordered'
        }, {
          list: 'bullet'
        }]
      ]
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  });
  if (editor && editor.on) {
    editor.on('editor-change', function (eventName, range, oldRange, source) {
      if (eventName === 'text-change') {} else if (eventName === 'selection-change') {
        if (!range) {
          console.log(editor.root.innerHTML)
          editor.root.innerHTML = '<p>sdfdddddgh<strong>dfghdfg</strong></p>'
        }
      }
    });
  }
}

// Could break if GitHub changes its markup
function init() {
  const positionMarker = document.getElementById('partial-new-comment-form-actions');
  if (positionMarker) {
    const div = document.createElement('div');
    div.setAttribute('class', 'post');
    div.appendChild(createTextEditorBtn());
    div.appendChild(createEditorWrapper());
    div.appendChild(closeTextEditorBtn());
    positionMarker.after(div);
  } else {
    console.log('Dashboard extension: position marker not found.');
  }
}
init();