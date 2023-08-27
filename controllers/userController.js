const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const pathToKey = path.join(__dirname, '..', '/config/id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

// @desc    Register user
// @route   POST /register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, PRIV_KEY, {
    expiresIn: '10d',
    algorithm: 'RS256',
  });

  return res.status(201).json({ user, token });
});

// @desc    Login user
// @route   POST /login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
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

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    res.status(401);
    throw new Error('Incorrect password');
  }

  const token = jwt.sign({ id: user._id }, PRIV_KEY, {
    expiresIn: '10d',
    algorithm: 'RS256',
  });

  return res.status(200).json({ user, token });
});

const getContacts = (req, res) => {
  res.send('Contacts GET route');
};

const getProfile = (req, res) => {
  res.send('Profile GET route');
};

const editProfile = (req, res) => {
  res.send('Edit profile POST route');
};

module.exports = {
  registerUser,
  loginUser,
  getContacts,
  getProfile,
  editProfile,
};
