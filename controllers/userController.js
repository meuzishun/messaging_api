const asyncHandler = require('express-async-handler');
const { query, param, validationResult } = require('express-validator');
const User = require('../models/user');

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = [
  query('query').not().isEmpty().withMessage('Query string is invalid'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400);
      throw new Error(errorMessages[0]);
    }

    const { query } = req.query;

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json({ users });
  }),
];

// @desc    Get single user
// @route   GET /api/users/:userId
// @access  Private
const getUser = [
  param('userId').isMongoId().withMessage('Invalid user ID'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400);
      throw new Error(errorMessages[0]);
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(400);
      throw new Error('No user found');
    }

    res.status(200).json({ user });
  }),
];

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
