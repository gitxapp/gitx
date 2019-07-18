import Quill from 'quill';
import './style.css';
// Could break if GitHub changes its markup

function init() {
    //   const details = document.createElement('details');
    //   details.classList.add('position-relative', 'js-dropdown-details');
    //   details.style.userSelect = 'none';
    //   const summary = document.createElement('summary');
    //   summary.classList.add('btn', 'btn-sm');
    //   summary.innerText = 'Filter';
    //   const container = document.createElement('div');
    //   container.classList.add('dropdown-menu', 'dropdown-menu-se', 'f5');
    //   container.style.width = '260px';
    //   details.appendChild(summary);
  
    var div = document.createElement('div');
    div.setAttribute('class', 'post');
    div.innerHTML = `
          <div class="parent">
             <div id="editor"></div>
          </div>
      `;
  
    const positionMarker = document.querySelector('.discussion-timeline-actions');
    if (positionMarker) {
      positionMarker.before(div);
    } else {
      console.log('Dashboard extension: position marker not found.');
    }
  }
  init();
  const editor  = new Quill('#editor', {
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