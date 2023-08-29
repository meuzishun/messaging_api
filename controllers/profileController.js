const User = require('../models/user');

const getProfile = async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(404);
    throw new Error('No user found');
  }

  res.status(200).json({ user });
};

const editProfile = async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(404);
    throw new Error('No user found');
  }

  const newUser = await User.findByIdAndUpdate(user._id, req.body.data, {
    returnDocument: 'after',
  });

  res.status(201).json({ user: newUser });
};

const deleteProfile = async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(404);
    throw new Error('No user found');
  }

  await User.findByIdAndDelete(user._id);

  res.status(200).json({ id: user._id });
};

module.exports = {
  getProfile,
  editProfile,
  deleteProfile,
};
