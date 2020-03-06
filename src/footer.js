import { getOauthURL } from "./helpers";

function createFooter() {
  if (window.location.href.includes("//github.com/")) {
    const node = document.createElement("div");
    node.innerHTML = `<div class="private-note-status" style="display: block;"><div class="sign-in">
    <a title="" class="sign-in-now" href=${getOauthURL()} target="_blank" >Sign in now</a> to use <b>GitX</b>
  </div>
  <span class="signing-in hide">
     
  </span> 
  </div>`;
    const body = document.getElementsByTagName("BODY");
    body[0].after(node);
  }
}

export default createFooter;
