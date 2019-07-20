import Quill from 'quill';
import './quill.css';
import './style.css';

function createTextEditorBtn(index) {
  const button = document.createElement('button');
  button.textContent = 'Add private comments';
  button.id = `showEditor${index}`;
  button.value = index;
  button.classList.add('pvt-cmt-btn');
  button.onclick = function (e) {
    document.getElementById(`parent${e.target.value}`).style.display = 'block';
    document.getElementById(`closeEditor${e.target.value}`).style.display = 'block';
    button.style.display = 'none';
  }
  return button
}

function closeTextEditorBtn(index) {
  const button = document.createElement('button');
  button.textContent = 'Save comments';
  button.id = `closeEditor${index}`;
  button.value = index;
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


function createEditorWrapper(index) {
  const parent = document.createElement('div');
  const div = document.createElement('div');
  parent.id = `parent${index}`
  parent.classList.add('parent')
  div.id = `editor${index}`;
  div.classList.add('editor');
  parent.style.display = 'none';
  parent.appendChild(div);
  return parent;
}

function createEditor(index) {
  const editor = new Quill(`#editor${index}`, {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['code-block', { list: 'ordered' }, { list: 'bullet' }]
      ]
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  });
  if (editor && editor.on) {
    editor.on('editor-change', function (eventName, range, oldRange, source) {
      if (eventName === 'text-change') {
      } else if (eventName === 'selection-change') {
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
  const positionMarkers = document.getElementsByClassName('js-comment');
  let positionMarkersCount = 0;
  Array.prototype.forEach.call(positionMarkers, (positionMarker, index) => {
    if (positionMarker) {
      positionMarkersCount += 1;
      const div = document.createElement('div');
      div.setAttribute('class', 'post');
      div.appendChild(createTextEditorBtn(index));
      div.appendChild(createEditorWrapper(index));
      div.appendChild(closeTextEditorBtn(index));
      positionMarker.after(div);
    } else {
      console.log('Dashboard extension: position marker not found.');
    }
  });
  while(positionMarkersCount > 0) {
    createEditor(positionMarkersCount - 1);
    positionMarkersCount -= 1;
  }
}
init();