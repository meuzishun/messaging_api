const messagesRoutes = require('./messages');

const { postRegister, postLogin } = require('../controllers/authControllers');
const {
  getContacts,
  getProfile,
  postProfileEdit,
} = require('../controllers/userControllers');

const router = require('express').Router();

router.use('/messages', messagesRoutes);
router.post('/register', postRegister);
router.post('/login', postLogin);
router.get('/contacts', getContacts);
router.get('/profile', getProfile);
router.post('/profile/edit', postProfileEdit);

module.exports = router;
