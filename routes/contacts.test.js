const app = require('../app');
const request = require('supertest');

describe('Get contacts route', () => {
  test('exists', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.status).not.toBe(404);
  });
});

describe('Add contacts route', () => {
  test('exists', async () => {
    const res = await request(app).put('/api/contacts');
    expect(res.status).not.toBe(404);
  });
});

describe('Get contact route', () => {
  test('exists', async () => {
    const res = await request(app).get('/api/contacts/:contactId');
    expect(res.status).not.toBe(404);
  });
});

describe('Delete contacts route', () => {
  test('exists', async () => {
    const res = await request(app).delete('/api/contacts/:contactId');
    expect(res.status).not.toBe(404);
  });
});
