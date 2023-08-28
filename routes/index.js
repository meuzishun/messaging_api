const router = require('express').Router();
const authRoutes = require('./auth');
const messagesRoutes = require('./messages');
const profileRoutes = require('./profile');
const contactRoutes = require('./contacts');

router.use('/auth', authRoutes);
router.use('/messages', messagesRoutes);
router.use('/profile', profileRoutes);
router.use('/contacts', contactRoutes);

module.exports = router;
