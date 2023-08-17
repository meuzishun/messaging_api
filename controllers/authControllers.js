const User = require('../models/user');

const postRegister = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ msg: 'No user data submitted' });
  }

  const { firstName, lastName, email, password } = req.body;

  if (!firstName) {
    return res.status(400).json({ msg: 'No first name' });
  }

  if (!lastName) {
    return res.status(400).json({ msg: 'No last name' });
  }

  if (!email) {
    return res.status(400).json({ msg: 'No email' });
  }

  if (!password) {
    return res.status(400).json({ msg: 'No password' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const user = await User.create(req.body);
  return res.status(201).json({ user });
};

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
