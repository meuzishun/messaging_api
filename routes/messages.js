const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Messages route GET');
});

router.get('/:messageId', (req, res) => {
  res.send(`Message ${req.params.messageId} route GET`);
});

router.post('/new', (req, res) => {
  res.send('New message route POST');
});

module.exports = router;
