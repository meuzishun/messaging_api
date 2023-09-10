const app = require('../app');
const request = require('supertest');

const mockUsersObj = {
  debbie: {
    data: {
      firstName: 'Debbie',
      lastName: 'Smith',
      email: 'deb@email.com',
      password: '1234password5678',
    },
  },
  maggie: {
    data: {
      firstName: 'Maggie',
      lastName: 'May',
      email: 'maggie@email.com',
      password: '1234password5678',
    },
  },
  user1: {
    data: {
      firstName: 'User',
      lastName: 'One',
      email: 'user1@email.com',
      password: '1234password5678',
    },
  },
  user2: {
    data: {
      firstName: 'Second',
      lastName: 'Dude',
      email: 'user2@email.com',
      password: '1234password5678',
    },
  },
  user3: {
    data: {
      firstName: 'Third',
      lastName: 'Guy',
      email: 'user3@email.com',
      password: '1234password5678',
    },
  },
  user4: {
    data: {
      firstName: 'Fourth',
      lastName: 'User',
      email: 'user4@email.com',
      password: '1234password5678',
    },
  },
};

const mockUsers = [
  {
    firstName: 'Debbie',
    lastName: 'Smith',
    email: 'deb@email.com',
    password: '1234password5678',
  },
  {
    firstName: 'Maggie',
    lastName: 'May',
    email: 'maggie@email.com',
    password: '1234password5678',
  },
  {
    firstName: 'User',
    lastName: 'One',
    email: 'user1@email.com',
    password: '1234password5678',
  },
  {
    firstName: 'Second',
    lastName: 'Dude',
    email: 'user2@email.com',
    password: '1234password5678',
  },
  {
    firstName: 'Third',
    lastName: 'Guy',
    email: 'user3@email.com',
    password: '1234password5678',
  },
  {
    firstName: 'Fourth',
    lastName: 'User',
    email: 'user4@email.com',
    password: '1234password5678',
  },
];

const registerUser = async (registerData) => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ data: registerData });

  const { user, token } = res.body;
  return { ...user, token };
};

const registerUsers = async (usersRegisterData) => {
  const results = await Promise.all(
    await usersRegisterData.map(async (data) => await registerUser(data))
  );

  return results;
};

const loginUser = async (loginData) => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ data: loginData });

  const { user, token } = res.body;
  return { ...user, token };
};

const loginUsers = async (usersLoginData) => {
  const results = await Promise.all(
    await usersLoginData.map(async (data) => {
      const { email, password } = data;
      const res = await loginUser({ email, password });
      return res;
    })
  );

  return results;
};

module.exports = {
  mockUsersObj,
  mockUsers,
  registerUser,
  registerUsers,
  loginUser,
  loginUsers,
};
