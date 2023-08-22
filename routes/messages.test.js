const app = require('../app');
const request = require('supertest');
const {
  initializeMongoServer,
  disconnectMongoServer,
} = require('../mongoTestingConfig');

describe('Message routes', () => {
  let debbieUser;
  let maggieUser;
  let user1;
  let user2;
  let user3;
  let user4;

  beforeAll(async () => {
    await initializeMongoServer();

    // Register a bunch of users
    await request(app)
      .post('/register')
      .send({
        data: {
          firstName: 'Debbie',
          lastName: 'Smith',
          email: 'deb@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/register')
      .send({
        data: {
          firstName: 'Maggie',
          lastName: 'May',
          email: 'maggie@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/register')
      .send({
        data: {
          firstName: 'User',
          lastName: 'One',
          email: 'user1@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/register')
      .send({
        data: {
          firstName: 'Second',
          lastName: 'Dude',
          email: 'user2@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/register')
      .send({
        data: {
          firstName: 'Third',
          lastName: 'Guy',
          email: 'user3@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/register')
      .send({
        data: {
          firstName: 'Fourth',
          lastName: 'User',
          email: 'user4@email.com',
          password: '1234password5678',
        },
      });

    // Login users
    const debbieUserRes = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'deb@email.com',
          password: '1234password5678',
        },
      });

    debbieUser = debbieUserRes.body.user;

    const maggieUserRes = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'maggie@email.com',
          password: '1234password5678',
        },
      });

    maggieUser = maggieUserRes.body.user;

    const user1Res = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'user1@email.com',
          password: '1234password5678',
        },
      });

    user1 = user1Res.body.user;

    const user2Res = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'user2@email.com',
          password: '1234password5678',
        },
      });

    user2 = user2Res.body.user;

    const user3Res = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'user3@email.com',
          password: '1234password5678',
        },
      });

    user3 = user3Res.body.user;

    const user4Res = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'user4@email.com',
          password: '1234password5678',
        },
      });

    user4 = user4Res.body.user;
  });

  afterAll(async () => {
    await disconnectMongoServer();
  });

  test('Messages route exists', async () => {
    const res = await request(app).get('/messages');
    expect(res.status).not.toBe(404);
  });

  test('Messages route responds with 200 status', async () => {
    const res = await request(app).get('/messages');
    expect(res.status).toBe(200);
  });

  test('Messages route responds with an array when user is signed in', async () => {
    const res = await request(app).get('/messages').send({ user: debbieUser });
    expect(res.body.messages).toBeInstanceOf(Array);
  });

  test('New message route exists', async () => {
    const res = await request(app).post('/messages/new');
    expect(res.status).not.toBe(404);
  });

  test('New message route responds with 400 status when no body is sent', async () => {
    const res = await request(app).post('/messages/new');
    expect(res.status).toBe(400);
  });

  test('New message route responds with error msg when no body is sent', async () => {
    const res = await request(app).post('/messages/new');
    expect(res.error.text).toContain('No message submitted');
  });

  test('New message route responds with 400 status when no content is included', async () => {
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: maggieUser._id,
        },
      });
    expect(res.status).toBe(400);
  });

  test('New message route responds with error msg when no content is included', async () => {
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: maggieUser._id,
        },
      });
    expect(res.error.text).toContain('No message content submitted');
  });

  test('New message route responds with 400 status when user id is not included', async () => {
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          content: 'Hello world',
        },
      });
    expect(res.status).toBe(400);
  });

  test('New message route responds with error msg when user id is not included', async () => {
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          content: 'Hello world',
        },
      });
    expect(res.error.text).toContain('No author submitted');
  });

  test('New message route responds with 201 status when new message submission is successful', async () => {
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: maggieUser._id,
          content: 'Hello world',
        },
      });
    expect(res.status).toBe(201);
  });

  test('New message route responds with message when new message submission is successful', async () => {
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: maggieUser._id,
          content: 'Yo planet!',
        },
      });
    expect(res.body.message.content).toEqual('Yo planet!');
  });

  test('Single message route exists', async () => {
    //! This is a strange test. If you don't include a legit-looking document id in the url, a 200 status is sent, bypassing any conditional checks in the controller. In short, may need to be rewritten or perhaps not included at all.
    const res = await request(app).get('/messages/123');
    expect(res.status).not.toBe(404);
  });

  test('Single message route responds with 400 when message id is wrong format', async () => {
    const res = await request(app).get('/messages/123');
    expect(res.status).toBe(400);
  });

  test('Single message route responds with error msg when message id is wrong format', async () => {
    const res = await request(app).get('/messages/123');
    expect(res.error.text).toContain('Message id is wrong format');
  });

  test('Single message route responds with 404 when message does not exist', async () => {
    const res = await request(app).get('/messages/615a8be41c2b20f6e47c256d');
    expect(res.status).toBe(404);
  });

  test('Single message route responds with error msg when message does not exist', async () => {
    const res = await request(app).get('/messages/615a8be41c2b20f6e47c256d');
    expect(res.error.text).toContain('No message found with id');
  });

  test('Single message route responds with 200 when message exists', async () => {
    const msgRes = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: maggieUser._id,
          content: 'I am ALIVE!!!',
        },
      });
    const res = await request(app).get(`/messages/${msgRes.body.message._id}`);
    expect(res.status).toBe(200);
  });

  test('Single message route responds with message when it exists', async () => {
    const msgRes = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: maggieUser._id,
          content: 'Where am I?',
        },
      });
    const res = await request(app).get(`/messages/${msgRes.body.message._id}`);
    expect(res.body.message).toBeTruthy();
  });

  test('New message route responds with parentId when submitted with one', async () => {
    const msgRes1 = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: user1._id,
          content: 'Hello? Is there anybody in there?',
        },
      });
    const msgRes2 = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: user2._id,
          content: 'Just nod if you can hear me...',
          parentId: msgRes1.body.message._id,
        },
      });
    expect(msgRes2.body.message.parentId).toBe(msgRes1.body.message._id);
  });

  test('New message route responds without parentId when submitted without one', async () => {
    const msgRes = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: maggieUser._id,
          content: 'Where am I?',
        },
      });
    const res = await request(app).get(`/messages/${msgRes.body.message._id}`);
    expect(res.body.message.parentId).toBeNull();
  });

  test('do not include participants that were not involved', async () => {
    const msgRes1 = await request(app)
      .post('/messages/new')
      .send({
        data: {
          content: 'Hello everybody!',
          author: user1._id,
          participants: [user1._id, user2._id, user3._id],
          timestamp: new Date(),
        },
      });
    const msg1 = msgRes1.body.message;

    const msgRes2 = await request(app)
      .post('/messages/new')
      .send({
        data: {
          content: "What's going on?!",
          author: user2._id,
          participants: [user1._id, user2._id, user3._id],
          timestamp: new Date(),
          parentId: msg1._id,
        },
      });
    const msg2 = msgRes2.body.message;

    const msgRes3 = await request(app)
      .post('/messages/new')
      .send({
        data: {
          content: 'Who are you people?',
          author: user3._id,
          participants: [user1._id, user2._id, user3._id],
          timestamp: new Date(),
          parentId: msg2._id,
        },
      });
    const msg3 = msgRes3.body.message;

    const msgRes4 = await request(app)
      .post('/messages/new')
      .send({
        data: {
          content: 'Bahaha!!!',
          author: user2._id,
          participants: [user1._id, user2._id, user3._id],
          timestamp: new Date(),
          parentId: msg3._id,
        },
      });

    const msgRes5 = await request(app)
      .post('/messages/new')
      .send({
        data: {
          content: "Let's just you and I talk...",
          author: user2._id,
          participants: [user1._id, user2._id],
          timestamp: new Date(),
        },
      });
    const msg5 = msgRes5.body.message;

    const msgRes6 = await request(app)
      .post('/messages/new')
      .send({
        data: {
          content: 'Ok, sounds good',
          author: user1._id,
          participants: [user1._id, user2._id],
          timestamp: new Date(),
          parentId: msg5._id,
        },
      });

    const user1Messages = await request(app)
      .get('/messages')
      .send({ user: user1 });

    const firstUser1MessageThreadFlat =
      user1Messages.body.messages[1].flat(Infinity);

    const firstUser1MessageThreadIDs = firstUser1MessageThreadFlat.map(
      (msg) => msg.author._id
    );

    expect(firstUser1MessageThreadIDs).not.toContain(user3._id);
  });

  test('do include participants involved', async () => {
    const user1Messages = await request(app)
      .get('/messages')
      .send({ user: user1 });

    const firstUser1MessageThreadFlat =
      user1Messages.body.messages[1].flat(Infinity);

    const firstUser1MessageThreadIDs = firstUser1MessageThreadFlat.map(
      (msg) => msg.author._id
    );

    expect(firstUser1MessageThreadIDs).toContain(user1._id);
    expect(firstUser1MessageThreadIDs).toContain(user2._id);
  });

  test('getMessages returns empty array when user has no messages', async () => {
    const user4Messages = await request(app)
      .get('/messages')
      .send({ user: user4 });

    expect(user4Messages.body.messages).toHaveLength(0);
  });
});
