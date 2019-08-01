import axios from 'axios';
import UserService from '../User/user.service';

const clientID = '532649fddafad8da7008';
const clientSecret = '82f104495fd89ffa6fc94e301114648bd9f4d07c';

async function authRedirectService(requestToken) {
  try {
    const accessTokenResponse = await axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      headers: {
        accept: 'application/json',
      },
    });
    const { access_token: accessToken } = accessTokenResponse.data;
    const authParams = accessTokenResponse.data;
    const userDetailsResponse = await axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });
    // eslint-disable-next-line max-len
    // eslint-disable-next-line object-curly-newline
    // eslint-disable-next-line max-len
    const { user_name: userName, avatar_url: avatarUrl, email_id: email, bio, company, location, github_id: githubId } = userDetailsResponse.data;
    await UserService.createUser({
      userName,
      githubId,
      email,
      avatarUrl,
      company,
      location,
      bio,
      authParams,
      accessToken,
    });
    return {
      status: 200,
      message: 'User created',
      data: {
        accessToken,
        userName,
      },
    };
  } catch (error) {
    return {
      status: 400,
      message: 'User not created',
      data: {
        error,
      },
    };
  }
}

export default {
  authRedirectService,
};
