function createFooter() {
  const node = document.createElement('div');
  node.innerHTML = `<div class="private-note-status" style="display: block;"><div class="sign-in">
    <a title="" class="sign-in-now" href="www.google.com" target="_blank" >Sign in now</a> to use <b>GitEx</b>
  </div>
  <span class="signing-in hide">
    Signing in...
  </span>
  </div>`;
  const body = document.getElementsByTagName('BODY');
  body[0].after(node);
}

export default createFooter;
