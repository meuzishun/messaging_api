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

  test('responds with 400 status when query string is invalid', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/users/search?query=')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(400);
  });

  test('responds with error msg when query string is invalid', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/users/search?query=')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.error.text).toContain('Query string is invalid');
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

describe.skip('Get user route', () => {
  test('responds with 401 status when no token in header', async () => {
    const { _id: user1id } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app).get(`/api/users/${user1id}`);

    expect(res.status).toBe(401);
  });

  test('responds with error msg when no token in header', async () => {
    const { _id: user1id } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app).get(`/api/users/${user1id}`);

    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with 400 status when id provided is invalid', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get(`/api/users/a1b2c3`)
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(400);
  });

  test('responds with error msg when id provided is invalid', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get(`/api/users/a1b2c3`)
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.error.text).toContain('Invalid user ID');
  });

  test('responds with 200 status when provided id finds a user', async () => {
    const { _id: user1id } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get(`/api/users/${user1id}`)
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(200);
  });

  test('responds with 400 status when no user is found', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get('/api/users/615a8be41c2b20f6e47c256d')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(400);
  });

  test('responds with error msg when no user is found', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get('/api/users/615a8be41c2b20f6e47c256d')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.error.text).toContain('No user found');
  });

  test('responds with user first name that matches id provided', async () => {
    const user1 = loggedInUsers.find((user) => user.firstName === 'User');

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get(`/api/users/${user1._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.body.user.firstName).toBe(user1.firstName);
  });

  test('responds with user last name that matches id provided', async () => {
    const user1 = loggedInUsers.find((user) => user.firstName === 'User');

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get(`/api/users/${user1._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.body.user.lastName).toBe(user1.lastName);
  });

  test('responds with user email that matches id provided', async () => {
    const user1 = loggedInUsers.find((user) => user.firstName === 'User');

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get(`/api/users/${user1._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.body.user.email).toBe(user1.email);
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
