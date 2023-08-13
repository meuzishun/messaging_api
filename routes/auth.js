const {
  postRegister,
  postLogin,
  getProfile,
  postProfileEdit,
} = require('../controllers/authControllers');

const router = require('express').Router();

router.post('/register', postRegister);

router.post('/login', postLogin);

router.get('/profile', getProfile);

router.post('/profile/edit', postProfileEdit);

module.exports = router;
