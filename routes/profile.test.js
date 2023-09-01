const app = require('../app');
const request = require('supertest');
const {
  initializeMongoServer,
  disconnectMongoServer,
} = require('../mongoTestingConfig');

let maggieUserRes;
let debbieUserRes;
let user1Res;
let user2Res;
beforeAll(async () => {
  await initializeMongoServer();

  maggieUserRes = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'Maggie',
        lastName: 'May',
        email: 'maggie@email.com',
        password: '1234password5678',
      },
    });

  debbieUserRes = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'Debbie',
        lastName: 'Smith',
        email: 'debbie@email.com',
        password: '1234password5678',
      },
    });

  user1Res = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'First',
        lastName: 'User',
        email: 'user1@email.com',
        password: '1234password5678',
      },
    });

  user2Res = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'Second',
        lastName: 'User',
        email: 'user2@email.com',
        password: '1234password5678',
      },
    });
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
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${maggieUserRes.body.token}`);

    expect(res.status).toBe(200);
  });

  test('to respond with user data on success', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${maggieUserRes.body.token}`);

    expect(res.body.user.firstName).toBe(maggieUserRes.body.user.firstName);
    expect(res.body.user.lastName).toBe(maggieUserRes.body.user.lastName);
    expect(res.body.user.email).toBe(maggieUserRes.body.user.email);
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
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${maggieUserRes.body.token}`)
      .send({ data: { firstName: 'Da Maggs' } });

    expect(res.status).toBe(201);
  });

  test('to respond with new user data on success', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${debbieUserRes.body.token}`)
      .send({ data: { firstName: 'Deborah' } });

    expect(res.body.user.firstName).toBe('Deborah');
  });

  test('to have status of 200 on retrieve', async () => {
    await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${maggieUserRes.body.token}`)
      .send({ data: { firstName: 'Flubbles' } });

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${maggieUserRes.body.token}`);

    expect(res.status).toBe(200);
  });

  test('to respond with new user data on retrieve', async () => {
    await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${debbieUserRes.body.token}`)
      .send({ data: { firstName: 'Deb' } });

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${debbieUserRes.body.token}`);

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
    const res = await request(app)
      .delete('/api/profile')
      .set('Authorization', `Bearer ${maggieUserRes.body.token}`);
    expect(res.status).toBe(200);
  });

  test('to responds with deleted profile id', async () => {
    const res = await request(app)
      .delete('/api/profile')
      .set('Authorization', `Bearer ${debbieUserRes.body.token}`);
    expect(res.body.id).toBe(debbieUserRes.body.user._id);
  });

  test('to have 401 status when attempting to retrieve', async () => {
    await request(app)
      .delete('/api/profile')
      .set('Authorization', `Bearer ${user1Res.body.token}`);

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${user1Res.body.token}`);

    expect(res.status).toBe(401);
  });

  test('to throw error when attempting to retrieve', async () => {
    await request(app)
      .delete('/api/profile')
      .set('Authorization', `Bearer ${user2Res.body.token}`);

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${user2Res.body.token}`);

    expect(res.error.text).toContain('Not authorized, no user found');
  });
});
