import Quill from 'quill';
import './quill.css';
import './style.css';

function createTextEditorBtn() {
  const button = document.createElement('button');
  button.textContent = 'Show editor';
  button.id = 'showEditor'
  button.onclick = function () {
    document.getElementById('parent').style.display = 'block';
    document.getElementById('closeEditor').style.display = 'block';
    button.style.display = 'none';
  }
  return button
}

function closeTextEditorBtn() {
  const button = document.createElement('button');
  button.textContent = 'Save editor';
  button.id = 'closeEditor'
  button.style.display = 'none';
  button.onclick = function () {
    document.getElementById('parent').style.display = 'none';
    document.getElementById('showEditor').style.display = 'block';
    button.style.display = 'none';
  }
  return button
}


function createEditor() {
  const parent = document.createElement('div');
  const div = document.createElement('div');
  parent.id = 'parent'
  parent.classList.add("parent")
  div.id = 'editor';
  parent.style.display = 'none';
  parent.appendChild(div);
  return parent;
}

// Could break if GitHub changes its markup
function init() {
  const div = document.createElement('div');
  div.setAttribute('class', 'post');
  div.appendChild(createTextEditorBtn());
  div.appendChild(createEditor());
  div.appendChild(closeTextEditorBtn());

  const positionMarker = document.querySelector('.js-comment-body');
  if (positionMarker) {
    positionMarker.after(div);
  } else {
    console.log('Dashboard extension: position marker not found.');
  }
}
init();
const editor = new Quill('#editor', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['code-block', { list: 'ordered' }, { list: 'bullet' }]
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'  // or 'bubble'
});

editor.on('editor-change', function (eventName, range, oldRange, source) {
  if (eventName === 'text-change') {
  } else if (eventName === 'selection-change') {
    if (!range) {
      console.log(editor.root.innerHTML)
      editor.root.innerHTML = '<p>sdfdddddgh<strong>dfghdfg</strong></p>'
    }
  }
});