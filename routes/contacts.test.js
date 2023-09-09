const app = require('../app');
const request = require('supertest');
const {
  initializeMongoServer,
  disconnectMongoServer,
} = require('../mongoTestingConfig');

let maggieUser;
let maggieToken;
let debbieUser;
let debbieToken;
let user1;
let user1Token;
let user2;
let user2Token;
let user3;
let user3Token;
let user4;
let user4Token;

beforeAll(async () => {
  await initializeMongoServer();

  const maggieRes = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'Maggie',
        lastName: 'May',
        email: 'maggie@email.com',
        password: '1234password5678',
      },
    });

  maggieUser = maggieRes.body.user;
  maggieToken = maggieRes.body.token;

  const debbieRes = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'Debbie',
        lastName: 'Smith',
        email: 'deb@email.com',
        password: '1234password5678',
      },
    });

  debbieUser = debbieRes.body.user;
  debbieToken = debbieRes.body.token;

  const user1Res = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'User',
        lastName: 'One',
        email: 'user1@email.com',
        password: '1234password5678',
      },
    });

  user1 = user1Res.body.user;
  user1Token = user1Res.body.token;

  const user2Res = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'Second',
        lastName: 'Dude',
        email: 'user2@email.com',
        password: '1234password5678',
      },
    });

  user2 = user2Res.body.user;
  user2Token = user2Res.body.token;

  const user3Res = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'Third',
        lastName: 'Guy',
        email: 'user3@email.com',
        password: '1234password5678',
      },
    });

  user3 = user3Res.body.user;
  user3Token = user3Res.body.token;

  const user4Res = await request(app)
    .post('/api/auth/register')
    .send({
      data: {
        firstName: 'Fourth',
        lastName: 'User',
        email: 'user4@email.com',
        password: '1234password5678',
      },
    });

  user4 = user4Res.body.user;
  user4Token = user4Res.body.token;
});

afterAll(async () => {
  await disconnectMongoServer();
});

describe('Get contacts route', () => {
  test('responds with 401 when user not signed in', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.status).toBe(401);
  });

  test('responds with error msg when user not signed in', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with 200 status when user is signed in', async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(200);
  });

  test('responds with empty array when user has no contacts', async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('authorization', `Bearer ${maggieToken}`);
    expect(res.body.contacts).toHaveLength(0);
  });

  test('responds with correct array of users', async () => {
    await request(app)
      .put('/api/contacts')
      .set('authorization', `Bearer: ${user3Token}`)
      .send({ contactId: user1._id });

    await request(app)
      .put('/api/contacts')
      .set('authorization', `Bearer: ${user3Token}`)
      .send({ contactId: user2._id });

    const res = await request(app)
      .get('/api/contacts')
      .set('authorization', `Bearer ${user3Token}`);

    expect(res.body.contacts).toContainEqual({
      firstName: user1.firstName,
      lastName: user1.lastName,
      email: user1.email,
    });
    expect(res.body.contacts).toContainEqual({
      firstName: user2.firstName,
      lastName: user2.lastName,
      email: user2.email,
    });
  });

  test("responds with contact's first names", async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('authorization', `Bearer ${user3Token}`);
    const firstNames = res.body.contacts.map((contact) => contact.firstName);
    expect(firstNames).toContain('User');
    expect(firstNames).toContain('Second');
  });

  test("responds with contact's last names", async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('authorization', `Bearer ${user3Token}`);
    const lastNames = res.body.contacts.map((contact) => contact.lastName);
    expect(lastNames).toContain('One');
    expect(lastNames).toContain('Dude');
  });

  test("responds with contact's email", async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('authorization', `Bearer ${user3Token}`);
    const emails = res.body.contacts.map((contact) => contact.email);
    expect(emails).toContain('user1@email.com');
    expect(emails).toContain('user2@email.com');
  });

  test("responds without contact's password", async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('authorization', `Bearer ${user3Token}`);
    const passwords = res.body.contacts.reduce((array, contact) => {
      return contact.password ? contact.password : array;
    }, []);
    expect(passwords).toHaveLength(0);
  });

  test("responds without contact's friends", async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('authorization', `Bearer ${user3Token}`);
    const friends = res.body.contacts.reduce((array, contact) => {
      return contact.friends ? contact.friends : array;
    }, []);
    expect(friends).toHaveLength(0);
  });
});

describe('Add contacts route', () => {
  test('responds with 401 when user not signed in', async () => {
    const res = await request(app)
      .put('/api/contacts')
      .send({ contactId: maggieUser._id });
    expect(res.status).toBe(401);
  });

  test('responds with error msg when user not signed in', async () => {
    const res = await request(app)
      .put('/api/contacts')
      .send({ contactId: maggieUser._id });
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with 201 status when user is signed in', async () => {
    const res = await request(app)
      .put('/api/contacts')
      .set('authorization', `Bearer ${debbieToken}`)
      .send({ contactId: maggieUser._id });
    expect(res.status).toBe(201);
  });

  test('responds with updated user', async () => {
    const res = await request(app)
      .put('/api/contacts')
      .set('authorization', `Bearer ${maggieToken}`)
      .send({ contactId: debbieUser._id });
    expect(res.body.user.friends).toContain(debbieUser._id);
  });

  test('get request has updated friends list after contact added', async () => {
    await request(app)
      .put('/api/contacts')
      .set('authorization', `Bearer ${user1Token}`)
      .send({ contactId: user2._id });

    const res = await request(app)
      .get('/api/profile')
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.body.user.friends).toContain(user2._id);
  });
});

describe('Get contact route', () => {
  test('responds with 401 when user not signed in', async () => {
    const res = await request(app).get(`/api/contacts/${user1._id}`);
    expect(res.status).toBe(401);
  });

  test('responds with error msg when user not signed in', async () => {
    const res = await request(app).get(`/api/contacts/${user1._id}`);
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with 400 status when user is not friends with contact', async () => {
    const res = await request(app)
      .get(`/api/contacts/${user1._id}`)
      .set('authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(400);
  });

  test('responds with error msg when user is not friends with contact', async () => {
    const res = await request(app)
      .get(`/api/contacts/${user1._id}`)
      .set('authorization', `Bearer ${maggieToken}`);
    expect(res.error.text).toContain('Contact not friend');
  });

  test('responds with 200 status when contact is found', async () => {
    const newUser1 = await request(app)
      .get('/api/profile')
      .set('authorization', `Bearer ${user1Token}`);

    const res = await request(app)
      .get(`/api/contacts/${user1._id}`)
      .set('authorization', `Bearer ${user3Token}`);
    expect(res.status).toBe(200);
  });

  test('responds with user when contact is found', async () => {
    const newUser1 = await request(app)
      .get('/api/profile')
      .set('authorization', `Bearer ${user1Token}`);

    const res = await request(app)
      .get(`/api/contacts/${user1._id}`)
      .set('authorization', `Bearer ${user3Token}`);
    expect(res.body.contact).toEqual(newUser1.body.user);
  });
});

describe('Delete contacts route', () => {
  test('responds with 401 when user not signed in', async () => {
    const res = await request(app).delete('/api/contacts/:contactId');
    expect(res.status).toBe(401);
  });

  test('responds with error msg when user not signed in', async () => {
    const res = await request(app).delete('/api/contacts/:contactId');
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with 400 status when user is not friends with contact', async () => {
    const res = await request(app)
      .delete(`/api/contacts/${user1._id}`)
      .set('authorization', `Bearer ${user2Token}`);
    expect(res.status).toBe(400);
  });

  test('responds with error msg when user is not friends with contact', async () => {
    const res = await request(app)
      .delete(`/api/contacts/${user1._id}`)
      .set('authorization', `Bearer ${user2Token}`);
    expect(res.error.text).toContain('Contact not friend');
  });

  test('responds with 201 status when contact is removed', async () => {
    const res = await request(app)
      .delete(`/api/contacts/${user2._id}`)
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.status).toBe(201);
  });

  test('responds with altered user when contact is removed', async () => {
    const preRes = await request(app)
      .get('/api/profile')
      .set('authorization', `Bearer ${maggieToken}`);
    expect(preRes.body.user.friends).toContain(debbieUser._id);

    const res = await request(app)
      .delete(`/api/contacts/${debbieUser._id}`)
      .set('authorization', `Bearer ${maggieToken}`);
    expect(res.body.user.friends).not.toContain(debbieUser._id);
  });
});
