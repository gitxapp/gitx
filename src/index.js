// Could break if GitHub changes its markup
import createNoteBox from './noteBox';
import minAjax from './ajax';
import { URL } from './constants';
import './style.css';

const userId = '5d4145e999c6db6b9d23380b';
let note = null;
let allNotes = [];

let nearest_comment_id = null;
// Check the url is issue or pull
const currentUrl = document.location.toString().toLowerCase();
const urlParams = currentUrl.split('/');
const issue_id = urlParams[urlParams.length - 1];
const note_type = currentUrl.includes('issue') ? 'issue' : 'pull';

// Disable/Enable Add private button based on value entered

function onInputValueChange(e) {
  const addPrivateNoteButton = document.getElementById('add_private_note_button');

  note = e.target.value;

  if (e.target.value.length > 0) {
    // addPrivateNoteButton.disabled = false;
  } else {
    // addPrivateNoteButton.disabled = true;
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
  // button.disabled = true;
  button.onclick = e => {
    // button.disabled = true;
    const commentBoxes = document.querySelectorAll('.js-comment-container:not(.private-note)');
    const commentBoxCount = commentBoxes.length;
    console.log('commentBoxes', commentBoxes);

    // Find nearest comment id
    const nearestBox = commentBoxes[commentBoxCount - 2].querySelector('.js-comment-container [id]').id;
    nearest_comment_id = nearestBox.split('-').pop();
    console.log('Issue Id', issue_id);
    console.log('Comment Id', nearest_comment_id);

    minAjax({
      url: `${URL}note`, // request URL
      type: 'POST', // Request type GET/POST
      data: {
        user_id: userId,
        note_content: note,
        type: note_type,
        issue_id,
        nearest_comment_id,
        nearest_created_date: new Date(),
      },
      success(data) {},
    });
  };
  return button;
}

function init() {
  initInputArea();
  const positionMarker = document.getElementById('partial-new-comment-form-actions');
  if (positionMarker) {
    minAjax({
      url: `${URL}note/${userId}`, // request URL
      type: 'GET', // Request type GET/POST
      success(data) {
        allNotes = JSON.parse(data);
        positionMarker.prepend(createPrivateNoteAddButton());
        // console.log('All Notes ... -->', allNotes);
        const commentBoxes = document.querySelectorAll('.js-comment-container');
        commentBoxes.forEach((commentBox, index) => {
          const commentBoxId = commentBox.querySelector('.timeline-comment-group');
          if (commentBoxId) {
            const commentId = commentBoxId.id.split('-').pop();

            const checkComment = obj => {
              return obj.nearest_comment_id === commentId;
            };
            const checkCommentExist = allNotes.filter(checkComment);
            console.log('checkCommentExist', checkCommentExist);

            checkCommentExist.reverse().forEach(element => {
              commentBox.after(createNoteBox(index, element));
            });
          }

          // document.getElementById(`comment-box-${index}`).addEventListener('click', e => {
          // delete functionality of comment boxes
          //   console.log(index);
          // });
        });
      },
    });
  } else {
    console.log('Extension: position marker not found.');
  }
}
window.onload = () => {
  init();
};
// loadAllTheNotes();
