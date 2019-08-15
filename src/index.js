/* eslint-disable no-console */
// Could break if GitHub changes its markup
import createNoteBox from './noteBox';
import createFooter from './footer';
import { getAllNotes, removeNote, createNote } from './api';
import './style.css';

let noteContent = '';
let allNotes = [];
let nearestCommentId = null;

// Check the url is issue or pull
const currentUrl = document.location.toString().toLowerCase();
const urlParams = currentUrl.split('/');
const issueId = urlParams[urlParams.length - 1];
const noteType = currentUrl.includes('issue') ? 'issue' : 'pull';
const projectName = urlParams[urlParams.length - 3];

function hasSomeParentTheClass(element, classname) {
  if (element.className && element.className.split(' ').indexOf(classname) >= 0) return element;
  return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
}
// Disable/Enable Add private button based on value entered
function onInputValueChange(e) {
  const addPrivateNoteButton = document.getElementById('add_private_note_button');
  noteContent = e.target.value;
  if (addPrivateNoteButton) {
    if (e.target.value.indexOf('Uploading') !== -1) {
      addPrivateNoteButton.disabled = true;
    } else if (e.target.value.length > 0 && addPrivateNoteButton) {
      addPrivateNoteButton.disabled = false;
    } else {
      addPrivateNoteButton.disabled = true;
    }
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
      noteType,
      issueId,
      projectName,
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
    console.log('Delete note error:', error);
  }
}

function bindDeleteEventToNote(note) {
  document.getElementById(`comment-box-${note._id}`).addEventListener('click', () => {
    deleteNote(note._id);
  });
}

// Create add private note  button
function createPrivateNoteAddButton() {
  const textArea = document.getElementById('new_comment_field');
  const button = document.createElement('button');
  button.textContent = 'Add private notes';
  button.id = 'add_private_note_button';
  button.type = 'button';
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.disabled = textArea && !textArea.value;
  button.onclick = async () => {
    button.disabled = true;
    let commentBoxes = document.querySelectorAll('.js-comment-container:not(.private-note)');
    let commentBoxCount = commentBoxes.length;
    // Find nearest comment id
    let nearestBox = commentBoxes[commentBoxCount - 2].querySelector('.js-comment-container [id]')
      .id;
    nearestCommentId = nearestBox.split('-').pop();
    try {
      const newlyCreatedNote = await createNote({
        noteContent,
        noteType,
        issueId,
        nearestCommentId,
        projectName,
      });

      allNotes.push(newlyCreatedNote);
      commentBoxes = document.querySelectorAll('.js-comment-container');
      commentBoxCount = commentBoxes.length;
      nearestBox = commentBoxes[commentBoxCount - 2];
      const nearestDiscussionBody = hasSomeParentTheClass(nearestBox, 'timeline-comment-wrapper');
      // eslint-disable-next-line no-underscore-dangle
      if (nearestDiscussionBody) {
        nearestDiscussionBody.after(createNoteBox(allNotes[allNotes.length - 1]));
      } else {
        nearestBox.after(createNoteBox(allNotes[allNotes.length - 1]));
      }
      bindDeleteEventToNote(newlyCreatedNote);

      textArea.value = '';
    } catch (error) {
      console.log('Add note error:', error);
    }
  };
  return button;
}

async function injectContent() {
  initInputArea();
  const positionMarker = document.getElementById('partial-new-comment-form-actions');

  if (positionMarker) {
    positionMarker.prepend(createPrivateNoteAddButton());

    try {
      // Load all the notes based on issue id
      allNotes = await getAllNotes({
        issueId,
        projectName,
        noteType,
      });
      if (allNotes.length) {
        // Iterate all the comments and append notes
        const commentBoxes = document.querySelectorAll('.js-comment-container');
        commentBoxes.forEach(commentBox => {
          const commentBoxDiscussionBody = hasSomeParentTheClass(
            commentBox,
            'timeline-comment-wrapper',
          );
          const commentBoxId = commentBox.querySelector('.timeline-comment-group');
          if (commentBoxId) {
            const commentId = commentBoxId.id.split('-').pop();

            const findNotesNearestToComment = obj => obj.nearestCommentId === commentId;
            const notesNearestToCommentBox = allNotes.filter(findNotesNearestToComment);
            notesNearestToCommentBox.reverse().forEach(element => {
              if (commentBoxDiscussionBody) {
                commentBoxDiscussionBody.after(createNoteBox(element));
              } else {
                commentBox.after(createNoteBox(element));
              }
              if (commentBox) {
                bindDeleteEventToNote(element);
              }
            });
          }
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  }
}

function init() {
  window.chrome.storage.sync.get(['githubPrivateCommentToken'], result => {
    const authToken = result.githubPrivateCommentToken;

    if (!authToken) {
      createFooter();
    } else {
      injectContent();
    }
  });
}

window.onload = () => {
  init();
};

window.onhashchange = (e) => {
  console.log(e)
  init();
}

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.reInitScript)
    init();
  }
);
window.addEventListener('message', e => {
  if (e.data && e.data.type === 'githubPrivateCommentToken') {
    window.chrome.storage.sync.set({ githubPrivateCommentToken: e.data.value });
  }
});
