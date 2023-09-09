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

// @desc    Post new contact
// @route   POST /api/contacts
// @access  Private
const addContact = async (req, res) => {
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
};

// @desc    Get contact
// @route   GET /api/contacts/:contactId
// @access  Private
const getContact = asyncHandler(async (req, res) => {
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
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:contactId
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
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
});

module.exports = {
  getContacts,
  addContact,
  getContact,
  deleteContact,
};
