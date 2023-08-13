const getContacts = (req, res) => {
  res.send('Contacts GET route');
};

const getProfile = (req, res) => {
  res.send('Profile GET route');
};

const postProfileEdit = (req, res) => {
  res.send('Edit profile POST route');
};

module.exports = {
  getContacts,
  getProfile,
  postProfileEdit,
};
