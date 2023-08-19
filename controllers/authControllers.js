const asyncHandler = require('express-async-handler');
const User = require('../models/user');

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
  return res.status(201).json({ user });
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

  return res.status(200).json({ user });
});

module.exports = {
  postRegister,
  postLogin,
};
