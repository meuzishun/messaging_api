const app = require('../app');
const request = require('supertest');
const User = require('../models/user');
const {
  initializeMongoServer,
  disconnectMongoServer,
} = require('../mongoTestingConfig');

describe('Auth controllers', () => {
  beforeAll(async () => {
    await initializeMongoServer();
  });

  afterAll(async () => {
    await disconnectMongoServer();
  });

  describe('Register route', () => {
    test('Register route exists', async () => {
      const res = await request(app).post('/register');
      expect(res.status).not.toBe(404);
    });

    test('returns registered user sent', async () => {
      const user = {
        firstName: 'Andrew',
        lastName: 'Smith',
        email: 'asmith@email.com',
      };
      const res = await request(app).post('/register').send({ user });
      expect(res.status).toBe(201);
      expect(res.body.user.firstName).toEqual(user.firstName);
      expect(res.body.user.lastName).toEqual(user.lastName);
      expect(res.body.user.email).toEqual(user.email);
    });

    test('responds with error when user not sent with body', async () => {
      const res = await request(app).post('/register');
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('No user sent');
    });

    test('responds with json no matter what', async () => {
      const res = await request(app).post('/register');
      expect(res.headers['content-type']).toMatch(/json/);
    });

    test('responds with error when attempting to register a user that already exists', async () => {
      const user = {
        firstName: 'Maggie',
        lastName: 'May',
        email: 'maggie@email.com',
      };
      await request(app).post('/register').send({ user });
      const res = await request(app).post('/register').send({ user });
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('User already exists');
    });

    test('responds with error when attempting to register a user without a first name', async () => {
      const user = {
        lastName: 'Hattori',
        email: 'ayako@email.com',
      };
      const res = await request(app).post('/register').send({ user });
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('No first name');
    });

    test('responds with error when attempting to register a user without a last name', async () => {
      const user = {
        firstName: 'Ayako',
        email: 'ayako@email.com',
      };
      const res = await request(app).post('/register').send({ user });
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('No last name');
    });

    test('responds with error when attempting to register a user without an email', async () => {
      const user = {
        firstName: 'Ayako',
        lastName: 'Hattori',
      };
      const res = await request(app).post('/register').send({ user });
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('No email');
    });
  });

  describe('Login route', () => {
    test('Login route exists', async () => {
      const res = await request(app).post('/login');
      expect(res.status).not.toBe(404);
    });
  });

  describe('Contacts route', () => {
    test('Contacts route exists', async () => {
      const res = await request(app).get('/contacts');
      expect(res.status).not.toBe(404);
    });
  });

  describe('Profile route', () => {
    test('Profile route exists', async () => {
      const res = await request(app).get('/profile');
      expect(res.status).not.toBe(404);
    });
  });

  describe('Profile/edit route', () => {
    test('Profile/edit route exists', async () => {
      const res = await request(app).post('/profile/edit');
      expect(res.status).not.toBe(404);
    });
  });

  describe('Non-existent route', () => {
    test('Non-existent route does not exist', async () => {
      const res = await request(app).post('/non-route');
      expect(res.status).toBe(404);
    });
  });
});
