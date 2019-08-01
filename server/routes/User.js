const express = require('express');
const async = require('async');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.log('error', err);

    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(401).send({ error: 'Email Id already registered' });
    } else {
      res.status(401).send(err);
    }
  }
});

router.post('/', async (req, res) => {
  const { user_name, avatar_url, email_id, bio, company, location, github_id, auth_params } = req.body;

  const user = new User({
    user_name,
    email_id,
    auth_params,
    bio,
    company,
    avatar_url,
    location,
    github_id,
  });

  try {
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(401).send({ error: 'Email Id already registered' });
    } else {
      res.status(401).send(err);
    }
  }
});

module.exports = router;
