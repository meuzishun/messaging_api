const {
  getMessage,
  getMessages,
  postNewMessage,
} = require('../controllers/messageControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router();

router.get('/', authMiddleware, getMessages);

router.get('/:messageId', authMiddleware, getMessage);

router.post('/new', authMiddleware, postNewMessage);

module.exports = router;
