function createFooter() {
  const node = document.createElement('div');
  node.innerHTML = `<div class="private-note-status" style="display: block;"><div class="sign-in">
    <a title="" class="sign-in-now" href="https://morning-headland-55324.herokuapp.com/login/oauth/authorize?client_id=d349f2ece984aa05df0b&redirect_uri=http://localhost:5000/api/v1/oauth/redirect" target="_blank" >Sign in now</a> to use <b>GitEx</b>
  </div>
  <span class="signing-in hide">
    
  </span>
  </div>`;
  const body = document.getElementsByTagName('BODY');
  body[0].after(node);
}

export default createFooter;
