const APP_ID = '532649fddafad8da7008';

function openGithubLogin() {
  window.open(
    `https://github.com/login/oauth/authorize?client_id=${APP_ID}&redirect_uri=http://localhost:5000/api/v1/oauth/redirect`,
    '_blank',
  );
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
