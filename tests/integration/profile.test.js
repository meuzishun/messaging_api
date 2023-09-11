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

describe('Get profile route', () => {
  test('to have status of 401 when no auth', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(401);
  });

  test('to throw error when no auth', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('to have status of 200 on success', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(200);
  });

  test('to respond with user data on success', async () => {
    const maggieUser = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${maggieUser.token}`);

    expect(res.body.user.firstName).toBe(maggieUser.firstName);
    expect(res.body.user.lastName).toBe(maggieUser.lastName);
    expect(res.body.user.email).toBe(maggieUser.email);
  });
});

describe('Edit profile route', () => {
  test('to have status of 401 when no auth', async () => {
    const res = await request(app)
      .put('/api/profile')
      .send({ data: { firstName: 'Da Maggs' } });

    expect(res.status).toBe(401);
  });

  test('to throw error when no auth', async () => {
    const res = await request(app)
      .put('/api/profile')
      .send({ data: { firstName: 'Da Maggs' } });

    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('to have status of 201 on success', async () => {
    const maggieUser = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${maggieUser.token}`)
      .send({ data: { firstName: 'Da Maggs' } });

    expect(res.status).toBe(201);
  });

  test('to respond with new user data on success', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${debbieUser.token}`)
      .send({ data: { firstName: 'Deborah' } });

    expect(res.body.user.firstName).toBe('Deborah');
  });

  test('to have status of 200 on retrieve', async () => {
    const maggieUser = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${maggieUser.token}`)
      .send({ data: { firstName: 'Flubbles' } });

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${maggieUser.token}`);

    expect(res.status).toBe(200);
  });

  test('to respond with new user data on retrieve', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${debbieUser.token}`)
      .send({ data: { firstName: 'Deb' } });

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    expect(res.body.user.firstName).toBe('Deb');
  });
});

describe('Delete profile route', () => {
  test('to have status of 401 when no auth', async () => {
    const res = await request(app).delete('/api/profile');
    expect(res.status).toBe(401);
  });

  test('to throw error when no auth', async () => {
    const res = await request(app).delete('/api/profile');
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('to have 200 status on success', async () => {
    const maggieUser = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .delete('/api/profile')
      .set('Authorization', `Bearer ${maggieUser.token}`);

    expect(res.status).toBe(200);
  });

  test('to responds with deleted profile id', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .delete('/api/profile')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    expect(res.body.id).toBe(debbieUser._id);
  });

  test('to have 401 status when attempting to retrieve', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    await request(app)
      .delete('/api/profile')
      .set('Authorization', `Bearer ${user1Token}`);

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(401);
  });

  test('to throw error when attempting to retrieve', async () => {
    const { token: user2Token } = loggedInUsers.find(
      (user) => user.firstName === 'Second'
    );

    await request(app)
      .delete('/api/profile')
      .set('Authorization', `Bearer ${user2Token}`);

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.error.text).toContain('Not authorized, no user found');
  });
});
