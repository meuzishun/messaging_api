const router = require('express').Router();
const { getContacts } = require('../controllers/contactsController');

router.get('/', getContacts);

module.exports = router;
