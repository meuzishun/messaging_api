const router = require('express').Router();
const authHandler = require('../middleware/authMiddleware');
const {
  getMessage,
  getMessages,
  createMessage,
} = require('../controllers/messageController');

router.get('/', authHandler, getMessages);
router.get('/:messageId', authHandler, getMessage);
router.post('/new', authHandler, createMessage);

module.exports = router;
