function openGithubLogin() {
  console.log('eeee');
  window.open(
    'https://github.com/login/oauth/authorize?client_id=532649fddafad8da7008&redirect_uri=http://localhost:5000/api/v1/oauth/redirect',
    '_blank',
  );
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('github-login-btn').addEventListener('click', () => {
    openGithubLogin();
    console.log('eee');
  });
});
