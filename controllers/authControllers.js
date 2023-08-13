const postRegister = (req, res) => {
  res.send('Register POST route');
};

const postLogin = (req, res) => {
  res.send('Login POST route');
};

const getProfile = (req, res) => {
  res.send('Profile GET route');
};

const postProfileEdit = (req, res) => {
  res.send('Edit profile POST route');
};

module.exports = {
  postRegister,
  postLogin,
  getProfile,
  postProfileEdit,
};
