'use strict';
const express = require('express');
const router = express.Router();
router.use('/user', require('./user'));
router.use('/oauth', require('./oauth'));
router.use('/note', require('./note'));

module.exports = router;
