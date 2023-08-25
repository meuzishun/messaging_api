const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getMessages = asyncHandler(async (req, res) => {
  const heads = await Message.find({
    participants: { $in: req.body.user._id },
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
  const { messageId } = req.params;
  const user = req.body.user;

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
  if (!req.body.data) {
    res.status(400);
    throw new Error('No message submitted');
  }

  const { data, user } = req.body;

  if (!data) {
    res.status(400);
    throw new Error('No message content submitted');
  }

  if (!user) {
    res.status(400);
    throw new Error('No author submitted');
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
