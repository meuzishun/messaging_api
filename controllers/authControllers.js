const asyncHandler = require('express-async-handler');
const User = require('../models/user');

const postRegister = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400);
    throw new Error('No user data submitted');
  }

  const { firstName, lastName, email, password } = req.body;

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

  const user = await User.create(req.body);
  return res.status(201).json({ user });
});

const postLogin = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ msg: 'No user submitted' });
  }
  const { email, password } = req.body;

  if (!password) {
    return res.status(400).json({ msg: 'No password' });
  }

  if (!email) {
    return res.status(400).json({ msg: 'No email' });
  }

  const users = await User.find({ email });
  if (users.length === 0) {
    return res.status(400).json({ msg: 'No user with that email' });
  }
};

module.exports = {
  postRegister,
  postLogin,
};
