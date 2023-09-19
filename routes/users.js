const router = require('express').Router();
const authHandler = require('../middleware/authMiddleware');
const {
  getUser,
  getUsers,
  searchUsers,
} = require('../controllers/userController');

router.get('/search', searchUsers); // TODO: insert authHandler
router.get('/', getUsers); // TODO: insert authHandler
router.get('/:userId', getUser); // TODO: insert authHandler

module.exports = router;
