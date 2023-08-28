const router = require('express').Router();
const authHandler = require('../middleware/authMiddleware');
const {
  getMessages,
  getMessage,
  createMessage,
  editMessage,
  deleteMessage,
} = require('../controllers/messageController');

router.get('/', authHandler, getMessages);
router.get('/:messageId', authHandler, getMessage);
router.post('/new', authHandler, createMessage);
router.put('/:messageId/edit', authHandler, editMessage);
router.delete('/:messageId', authHandler, deleteMessage);

module.exports = router;
