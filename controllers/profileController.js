const getProfile = (req, res) => {
  res.send('Profile GET route');
};

const editProfile = (req, res) => {
  res.send('Edit profile POST route');
};

module.exports = {
  getProfile,
  editProfile,
};
