const router = require('express').Router();
const { getProfile, editProfile } = require('../controllers/profileController');

router.get('/', getProfile);
router.post('/edit', editProfile);

module.exports = router;
