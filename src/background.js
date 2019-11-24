import browser from 'webextension-polyfill';
import {
 APP_ID, REDIRECT_URL, UN_INSTALL_URL, INSTALL_URL 
} from './constants';

const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${APP_ID}&redirect_uri=${REDIRECT_URL}`;
function openGithubLogin() {
  browser.tabs.create({ url: AUTH_URL });
}

async function checkForAuth() {
  const loginBtn = document.getElementById('github-login-btn');
  const logoutBtn = document.getElementById('github-logout-btn');
  const loginMsg = document.getElementById('login-msg');
  const logoutMsg = document.getElementById('loggedout-msg');
  browser.storage.sync.get(['githubPrivateCommentToken']).then(result => {
    const authToken = result.githubPrivateCommentToken;
    if (!authToken) {
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
      loginMsg.style.display = 'none';
      logoutMsg.style.display = 'block';
    } else {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      logoutMsg.style.display = 'none';
      loginMsg.style.display = 'block';
    }
  });
}

function openGithubLogout() {
  browser.storage.sync.remove(['githubPrivateCommentToken']).then(() => {
    checkForAuth();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('github-login-btn');
  const logoutBtn = document.getElementById('github-logout-btn');
  loginBtn.addEventListener('click', () => {
    openGithubLogin();
  });
  logoutBtn.addEventListener('click', () => {
    openGithubLogout();
  });
  checkForAuth();
});
browser.runtime.setUninstallURL(UN_INSTALL_URL);
browser.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    browser.tabs.create({ url: INSTALL_URL });
  }
});
