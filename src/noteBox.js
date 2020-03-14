import { findTimeAgo } from './helpers';

/* eslint-disable no-underscore-dangle */
function createCommentBox(noteDetail) {
  const { author, createdAt, userDetails } = noteDetail;
  const { userName, githubId } = author;
  const noteAdmin = githubId.toString() === userDetails.githubId.toString();

  const createdTimeAgo = findTimeAgo({ date: new Date(createdAt) });

  const wrapper = document.createElement('div');
  wrapper.classList = [
    'timeline-comment-group js-minimizable-comment-group js-targetable-comment TimelineItem-body my-0 ',
  ];

  const innerWrapper1 = document.createElement('div');
  innerWrapper1.classList = ['ml-n3 minimized-comment position-relative  d-none '];

  const innerWrapper2 = document.createElement('div');
  innerWrapper2.classList = [
    'ml-n3 timeline-comment unminimized-comment comment previewable-edit js-task-list-container editable-comment js-comment timeline-comment--caret reorderable-task-lists current-user',
  ];

  const timelineWrapper = document.createElement('div');
  timelineWrapper.classList = ['timeline-comment-header clearfix'];

  const timeLineAction = document.createElement('div');
  timeLineAction.classList = ['timeline-comment-actions js-timeline-comment-actions'];

  const privateNoteLabel = document.createElement('span');
  privateNoteLabel.classList = [
    'timeline-comment-label tooltipped tooltipped-multiline tooltipped-s pvt-note-label',
  ];
  privateNoteLabel.setAttribute('aria-label', 'This is a private note');
  privateNoteLabel.innerText = 'Private note';
  timeLineAction.append(privateNoteLabel);
  const timeLineActionDetails = document.createElement('details');
  timeLineActionDetails.classList = [
    'details-overlay details-reset position-relative d-inline-block',
  ];
  timeLineActionDetails.innerHTML = `<summary class="btn-link timeline-comment-action" aria-haspopup="menu">
    <svg aria-label="Show options" class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM13 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg>
    </summary>
    <details-menu class="dropdown-menu dropdown-menu-sw show-more-popover text-gray-dark anim-scale-in" style="width:185px" role="menu">
    <div class="dropdown-item"  >
      <label class="visible-to-all-text" for="visible-to-all-${
        noteDetail._id
      }" >Visible to collaborators
    </label>   
      <input type="checkbox" class="visible-to-all" value="1" id="visible-to-all-${
        noteDetail._id
      }" ${noteDetail.noteVisibility ? ' checked="checked" ' : ''}>
    </div>
    <div role="none" class="dropdown-divider"></div>
      <button type="button" id="comment-box-${
        noteDetail._id
      }" class="dropdown-item menu-item-danger btn-link" aria-label="Delete comment">
        Delete
      </button>
    </details-menu>`;

  timeLineAction.append(timeLineActionDetails);

  timelineWrapper.append(timeLineAction);
  const timelineH3 = document.createElement('h3');
  timelineH3.classList = ['timeline-comment-header-text f5 text-normal'];
  timelineH3.innerHTML = `<strong class=“css-truncate”><a class=“author link-gray-dark css-truncate-target width-fit” show_full_name=“false” data-hovercard-type=“user” data-hovercard-url=“/users/${userName}/hovercard” data-octo-click=“hovercard-link-click” data-octo-dimensions=“link_type:self” href=“/${userName}“>${userName}</a></strong>`;
  const timestamp = document.createElement('span');
  timestamp.classList = ['timestamp js-timestamp'];

  timestamp.innerHTML = `   added ${createdTimeAgo}`;

  timelineH3.append(timestamp);
  timelineWrapper.append(timelineH3);

  innerWrapper2.append(timelineWrapper);
  const commentBodyWrapper = document.createElement('div');
  commentBodyWrapper.classList = ['edit-comment-hide js-edit-comment-hide'];
  const taskList = document.createElement('task-lists');
  taskList.setAttribute('sortable', true);
  const table = document.createElement('table');
  table.classList = ['d-block'];
  const tbody = document.createElement('tbody');
  tbody.classList = ['d-block'];
  const tr = document.createElement('tr');
  tr.classList = ['d-block'];
  const td = document.createElement('td');
  td.classList = ['d-block comment-body markdown-body  js-comment-body'];
  td.innerHTML = noteDetail.noteContent;
  tr.appendChild(td);
  tbody.appendChild(tr);
  table.appendChild(tbody);
  taskList.appendChild(table);
  commentBodyWrapper.appendChild(taskList);
  innerWrapper2.append(commentBodyWrapper);
  wrapper.append(innerWrapper1);
  wrapper.append(innerWrapper2);
  if (!noteAdmin) {
    wrapper.getElementsByClassName('btn-link timeline-comment-action')[0].style.visibility =
      'hidden';
  }

  return wrapper;
}

function createAvatar({ userName, githubId, avatarUrl }) {
  const avatarWrapper = document.createElement('div');
  avatarWrapper.classList = ['avatar-parent-child TimelineItem-avatar'];

  // a tag
  const avatarA = document.createElement('a');
  avatarA.href = `/${userName}`;
  avatarA.classList = ['d-inline-block'];
  avatarA.setAttribute('data-hovercard-type', 'user');
  avatarA.setAttribute('data-hovercard-url', `/hovercards?user_id=${githubId}`);
  avatarA.setAttribute('data-octo-click', 'hovercard-link-click');
  avatarA.setAttribute('data-octo-dimensions', 'link_type:self');

  // image tag
  const avatarImg = document.createElement('img');
  avatarImg.classList = ['avatar rounded-1'];
  avatarImg.height = '44';
  avatarImg.width = '44';
  avatarImg.alt = `@${userName}`;
  avatarImg.src = `${avatarUrl}?s=180`;
  avatarA.appendChild(avatarImg);
  avatarWrapper.appendChild(avatarA);
  return avatarWrapper;
}

export default function createNoteBox(noteDetail) {
  if (!noteDetail.author) {
    noteDetail.author = {};
  }
  const { avatarUrl, githubId, userName } = noteDetail.author;
  const noteNode = document.createElement('div');
  noteNode.classList = ['js-timeline-item js-timeline-progressive-focus-container private-note'];
  noteNode.setAttribute('private-id', noteDetail._id);

  const noteWrapper = document.createElement('div');
  noteWrapper.classList = ['TimelineItem js-comment-container'];
  noteWrapper.appendChild(createAvatar({ userName, githubId, avatarUrl }));
  noteWrapper.appendChild(createCommentBox(noteDetail));

  noteNode.appendChild(noteWrapper);

  return noteNode;
}
