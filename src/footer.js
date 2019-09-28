import { APP_ID, REDIRECT_URL } from './constants';

const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${APP_ID}&redirect_uri=${REDIRECT_URL}`;

function createFooter() {
  if (window.location.href.includes('//github.com/')) {
    const node = document.createElement('div');
    node.innerHTML = `<div class="private-note-status" style="display: block;"><div class="sign-in">
    <a title="" class="sign-in-now" href=${AUTH_URL} target="_blank" >Sign in now</a> to use <b>GitEx</b>
  </div>
  <span class="signing-in hide">
     
  </span>
  </div>`;
    const body = document.getElementsByTagName('BODY');
    body[0].after(node);
  }
}

export default createFooter;
