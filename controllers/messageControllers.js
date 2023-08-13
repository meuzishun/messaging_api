const getMessages = (req, res) => {
  res.send('Messages route GET');
};

const getMessage = (req, res) => {
  res.send(`Message ${req.params.messageId} route GET`);
};

const postNewMessage = (req, res) => {
  res.send('New message route POST');
};

module.exports = {
  getMessages,
  getMessage,
  postNewMessage,
};
