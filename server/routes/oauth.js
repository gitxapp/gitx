const express = require('express');

const axios = require('axios');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

const clientID = '532649fddafad8da7008';
const clientSecret = '82f104495fd89ffa6fc94e301114648bd9f4d07c';

router.get('/redirect', async (req, res) => {
  const requestToken = req.query.code;
  axios({
    // make a POST request
    method: 'post',
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: 'application/json',
    },
  }).then(response => {
    // Once we get the response, extract the access token from
    // the response body
    const { access_token } = response.data;
    const auth_params = response.data;
    try {
      axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
          accept: 'application/json',
          Authorization: `token ${access_token}`,
        },
      }).then(response => {
        console.log('Github Data', response.data);
        const { name: user_name, avatar_url, email: email_id, bio, company, location } = response.data;
        const user = new User({
          user_name,
          email_id,
          auth_params,
          bio,
          company,
          avatar_url,
          location,
        });

        try {
          user.save();
          // return res.cookie('private-user-token', access_token).json({
          //   user,
          //   access_token,
          // });
          res.cookie('private-user-token', access_token).redirect(`/welcome.html?name=${user_name}`);
        } catch (err) {
          res.redirect(`/welcome.html?name=${user_name}`);

          // if (err.name === 'MongoError' && err.code === 11000) {
          //   res.status(401).send({ error: 'Email Id already registered' });
          // } else {
          //   res.status(401).send(err);
          // }
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  });
});
module.exports = router;
