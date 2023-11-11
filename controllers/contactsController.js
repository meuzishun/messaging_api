const { body, param, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// @desc    Get contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id).populate('friends');

  if (!user) {
    res.status(404);
    throw new Error('No user found');
  }

  const contacts = user.friends.map((friend) => {
    return {
      firstName: friend.firstName,
      lastName: friend.lastName,
      email: friend.email,
    };
  });

  res.status(200).json({ contacts });
});

// @desc    Add new contact
// @route   PUT /api/contacts
// @access  Private
const addContact = [
  body('contactId').isMongoId().withMessage('Invalid contact ID'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400);
      throw new Error(errorMessages[0]);
    }

    if (req.body.user._id.toString() === req.body.contactId) {
      res.status(400);
      throw new Error('Invalid contact ID');
    }

    const user = await User.findById(req.body.user._id);

    if (!user) {
      res.status(404);
      throw new Error('No user found');
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { friends: req.body.contactId } },
      { returnDocument: 'after' }
    );

    res.status(201).json({ user: updatedUser });
  }),
];

// @desc    Get contact
// @route   GET /api/contacts/:contactId
// @access  Private
const getContact = [
  param('contactId').isMongoId().withMessage('Invalid contact ID'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400);
      throw new Error(errorMessages[0]);
    }

    const user = await User.findOne({
      _id: req.body.user._id,
      friends: { $in: [req.params.contactId] },
    });

    if (!user) {
      res.status(400);
      throw new Error('Contact not friend');
    }

    const contact = await User.findById(req.params.contactId);

    res.status(200).json({ contact });
  }),
];

// @desc    Delete contact
// @route   DELETE /api/contacts/:contactId
// @access  Private
const deleteContact = [
  param('contactId').isMongoId().withMessage('Invalid contact ID'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400);
      throw new Error(errorMessages[0]);
    }

    const user = await User.findOne({
      _id: req.body.user._id,
      friends: { $in: [req.params.contactId] },
    });

    if (!user) {
      res.status(400);
      throw new Error('Contact not friend');
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.body.user._id },
      { $pull: { friends: req.params.contactId } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(500);
      throw new Error('Updated user error');
    }

    res.status(201).json({ user: updatedUser });
  }),
];

module.exports = {
  getContacts,
  addContact,
  getContact,
  deleteContact,
};
