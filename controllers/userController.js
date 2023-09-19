// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  res.json({ msg: 'Searching users...' });
};

// @desc    Get single user
// @route   GET /api/users/:userId
// @access  Private
const getUser = async (req, res) => {
  res.json({ msg: 'Get single user' });
};

// @desc    Get users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  res.json({ msg: 'Get all users' });
};

module.exports = {
  searchUsers,
  getUser,
  getUsers,
};
