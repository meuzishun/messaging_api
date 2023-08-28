const getProfile = (req, res) => {
  res.send('Profile GET route');
};

const editProfile = (req, res) => {
  res.send('Edit profile POST route');
};

const deleteProfile = (req, res) => {
  res.send('Delete profile DELETE route');
};

module.exports = {
  getProfile,
  editProfile,
  deleteProfile,
};
