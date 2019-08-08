const APP_ID = '532649fddafad8da7008';
const REDIRECT_URL = 'https://morning-headland-55324.herokuapp.com/api/v1/oauth/redirect';
const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${APP_ID}&redirect_uri=${REDIRECT_URL}`;
function openGithubLogin() {
  window.open(AUTH_URL, '_blank');
}

function checkForAuth() {
  const loginBtn = document.getElementById('github-login-btn');
  const logoutBtn = document.getElementById('github-logout-btn');
  window.chrome.storage.sync.get(['githubPrivateCommentToken'], result => {
    const authToken = result.githubPrivateCommentToken;
    if (!authToken) {
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
    } else {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
    }
  });
}

function openGithubLogout() {
  window.chrome.storage.sync.remove(['githubPrivateCommentToken'], () => {
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
