const app = require('../../app');
const request = require('supertest');

describe('Initial tests', () => {
  test("searchUsers returns 'Searching users...'", async () => {
    const res = await request(app).get('/api/users/search');

    expect(res.body.msg).toBe('Searching users...');
  });

  test("getUser returns 'Get single user'", async () => {
    const res = await request(app).get('/api/users/123');

    expect(res.body.msg).toBe('Get single user');
  });

  test("getUsers returns 'Get all users'", async () => {
    const res = await request(app).get('/api/users');

    expect(res.body.msg).toBe('Get all users');
  });
});
