import OauthService from './oauth.service';

async function createOauth(req, res) {
  const action = await OauthService.authRedirectService(req.query.code);
  if (action.status === 200) {
    res.render('../public/oauth/success.ejs', { accessToken: action.data.accessToken });
  } else {
    res.status(action.status).send({
      message: action.message,
      data: action.data || {},
    });
  }
}
export default {
  createOauth,
};
