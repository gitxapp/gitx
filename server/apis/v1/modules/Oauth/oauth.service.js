import axios from 'axios';
import UserService from '../User/user.service';

async function authRedirectService(requestToken) {
  try {
    const accessTokenResponse = await axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${
        process.env.GITHUB_CLIENT_SECRET
      }&code=${requestToken}`,
      headers: {
        accept: 'application/json',
      },
    });
    const { access_token: accessToken } = accessTokenResponse.data;
    if (!accessToken) {
      return {
        status: 400,
        message: 'Oauth failed',
        data: {
          error: accessTokenResponse.data,
        },
      };
    }
    const authParams = accessTokenResponse.data;
    const userDetailsResponse = await axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });
    const { login: userName, avatar_url: avatarUrl, email, bio, company, location, id: githubId } = userDetailsResponse.data;
    await UserService.createOrUpdate({
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
      message: 'User logged in',
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
