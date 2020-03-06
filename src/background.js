import { UN_INSTALL_URL, INSTALL_URL } from "./constants";
import { getOauthURL } from "./helpers";

function openGithubLogin() {
  window.chrome.tabs.create({ url: getOauthURL() });
}

function checkForAuth() {
  const loginBtn = document.getElementById("github-login-btn");
  const logoutBtn = document.getElementById("github-logout-btn");
  const loginMsg = document.getElementById("login-msg");
  const logoutMsg = document.getElementById("loggedout-msg");
  window.chrome.storage.sync.get(["githubPrivateCommentToken"], result => {
    const authToken = result.githubPrivateCommentToken;
    if (!authToken) {
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
      loginMsg.style.display = "none";
      logoutMsg.style.display = "block";
    } else {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
      logoutMsg.style.display = "none";
      loginMsg.style.display = "block";
    }
  });
}

function openGithubLogout() {
  window.chrome.storage.sync.remove(["githubPrivateCommentToken"], () => {
    checkForAuth();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("github-login-btn");
  const logoutBtn = document.getElementById("github-logout-btn");
  loginBtn.addEventListener("click", () => {
    openGithubLogin();
  });
  logoutBtn.addEventListener("click", () => {
    openGithubLogout();
  });
  checkForAuth();
});
// window.chrome.runtime.setUninstallURL(UN_INSTALL_URL);
window.chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === "install") {
    // window.chrome.tabs.create({ url: INSTALL_URL });
  }
});
