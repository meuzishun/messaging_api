const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const users = await User.find({
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  });

  res.status(200).json({ users });
});

// @desc    Get single user
// @route   GET /api/users/:userId
// @access  Private
const getUser = async (req, res) => {
  res.json({ msg: 'Get single user' });
};

// @desc    Get users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  res.json({ msg: 'Get all users' });
};

module.exports = {
  searchUsers,
  getUser,
  getUsers,
};
