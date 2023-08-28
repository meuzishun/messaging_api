const app = require('../app');
const request = require('supertest');

describe('Contacts route', () => {
  test('Contacts route exists', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.status).not.toBe(404);
  });
});
