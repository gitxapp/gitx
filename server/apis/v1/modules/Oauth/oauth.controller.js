import OauthService from './oauth.service';

async function createOauth(req, res) {
  const action = await OauthService.authRedirectService(req.query.code);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {},
  });
}
export default {
  createOauth,
};
