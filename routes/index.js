const messagesRoutes = require('./messages');
const {
  registerUser,
  loginUser,
  getContacts,
  getProfile,
  editProfile,
} = require('../controllers/userController');
const router = require('express').Router();

router.use('/messages', messagesRoutes);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/contacts', getContacts);
router.get('/profile', getProfile);
router.post('/profile/edit', editProfile);

module.exports = router;
