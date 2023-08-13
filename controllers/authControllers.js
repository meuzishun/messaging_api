const postRegister = (req, res) => {
  res.send('Register POST route');
};

const postLogin = (req, res) => {
  res.send('Login POST route');
};

module.exports = {
  postRegister,
  postLogin,
};
