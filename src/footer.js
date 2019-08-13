function createFooter() {
  if (window.location.href.includes('//github.com/')) {
    const node = document.createElement('div');
    node.innerHTML = `<div class="private-note-status" style="display: block;"><div class="sign-in">
    <a title="" class="sign-in-now" href='https://github.com/login/oauth/authorize?client_id=d349f2ece984aa05df0b&redirect_uri=https://morning-headland-55324.herokuapp.com/api/v1/oauth/redirect
    ' target="_blank" >Sign in now</a> to use <b>GitEx</b>
  </div>
  <span class="signing-in hide">
    
  </span>
  </div>`;
    const body = document.getElementsByTagName('BODY');
    body[0].after(node);
  }
}

export default createFooter;
