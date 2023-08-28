const app = require('../app');
const request = require('supertest');

describe('Profile route', () => {
  test('Profile route exists', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).not.toBe(404);
  });
});

describe('Profile/edit route', () => {
  test('Profile/edit route exists', async () => {
    const res = await request(app).post('/api/profile/edit');
    expect(res.status).not.toBe(404);
  });
});
