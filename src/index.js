/* eslint-disable no-console */
// Could break if GitHub changes its markup
import createNoteBox from './noteBox';
import createFooter from './footer';
import { getAllNotes, removeNote, createNote } from './api';
import { findURLAttributes, checkUrlIsIssueOrPull } from './helpers';
import './style.css';

let noteContent = '';
let allNotes = [];
let nearestCommentId = null;
let urlAttributes;
function initUrlAttributes() {
  const {
    location: { href: currentUrl },
  } = document;
  urlAttributes = findURLAttributes({ currentUrl });
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
  const { issueId, noteType, projectName } = urlAttributes;

  try {
    await removeNote({
      noteId,
      noteType,
      issueId,
      projectName,
    });

    // Remove deleted note from dom
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
  const deleteBox = document.getElementById(`comment-box-${note._id}`);

  deleteBox.addEventListener('click', () => {
    const answer = window.confirm('Are you sure you want to delete this note?');

    if (answer) {
      deleteNote(note._id);
    }
  });
}

// Create add private note  button
function createPrivateNoteAddButton() {
  const textArea = document.getElementById('new_comment_field');
  const button = document.createElement('button');
  button.textContent = 'Make Note';
  button.id = 'add_private_note_button';
  button.type = 'button';
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.classList.add('ml-1"');
  button.disabled = textArea && !textArea.value;
  button.onclick = async () => {
    button.disabled = true;
    const commentBoxes = document.querySelectorAll(
      '[data-gid]:not([id]):not(.merge-status-list-wrapper',
    );
    const commentBoxCount = commentBoxes.length;
    // Find nearest comment id
    let nearestBox = commentBoxes[commentBoxCount - 1];
    nearestCommentId = nearestBox.getAttribute('data-gid');

    try {
      const { issueId, noteType, projectName } = urlAttributes;

      const newlyCreatedNote = await createNote({
        noteContent,
        noteType,
        issueId,
        nearestCommentId,
        projectName,
      });

      allNotes.push(newlyCreatedNote);
      while (
        nearestBox.nextElementSibling &&
        nearestBox.nextElementSibling.getAttribute('private-id')
      ) {
        nearestBox = nearestBox.nextSibling;
      }
      nearestBox.after(createNoteBox(allNotes[allNotes.length - 1]));
      bindDeleteEventToNote(newlyCreatedNote);

      textArea.value = '';
    } catch (error) {
      console.log('Add note error:', error);
    }
  };
  return button;
}

async function injectContent(apiCall) {
  const addedNoteIds = [];
  const commentBtn = document.querySelector(
    '#partial-new-comment-form-actions > button:nth-child(1)',
  );
  if (commentBtn) {
    commentBtn.onclick = () => {
      setTimeout(() => {
        injectContent(false);
      }, 3000);
    };
  }
  initInputArea();
  const positionMarker = document.getElementById('partial-new-comment-form-actions');
  // similar comments hide the gitex comments so opening the collapsible similar comments
  const collapsed = document.querySelectorAll('.Details-element.details-reset');
  collapsed.forEach(el => {
    el.setAttribute('open', true);
  });
  if (positionMarker) {
    positionMarker.prepend(createPrivateNoteAddButton());
    if (!apiCall) {
      return;
    }
    try {
      const { issueId, noteType, projectName } = urlAttributes;

      // Load all the notes based on issue id
      allNotes = await getAllNotes({
        issueId,
        projectName,
        noteType,
      });
      if (allNotes.length) {
        // Iterate all the comments and append notes
        const commentBoxes = document.querySelectorAll(
          '[data-gid]:not([id]):not(.merge-status-list-wrapper)',
        );

        commentBoxes.forEach(commentBox => {
          const commentId = commentBox.getAttribute('data-gid');

          const findNotesNearestToComment = obj => obj.nearestCommentId === commentId;
          const notesNearestToCommentBox = allNotes.filter(findNotesNearestToComment);
          notesNearestToCommentBox.reverse().forEach(element => {
            const { _id: noteId } = element;
            if (!addedNoteIds.includes(noteId)) {
              addedNoteIds.push(noteId);
              commentBox.after(createNoteBox(element));
              if (commentBox) {
                bindDeleteEventToNote(element);
              }
            }
          });
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
      initUrlAttributes();
      injectContent(true);
    }
  });
}

window.onload = () => {
  init();
};

window.addEventListener('message', e => {
  if (e.data && e.data.type === 'githubPrivateCommentToken') {
    window.chrome.storage.sync.set({ githubPrivateCommentToken: e.data.value });
  }
});

(document.body || document.documentElement).addEventListener(
  'transitionend',
  () => {
    const {
      location: { href: URL },
    } = document;

    if (checkUrlIsIssueOrPull({ URL })) {
      const privateButton = document.getElementById('add_private_note_button');
      if (!privateButton) init();
    }
  },
  true,
);
