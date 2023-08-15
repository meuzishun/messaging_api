const User = require('../models/user');

const postRegister = async (req, res) => {
  if (!req.body.user) {
    return res.status(400).json({ msg: 'No user sent' });
  }
  const { firstName, lastName, email } = req.body.user;

  const userSearch = await User.findOne({ email });
  if (userSearch) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  if (!firstName) {
    return res.status(400).json({ msg: 'No first name' });
  }

  if (!lastName) {
    return res.status(400).json({ msg: 'No last name' });
  }

  if (!email) {
    return res.status(400).json({ msg: 'No email' });
  }

  const user = await User.create(req.body.user);
  return res.status(201).json({ user });
};

const postLogin = (req, res) => {
  res.send('Login POST route');
};

module.exports = {
  postRegister,
  postLogin,
};
