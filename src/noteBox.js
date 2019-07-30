function createCommentBox(index) {
  const wrapper = document.createElement('div');
  wrapper.classList = ['timeline-comment-group js-minimizable-comment-group js-targetable-comment'];
  const content = document.createElement('div');
  content.classList = [
    'unminimized-comment comment previewable-edit js-task-list-container editable-comment js-comment timeline-comment reorderable-task-lists current-user',
  ];
  const timelineWrapper = document.createElement('div');
  timelineWrapper.classList = ['timeline-comment-header clearfix'];

  const timeLineAction = document.createElement('div');
  timeLineAction.classList = ['timeline-comment-actions js-timeline-comment-actions'];
  const timeLineActionDetails = document.createElement('details');
  timeLineActionDetails.classList = ['details-overlay details-reset position-relative d-inline-block '];
  timeLineActionDetails.innerHTML = `<summary class="btn-link timeline-comment-action" aria-haspopup="menu">
    <svg aria-label="Show options" class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM13 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg>
    </summary>
    <details-menu class="dropdown-menu dropdown-menu-sw show-more-popover text-gray-dark anim-scale-in" style="width:185px" role="menu">
      <button type="button" id="comment-box-${index}" class="dropdown-item menu-item-danger btn-link" aria-label="Delete comment">
        Delete
      </button>
    </details-menu>`;
  timeLineAction.append(timeLineActionDetails);
  timelineWrapper.append(timeLineAction);
  const timelineH3 = document.createElement('h3');
  timelineH3.classList = ['timeline-comment-header-text f5 text-normal'];
  timelineH3.innerHTML = '<strong class="css-truncate expandable"><a class="author text-inherit css-truncate-target">karthikvillanchira</a></strong>';
  timelineWrapper.append(timelineH3);

  // wip
  // const actions = document.createElement('div');
  // actions.classList = ['timeline-comment-actions js-timeline-comment-actions'];

  content.append(timelineWrapper);
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
  td.innerHTML = '<p>settings</p>';
  tr.appendChild(td);
  tbody.appendChild(tr);
  table.appendChild(tbody);
  taskList.appendChild(table);
  commentBodyWrapper.appendChild(taskList);
  content.append(commentBodyWrapper);
  wrapper.append(content);
  return wrapper;
}

function createAvatar() {
  const avatarWrapper = document.createElement('div');
  avatarWrapper.classList = ['avatar-parent-child timeline-comment-avatar'];

  // a tag
  const avatarA = document.createElement('a');
  avatarA.href = 'www.google.com'; // change this
  avatarA.classList = ['d-inline-block'];
  avatarA.setAttribute('data-hovercard-type', 'user');
  avatarA.setAttribute('data-hovercard-url', '/hovercards?user_id=22343433'); // change this
  avatarA.setAttribute('data-octo-click', 'hovercard-link-click');
  avatarA.setAttribute('data-octo-dimensions', 'link_type:self');

  // image tag
  const avatarImg = document.createElement('img');
  avatarImg.classList = ['avatar rounded-1'];
  avatarImg.height = '44';
  avatarImg.width = '44';
  avatarImg.alt = '@karthikvillanchira'; // change this
  avatarImg.src = 'https://avatars1.githubusercontent.com/u/22343433?s=180&v=4'; // chnage this
  avatarA.appendChild(avatarImg);
  avatarWrapper.appendChild(avatarA);
  return avatarWrapper;
}


export default function createNoteBox(index) {
  // const commentBody = document.querySelector('#discussion_bucket > div.col-9 > div > div.js-discussion.js-socket-channel');
  const note = document.createElement('div');

  note.classList = ['timeline-comment-wrapper js-comment-container'];
  note.appendChild(createAvatar());
  note.appendChild(createCommentBox(index));
  // note.innerHTML = '<p>sssp</p>'
  return note;
  // document
  //   .querySelector(`#discussion_bucket > div.col-9 > div > div.js-discussion.js-socket-channel > div:nth-child(${commentBody.children.length - 1})`)
  //   .after(note);
}