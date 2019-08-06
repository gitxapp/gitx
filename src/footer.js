function createFooter() {
  const node = document.createElement('div');
  node.innerHTML = `<div class="private-note-status" style="display: block;"><div class="sign-in">
    <a title="" class="sign-in-now" href="https://github.com/login/oauth/authorize?client_id=532649fddafad8da7008&redirect_uri=http://localhost:5000/api/v1/oauth/redirect" target="_blank" >Sign in now</a> to use <b>GitEx</b>
  </div>
  <span class="signing-in hide">
    
  </span>
  </div>`;
  const body = document.getElementsByTagName('BODY');
  body[0].after(node);
}

export default createFooter;
