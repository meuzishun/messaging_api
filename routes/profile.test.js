const app = require('../app');
const request = require('supertest');

describe('Get profile route', () => {
  test('exists', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).not.toBe(404);
  });
});

describe('Edit profile route', () => {
  test('exists', async () => {
    const res = await request(app).put('/api/profile/edit');
    expect(res.status).not.toBe(404);
  });
});

describe('Delete profile route', () => {
  test('exists', async () => {
    const res = await request(app).delete('/api/profile');
    expect(res.status).not.toBe(404);
  });
});
