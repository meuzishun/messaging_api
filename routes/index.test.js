const app = require('../app');
const request = require('supertest');

describe('Auth controllers', () => {
  describe('Register route', () => {
    test('Register route exists', async () => {
      const res = await request(app).post('/register');
      expect(res.status).toBe(200);
    });
  });

  describe('Login route', () => {
    test('Login route exists', async () => {
      const res = await request(app).post('/login');
      expect(res.status).toBe(200);
    });
  });

  describe('Contacts route', () => {
    test('Contacts route exists', async () => {
      const res = await request(app).get('/contacts');
      expect(res.status).toBe(200);
    });
  });

  describe('Profile route', () => {
    test('Profile route exists', async () => {
      const res = await request(app).get('/profile');
      expect(res.status).toBe(200);
    });
  });

  describe('Profile/edit route', () => {
    test('Profile/edit route exists', async () => {
      const res = await request(app).post('/profile/edit');
      expect(res.status).toBe(200);
    });
  });

  describe('Non-existent route', () => {
    test('Non-existent route does not exist', async () => {
      const res = await request(app).post('/non-route');
      expect(res.status).toBe(404);
    });
  });
});
