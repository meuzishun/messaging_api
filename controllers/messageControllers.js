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

  if (!ObjectId.isValid(messageId)) {
    res.status(400);
    throw new Error('Message id is wrong format');
  }

  const message = await Message.findById(messageId);

  if (!message) {
    res.status(404);
    throw new Error('No message found with id');
  }

  return res.status(200).json({ message });
});

const postNewMessage = asyncHandler(async (req, res) => {
  if (!req.body.data) {
    res.status(400);
    throw new Error('No message submitted');
  }

  const { content, author } = req.body.data;

  if (!content) {
    res.status(400);
    throw new Error('No message content submitted');
  }

  if (!author) {
    res.status(400);
    throw new Error('No author submitted');
  }

  const message = await Message.create({
    ...req.body.data,
    timestamp: new Date(),
  });

  return res.status(201).json({ message });
});

module.exports = {
  getMessages,
  getMessage,
  postNewMessage,
};
