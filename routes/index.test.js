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

    test('responds with json no matter what', async () => {
      const res = await request(app).post('/register');
      expect(res.headers['content-type']).toMatch(/json/);
    });

    test('responds with 400 status when user not sent with body', async () => {
      const res = await request(app).post('/register');
      expect(res.status).toBe(400);
    });

    test('responds with error msg when user not sent with body', async () => {
      const res = await request(app).post('/register');
      expect(res.error.text).toContain('No user data submitted');
    });

    test('responds with 400 status when attempting to register a user without a first name', async () => {
      const data = {
        lastName: 'Hattori',
        email: 'ayako@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.status).toBe(400);
    });

    test('responds with error msg when attempting to register a user without a first name', async () => {
      const data = {
        lastName: 'Hattori',
        email: 'ayako@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.error.text).toContain('No first name');
    });

    test('responds with 400 status when attempting to register a user without a last name', async () => {
      const data = {
        firstName: 'Ayako',
        email: 'ayako@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.status).toBe(400);
    });

    test('responds with error msg when attempting to register a user without a last name', async () => {
      const data = {
        firstName: 'Ayako',
        email: 'ayako@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.error.text).toContain('No last name');
    });

    test('responds with 400 status when attempting to register a user without an email', async () => {
      const data = {
        firstName: 'Ayako',
        lastName: 'Hattori',
        password: '1234password5678',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.status).toBe(400);
    });

    test('responds with error msg when attempting to register a user without an email', async () => {
      const data = {
        firstName: 'Ayako',
        lastName: 'Hattori',
        password: '1234password5678',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.error.text).toContain('No email');
    });

    test('responds with 400 status when attempting to register a user without a password', async () => {
      const data = {
        firstName: 'Ayako',
        lastName: 'Hattori',
        email: 'ayako@email.com',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.status).toBe(400);
    });

    test('responds with error msg when attempting to register a user without a password', async () => {
      const data = {
        firstName: 'Ayako',
        lastName: 'Hattori',
        email: 'ayako@email.com',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.error.text).toContain('No password');
    });

    test('responds with 400 status when attempting to register a user that already exists', async () => {
      const data = {
        firstName: 'Maggie',
        lastName: 'May',
        email: 'maggie@email.com',
        password: '1234password5678',
      };
      await request(app).post('/register').send({ data });
      const res = await request(app).post('/register').send({ data });
      expect(res.status).toBe(400);
    });

    test('responds with error msg when attempting to register a user that already exists', async () => {
      const data = {
        firstName: 'Maggie',
        lastName: 'May',
        email: 'maggie@email.com',
        password: '1234password5678',
      };
      await request(app).post('/register').send({ data });
      const res = await request(app).post('/register').send({ data });
      expect(res.error.text).toContain('User already exists');
    });

    test('responds with 201 status when register successful', async () => {
      const data = {
        firstName: 'Ayako',
        lastName: 'Hattori',
        email: 'ayako@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.status).toBe(201);
    });

    test('responds with user profile when register successful', async () => {
      const data = {
        firstName: 'Andrew',
        lastName: 'Smith',
        email: 'asmith@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/register').send({ data });
      expect(res.body.user.firstName).toEqual(data.firstName);
      expect(res.body.user.lastName).toEqual(data.lastName);
      expect(res.body.user.email).toEqual(data.email);
    });
  });

  describe('Login route', () => {
    test('Login route exists', async () => {
      const res = await request(app).post('/login');
      expect(res.status).not.toBe(404);
    });

    test('responds with 400 error when nothing is submitted', async () => {
      const res = await request(app).post('/login');
      expect(res.status).toBe(400);
    });

    test('responds with error msg when nothing is submitted', async () => {
      const res = await request(app).post('/login');
      expect(res.error.text).toContain('No user submitted');
    });

    test('responds with 400 error when no password is submitted', async () => {
      const loginData = {
        email: 'me@email.com',
      };
      const res = await request(app).post('/login').send(loginData);
      expect(res.status).toBe(400);
    });

    test('responds with error msg when no password is submitted', async () => {
      const loginData = {
        email: 'me@email.com',
      };
      const res = await request(app).post('/login').send({ data: loginData });
      expect(res.error.text).toContain('No password');
    });

    test('responds with error when no email is submitted', async () => {
      const loginData = {
        password: '1234password5678',
      };
      const res = await request(app).post('/login').send({ data: loginData });
      expect(res.status).toBe(400);
    });

    test('responds with error msg when no email is submitted', async () => {
      const loginData = {
        password: '1234password5678',
      };
      const res = await request(app).post('/login').send({ data: loginData });
      expect(res.error.text).toContain('No email');
    });

    test('responds with 400 error when no user exists with submitted email', async () => {
      const loginData = {
        email: 'me@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/login').send({ data: loginData });
      expect(res.status).toBe(400);
    });

    test('responds with error msg when no user exists with submitted email', async () => {
      const loginData = {
        email: 'me@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/login').send({ data: loginData });
      expect(res.error.text).toContain('No user with that email');
    });

    test('responds with 400 error when password is incorrect', async () => {
      const registerData = {
        firstName: 'Billy',
        lastName: 'Madison',
        email: 'billy@email.com',
        password: '1234password5678',
      };
      await request(app).post('/register').send({ data: registerData });
      const loginData = {
        email: registerData.email,
        password: 'thisIsIncorrect',
      };
      const res = await request(app).post('/login').send({ data: loginData });
      expect(res.status).toBe(400);
    });

    test('responds with error msg when password is incorrect', async () => {
      const registerData = {
        firstName: 'Billy',
        lastName: 'Madison',
        email: 'billy@email.com',
        password: '1234password5678',
      };
      await request(app).post('/register').send({ data: registerData });
      const loginData = {
        email: 'billy@email.com',
        password: 'thisIsIncorrect',
      };
      const res = await request(app).post('/login').send({ data: loginData });
      expect(res.error.text).toContain('Incorrect password');
    });

    test('responds with 200 when login is successful', async () => {
      const loginData = {
        email: 'billy@email.com',
        password: '1234password5678',
      };
      const res = await request(app).post('/login').send({ data: loginData });
      expect(res.status).toBe(200);
    });

    test('responds with user when login is successful', async () => {
      const loginData = {
        firstName: 'Billy',
        lastName: 'Madison',
        email: 'billy@email.com',
        password: '1234password5678',
      };
      const res = await request(app)
        .post('/login')
        .send({
          data: { email: loginData.email, password: loginData.password },
        });
      expect(res.body.user.firstName).toEqual(loginData.firstName);
      expect(res.body.user.lastName).toEqual(loginData.lastName);
      expect(res.body.user.email).toEqual(loginData.email);
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
