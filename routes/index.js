const authRoutes = require('./auth');
const messagesRoutes = require('./messages');
const {
  getContacts,
  getProfile,
  editProfile,
} = require('../controllers/userController');
const router = require('express').Router();

router.use('/auth', authRoutes);
router.use('/messages', messagesRoutes);
router.get('/contacts', getContacts);
router.get('/profile', getProfile);
router.post('/profile/edit', editProfile);

module.exports = router;
