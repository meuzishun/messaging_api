const getContacts = (req, res) => {
  res.send('Contacts GET route');
};

const addContact = (req, res) => {
  res.send('Contact PUT route');
};

const getContact = (req, res) => {
  res.send('Contact GET route');
};

const deleteContact = (req, res) => {
  res.send('Contact DELETE route');
};

module.exports = {
  getContacts,
  addContact,
  getContact,
  deleteContact,
};
