const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @desc    Get messages
// @route   GET /messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(400);
    throw new Error('No user found');
  }

  const heads = await Message.find({
    participants: { $in: user._id },
    parentId: null,
  })
    .populate('author')
    .populate('participants');

  const threads = heads.map((head) => [head]);

  for (let i = 0; i < threads.length; i++) {
    let searching = true;

    while (searching) {
      let lastMessage = threads[i].at(-1);

      let message = await Message.findOne({
        parentId: lastMessage._id,
      })
        .populate('author')
        .populate('participants');

      if (message) {
        threads[i].push(message);
      }

      if (!message) {
        searching = false;
      }
    }
  }

  return res.status(200).json({ messages: threads });
});

// @desc    Get a single message
// @route   GET /message/:messageId
// @access  Private
const getMessage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(400);
    throw new Error('No user found');
  }

  const { messageId } = req.params;

  if (!ObjectId.isValid(messageId)) {
    res.status(400);
    throw new Error('Message id is wrong format');
  }

  const message = await Message.findById(messageId);

  if (!message) {
    res.status(404);
    throw new Error('No message found with id');
  }

  if (message.author.toString() !== user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized, message not authored by user');
  }

  return res.status(200).json({ message });
});

// @desc    Post messages
// @route   POST /messages/new
// @access  Private
const createMessage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(400);
    throw new Error('No author submitted');
  }

  const data = req.body.data;

  if (!data) {
    res.status(400);
    throw new Error('No message submitted');
  }

  const message = await Message.create({
    ...req.body.data,
    author: user._id,
    timestamp: new Date(),
  });

  return res.status(201).json({ message });
});

// @desc    Edit message
// @route   PUT /messages/:messageId/edit
// @access  Private
const editMessage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(401);
    throw new Error('No author submitted');
  }

  const message = await Message.findById(req.params.messageId);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (user._id.toString() !== message.author.toString()) {
    res.status(400);
    throw new Error(
      'Cannot alter message when author and user ids do not match'
    );
  }

  const newData = req.body.data;

  if (!newData) {
    res.status(400);
    throw new Error('No message data sent');
  }

  const newMessage = await Message.findByIdAndUpdate(
    req.params.messageId,
    {
      content: newData.content,
      timestamp: new Date(),
    },
    { returnDocument: 'after' }
  );

  res.status(201).json({ message: newMessage });
});

// @desc    Delete message
// @route   DELETE /messages/:messageId
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user._id);

  if (!user) {
    res.status(401);
    throw new Error('No user found');
  }

  const message = await Message.findById(req.params.messageId);

  if (!message) {
    res.status(404);
    throw new Error('No message found');
  }

  if (user._id.toString() !== message.author.toString()) {
    res.status(400);
    throw new Error(
      'Cannot delete message when author and user ids do not match'
    );
  }

  const deletedMsgId = await Message.findByIdAndDelete(req.params.messageId);

  res.status(200).json({ id: message._id });
});

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  editMessage,
  deleteMessage,
};
