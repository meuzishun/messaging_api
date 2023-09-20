const app = require('../../app');
const request = require('supertest');
const {
  initializeMongoServer,
  disconnectMongoServer,
} = require('../mongoTestingConfig');
const { mockUsers, registerUsers, loginUsers } = require('../mockUsers');

let loggedInUsers;

beforeAll(async () => {
  await initializeMongoServer();
  await registerUsers(mockUsers);
  loggedInUsers = await loginUsers(mockUsers);
});

afterAll(async () => {
  await disconnectMongoServer();
});

describe.skip('Initial tests', () => {
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

describe('Search users route', () => {
  test('responds with 401 status when no token in header', async () => {
    const res = await request(app).get('/api/users/search?query=Maggie');
    expect(res.status).toBe(401);
  });

  test('responds with error msg when no token in header', async () => {
    const res = await request(app).get('/api/users/search?query=Maggie');
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with 200 status when token present', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/users/search?query=Maggie')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
  });

  test('responds with an array when token present', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/users/search?query=Maggie')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(Array.isArray(res.body.users)).toBe(true);
  });

  test('responds with an empty array when no results found', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/users/search?query=Andrew')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.body.users).toHaveLength(0);
  });

  test("responds with multiple users when searching for 'user'", async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/users/search?query=user')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.body.users.length).toBeGreaterThan(1);
  });

  test('responds with several users when searching for string in all emails', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/users/search?query=email')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.body.users.length).toBeGreaterThan(1);
  });
});

describe('Get user route', () => {
  test.skip('', async () => {
    const res = await request(app).get(`/api/users/${id}`);
  });

  test.skip('', async () => {
    const res = await request(app).get(`/api/users/${id}`);
  });

  test.skip('', async () => {
    const res = await request(app).get(`/api/users/${id}`);
  });

  test.skip('', async () => {
    const res = await request(app).get(`/api/users/${id}`);
  });

  test.skip('', async () => {
    const res = await request(app).get(`/api/users/${id}`);
  });

  test.skip('', async () => {
    const res = await request(app).get(`/api/users/${id}`);
  });

  test.skip('', async () => {
    const res = await request(app).get(`/api/users/${id}`);
  });
});

describe('Get users route', () => {
  test.skip('', async () => {
    const res = await request(app).get('/api/users');
  });

  test.skip('', async () => {
    const res = await request(app).get('/api/users');
  });

  test.skip('', async () => {
    const res = await request(app).get('/api/users');
  });

  test.skip('', async () => {
    const res = await request(app).get('/api/users');
  });

  test.skip('', async () => {
    const res = await request(app).get('/api/users');
  });

  test.skip('', async () => {
    const res = await request(app).get('/api/users');
  });

  test.skip('', async () => {
    const res = await request(app).get('/api/users');
  });
});
