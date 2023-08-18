const asyncHandler = require('express-async-handler');
const Message = require('../models/message');

const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({});
  return res.status(200).json({ messages });
});

const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.messageId);
  if (!message) {
    res.status(404);
    throw new Error();
  }
  return res.status(200).json({ message });
});

const postNewMessage = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400);
    throw new Error('No message submitted');
  }

  if (!req.body.content) {
    res.status(400);
    throw new Error('No message content submitted');
  }

  if (!req.body.author) {
    res.status(400);
    throw new Error('No author submitted');
  }

  const message = await Message.create({ ...req.body, timestamp: new Date() });
  return res.status(201).json({ message });
});

module.exports = {
  getMessages,
  getMessage,
  postNewMessage,
};
