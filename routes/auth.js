const router = require('express').Router();

router.post('/register', (req, res) => {
  res.send('Register POST route');
});

router.post('/login', (req, res) => {
  res.send('Login POST route');
});

router.get('/profile', (req, res) => {
  res.send('Profile GET route');
});

router.post('/profile/edit', (req, res) => {
  res.send('Edit profile POST route');
});

module.exports = router;
