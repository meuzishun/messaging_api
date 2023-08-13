const app = require('../app');
const request = require('supertest');

describe('Message routes', () => {
  test('Messages route exists', async () => {
    const res = await request(app).get('/messages');
    expect(res.status).toBe(200);
  });

  test('Single message route exists', async () => {
    const res = await request(app).get('/messages/123');
    expect(res.status).toBe(200);
  });

  test('New message route exists', async () => {
    const res = await request(app).post('/messages/new');
    expect(res.status).toBe(200);
  });
});
