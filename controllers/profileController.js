const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(404);
    throw new Error('No user found');
  }

  res.status(200).json({ user });
});

// @desc    Edit user profile
// @route   PUT /api/profile
// @access  Private
const editProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(404);
    throw new Error('No user found');
  }

  const newUser = await User.findByIdAndUpdate(user._id, req.body.data, {
    returnDocument: 'after',
  });

  res.status(201).json({ user: newUser });
});

// @desc    Delete user profile
// @route   DELETE /api/profile
// @access  Private
const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(404);
    throw new Error('No user found');
  }

  await User.findByIdAndDelete(user._id);

  res.status(200).json({ id: user._id });
});

module.exports = {
  getProfile,
  editProfile,
  deleteProfile,
};
