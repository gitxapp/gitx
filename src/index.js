/* eslint-disable no-console */
// Could break if GitHub changes its markup
import createNoteBox from "./noteBox";
import createFooter from "./footer";
import { getAllNotes, removeNote, createNote, toggleVisibilityApi } from "./api";
import { findURLAttributes, checkUrlIsIssueOrPull } from "./helpers";
import "./style.css";

let noteContent = "";
let allNotes = [];
let nearestCommentId = null;
let urlAttributes;
function initUrlAttributes() {
  const {
    location: { href: currentUrl }
  } = document;
  urlAttributes = findURLAttributes({ currentUrl });
}
// Disable/Enable Add private button based on value entered
function onInputValueChange(e) {
  const addPrivateNoteButton = document.getElementById(
    "add_private_note_button"
  );
  noteContent = e.target.value;
  if (addPrivateNoteButton) {
    if (e.target.value.indexOf("Uploading") !== -1) {
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
  const textArea = document.getElementById("new_comment_field");
  if (textArea) {
    textArea.addEventListener("change", e => {
      onInputValueChange(e);
    });
    textArea.addEventListener("input", e => {
      onInputValueChange(e);
    });
  }
}

async function deleteNote(noteId) {
  const { issueId, noteType, projectName, repoOwner } = urlAttributes;

  try {
    await removeNote({
      noteId,
      noteType,
      issueId,
      projectName,
      repoOwner
    });

    // Remove deleted note from dom
    const commentBoxes = document.querySelectorAll(".private-note");
    commentBoxes.forEach(commentBox => {
      const commentBoxPrivateId = commentBox.getAttribute("private-id");
      if (commentBoxPrivateId === noteId) {
        commentBox.remove();
      }
    });
  } catch (error) {
    console.log("Delete note error:", error);
  }
}

async function toggleVisibility(noteId, noteVisibility) {
  try {
    await toggleVisibilityApi({ noteId, noteVisibility })
  } catch (error) {
    console.log("Toggle visibility note error:", error);
  }
}


function bindDeleteEventToNote(note) {
  const deleteBox = document.getElementById(`comment-box-${note._id}`);

  deleteBox.addEventListener("click", () => {
    const answer = window.confirm("Are you sure you want to delete this note?");

    if (answer) {
      deleteNote(note._id);
    }
  });
}

function bindToggleVisibilityToNote(note) {
  const toggleCheckbox = document.getElementById(`visible-to-all-${note._id}`);

  toggleCheckbox.addEventListener("change", () => {
    toggleVisibility(note._id, toggleCheckbox.checked);
  });
}

// Create add private note  button
function createPrivateNoteAddButton() {
  const textArea = document.getElementById("new_comment_field");

  const button = document.createElement("button");
  button.textContent = "Add a private note";
  button.id = "add_private_note_button";
  button.type = "button";
  button.classList.add("btn");
  button.classList.add("btn-primary");
  button.classList.add("ml-1");
  button.disabled = textArea && !textArea.value;
  button.onclick = async () => {
    button.disabled = true;
    const commentBoxes = document.querySelectorAll(
      "[data-gid]:not([id]):not(.merge-status-list-wrapper).js-timeline-item"
    );
    const commentBoxCount = commentBoxes.length;
    // Find nearest comment id
    let nearestBox = commentBoxes[commentBoxCount - 1];
    nearestCommentId = nearestBox.getAttribute("data-gid");

    try {
      const { issueId, noteType, projectName, repoOwner } = urlAttributes;

      const newlyCreatedNote = await createNote({
        noteContent,
        noteType,
        issueId,
        nearestCommentId,
        projectName,
        repoOwner,
        noteVisibility: true
      });

      allNotes.push(newlyCreatedNote);
      while (
        nearestBox.nextElementSibling &&
        nearestBox.nextElementSibling.getAttribute("private-id")
      ) {
        nearestBox = nearestBox.nextSibling;
      }
      nearestBox.after(createNoteBox(allNotes[allNotes.length - 1]));
      bindDeleteEventToNote(newlyCreatedNote);
      bindToggleVisibilityToNote(newlyCreatedNote);

      textArea.value = "";
    } catch (error) {
      console.log("Add note error:", error);
    }
  };
  const pvtNoteBtn = document.getElementById("add_private_note_button");
  if (!pvtNoteBtn) {
    return button;
  }
  return null;
}

async function injectContent(apiCall) {
  const addedNoteIds = [];
  const actionBtns = document.querySelector(
    "#partial-new-comment-form-actions > div"
  );
  let commentBtn = {};
  if (actionBtns) {
    [].forEach.call(actionBtns.children, btn => {
      if (
        btn.children.length &&
        btn.children[0] &&
        btn.children[0].innerText === "Comment"
      ) {
        commentBtn = btn;
      }
    });
  }
  if (commentBtn) {
    commentBtn.onclick = () => {
      setTimeout(() => {
        injectContent(false);
      }, 3000);
    };
  }
  const closeIssueBtn = document.getElementsByName("comment_and_close");
  if (closeIssueBtn && closeIssueBtn.length) {
    closeIssueBtn[0].onclick = () => {
      setTimeout(() => {
        injectContent(false);
      }, 3000);
    };
  }
  initInputArea();
  const positionMarker = document.getElementById(
    "partial-new-comment-form-actions"
  );
  // similar comments hide the gitex comments so opening the collapsible similar comments
  const collapsed = document.querySelectorAll(".Details-element.details-reset");
  collapsed.forEach(el => {
    el.setAttribute("open", true);
  });
  if (positionMarker) {
    const makeANoteBtn = createPrivateNoteAddButton();
    if (makeANoteBtn) {
      positionMarker.prepend(makeANoteBtn);
    }
    if (!apiCall) {
      return;
    }
    try {
      const { issueId, noteType, projectName, repoOwner } = urlAttributes;

      // Load all the notes based on issue id
      allNotes = await getAllNotes({
        issueId,
        projectName,
        noteType,
        repoOwner
      });
      if (allNotes.length) {
        // Iterate all the comments and append notes
        const commentBoxes = document.querySelectorAll(
          "[data-gid]:not([id]):not(.merge-status-list-wrapper)"
        );

        commentBoxes.forEach(commentBox => {
          const commentId = commentBox.getAttribute("data-gid");

          const findNotesNearestToComment = obj =>
            obj.nearestCommentId === commentId;
          const notesNearestToCommentBox = allNotes.filter(
            findNotesNearestToComment
          );
          const sortedNotes = notesNearestToCommentBox.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          sortedNotes.forEach(element => {
            const { _id: noteId } = element;
            if (!addedNoteIds.includes(noteId)) {
              addedNoteIds.push(noteId);
              commentBox.after(createNoteBox(element));
              if (commentBox) {
                bindDeleteEventToNote(element);
                bindToggleVisibilityToNote(element);
              }
            }
          });
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  }
}

function init() {
  const {
    location: { href: URL }
  } = document;
  window.chrome.storage.sync.get(["githubPrivateCommentToken"], result => {
    const authToken = result.githubPrivateCommentToken;

    if (!authToken) {
      createFooter();
    } else {
      initUrlAttributes();
      if (checkUrlIsIssueOrPull({ URL })) injectContent(true);
    }
  });
  addSignoutListener();


}

window.onload = () => {
  init();
};

window.addEventListener("message", e => {
  if (e.data && e.data.type === "githubPrivateCommentToken") {
    window.chrome.storage.sync.set({ githubPrivateCommentToken: e.data.value });
  }
});

(document.body || document.documentElement).addEventListener(
  "transitionend",
  () => {
    const {
      location: { href: URL }
    } = document;

    if (checkUrlIsIssueOrPull({ URL })) {
      const privateButton = document.getElementById("add_private_note_button");
      if (!privateButton) init();
    }
  },
  true
);
function addSignoutListener() {
  const logoutBtns = document.querySelectorAll('form[action="/logout"] [type="submit"]');
  const handler = e => {
    chrome.runtime.sendMessage({ logout: true });
  }
  logoutBtns.forEach(btn => btn.addEventListener('click', handler))
}