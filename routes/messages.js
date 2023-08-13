const {
  getMessage,
  getMessages,
  postNewMessage,
} = require('../controllers/messageControllers');

const router = require('express').Router();

router.get('/', getMessages);

router.get('/:messageId', getMessage);

router.post('/new', postNewMessage);

module.exports = router;
