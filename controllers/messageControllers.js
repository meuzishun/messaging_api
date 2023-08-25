const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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

const postNewMessage = asyncHandler(async (req, res) => {
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

module.exports = {
  getMessages,
  getMessage,
  postNewMessage,
};
