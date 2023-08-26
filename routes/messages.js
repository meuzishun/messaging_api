const {
  getMessage,
  getMessages,
  createMessage,
} = require('../controllers/messageController');
const authHandler = require('../middleware/authMiddleware');

const router = require('express').Router();

router.get('/', authHandler, getMessages);

router.get('/:messageId', authHandler, getMessage);

router.post('/new', authHandler, createMessage);

module.exports = router;
