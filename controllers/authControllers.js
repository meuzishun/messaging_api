const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const pathToKey = path.join(__dirname, '..', '/config/id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const postRegister = asyncHandler(async (req, res) => {
  if (!req.body.data) {
    res.status(400);
    throw new Error('No user data submitted');
  }

  const { firstName, lastName, email, password } = req.body.data;

  if (!firstName) {
    res.status(400);
    throw new Error('No first name');
  }

  if (!lastName) {
    res.status(400);
    throw new Error('No last name');
  }

  if (!email) {
    res.status(400);
    throw new Error('No email');
  }

  if (!password) {
    res.status(400);
    throw new Error('No password');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create(req.body.data);

  const token = jwt.sign({ id: user._id }, PRIV_KEY, {
    expiresIn: '10d',
    algorithm: 'RS256',
  });

  return res.status(201).json({ user, token });
});

const postLogin = asyncHandler(async (req, res) => {
  if (!req.body.data) {
    res.status(400);
    throw new Error('No user submitted');
  }
  const { email, password } = req.body.data;

  if (!password) {
    res.status(400);
    throw new Error('No password');
  }

  if (!email) {
    res.status(400);
    throw new Error('No email');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('No user with that email');
  }

  if (user.password !== password) {
    res.status(400);
    throw new Error('Incorrect password');
  }

  const token = jwt.sign({ id: user._id }, PRIV_KEY, {
    expiresIn: '10d',
    algorithm: 'RS256',
  });

  return res.status(200).json({ user, token });
});

module.exports = {
  postRegister,
  postLogin,
};
