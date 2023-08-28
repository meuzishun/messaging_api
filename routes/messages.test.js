const app = require('../app');
const request = require('supertest');
const {
  initializeMongoServer,
  disconnectMongoServer,
} = require('../mongoTestingConfig');

describe('Message routes', () => {
  let debbieUser;
  let debbieToken;
  let maggieUser;
  let maggieToken;
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

    // Register a bunch of users
    await request(app)
      .post('/api/auth/register')
      .send({
        data: {
          firstName: 'Debbie',
          lastName: 'Smith',
          email: 'deb@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/api/auth/register')
      .send({
        data: {
          firstName: 'Maggie',
          lastName: 'May',
          email: 'maggie@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/api/auth/register')
      .send({
        data: {
          firstName: 'User',
          lastName: 'One',
          email: 'user1@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/api/auth/register')
      .send({
        data: {
          firstName: 'Second',
          lastName: 'Dude',
          email: 'user2@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/api/auth/register')
      .send({
        data: {
          firstName: 'Third',
          lastName: 'Guy',
          email: 'user3@email.com',
          password: '1234password5678',
        },
      });

    await request(app)
      .post('/api/auth/register')
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
      .post('/api/auth/login')
      .send({
        data: {
          email: 'deb@email.com',
          password: '1234password5678',
        },
      });

    debbieUser = debbieUserRes.body.user;
    debbieToken = debbieUserRes.body.token;

    const maggieUserRes = await request(app)
      .post('/api/auth/login')
      .send({
        data: {
          email: 'maggie@email.com',
          password: '1234password5678',
        },
      });

    maggieUser = maggieUserRes.body.user;
    maggieToken = maggieUserRes.body.token;

    const user1Res = await request(app)
      .post('/api/auth/login')
      .send({
        data: {
          email: 'user1@email.com',
          password: '1234password5678',
        },
      });

    user1 = user1Res.body.user;
    user1Token = user1Res.body.token;

    const user2Res = await request(app)
      .post('/api/auth/login')
      .send({
        data: {
          email: 'user2@email.com',
          password: '1234password5678',
        },
      });

    user2 = user2Res.body.user;
    user2Token = user2Res.body.token;

    const user3Res = await request(app)
      .post('/api/auth/login')
      .send({
        data: {
          email: 'user3@email.com',
          password: '1234password5678',
        },
      });

    user3 = user3Res.body.user;
    user3Token = user3Res.body.token;

    const user4Res = await request(app)
      .post('/api/auth/login')
      .send({
        data: {
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

  test('Messages route exists', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).not.toBe(404);
  });

  test('Messages route responds with 200 status when token in header', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieToken}`);
    expect(res.status).toBe(200);
  });

  test('Messages route responds with 401 error when no token in header', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).toBe(401);
  });

  test('Messages route responds with error msg when no token in header', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('Messages route responds with an array when user is signed in', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieToken}`);
    expect(res.body.messages).toBeInstanceOf(Array);
  });

  test('New message route exists', async () => {
    const res = await request(app).post('/api/messages/new');
    expect(res.status).not.toBe(404);
  });

  test('New message route responds with 400 status when no body is sent', async () => {
    const res = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(400);
  });

  test('New message route responds with error msg when no body is sent', async () => {
    const res = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.error.text).toContain('No message submitted');
  });

  //? not sure this test is needed
  test('New message route responds with 400 status when no content is included', async () => {
    const res = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(400);
  });

  //? not sure this test is needed
  test('New message route responds with error msg when no content is included', async () => {
    const res = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.error.text).toContain('No message submitted');
  });

  test('New message route responds with 401 status when token is not included in header', async () => {
    const res = await request(app)
      .post('/api/messages/new')
      .send({
        data: {
          content: 'Hello world',
        },
      });
    expect(res.status).toBe(401);
  });

  test('New message route responds with error msg when token is not included in header', async () => {
    const res = await request(app)
      .post('/api/messages/new')
      .send({
        data: {
          content: 'Hello world',
        },
      });
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('New message route responds with 201 status when new message submission is successful', async () => {
    const res = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'Hello world',
        },
      });
    expect(res.status).toBe(201);
  });

  test('New message route responds with message when new message submission is successful', async () => {
    const res = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'Yo planet!',
        },
      });
    expect(res.body.message.content).toEqual('Yo planet!');
  });

  test('Single message route exists', async () => {
    //! This is a strange test. If you don't include a legit-looking document id in the url, a 200 status is sent, bypassing any conditional checks in the controller. In short, may need to be rewritten or perhaps not included at all.
    const res = await request(app).get('/api/messages/123');
    expect(res.status).not.toBe(404);
  });

  test('Single message route responds with 400 when message id is wrong format', async () => {
    const res = await request(app)
      .get('/api/messages/123')
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(400);
  });

  test('Single message route responds with error msg when message id is wrong format', async () => {
    const res = await request(app)
      .get('/api/messages/123')
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.error.text).toContain('Message id is wrong format');
  });

  //? How can you honestly test for this? Maybe figure out which part of the id is the date? Maybe run this test with a cleared db?
  test('Single message route responds with 404 when message does not exist', async () => {
    const res = await request(app)
      .get('/api/messages/615a8be41c2b20f6e47c256d')
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(404);
  });

  //? How can you honestly test for this? Maybe figure out which part of the id is the date? Maybe run this test with a cleared db?
  test('Single message route responds with error msg when message does not exist', async () => {
    const res = await request(app)
      .get('/api/messages/615a8be41c2b20f6e47c256d')
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.error.text).toContain('No message found with id');
  });

  test('Single message route responds with 401 when token not in header', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${debbieToken}`)
      .send({
        data: {
          content: 'I am the Mom',
        },
      });
    const res = await request(app).get(
      `/api/messages/${msgRes.body.message._id}`
    );
    expect(res.status).toBe(401);
  });

  test('Single message route responds with error msg when token not in header', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am the dog',
        },
      });
    const res = await request(app).get(
      `/api/messages/${msgRes.body.message._id}`
    );
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('Single message route responds with 401 when author id does not match token', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${debbieToken}`)
      .send({
        data: {
          content: 'Get off the couch!',
        },
      });
    const res = await request(app)
      .get(`/api/messages/${msgRes.body.message._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(401);
  });

  test('Single message route responds with error msg when author id does not match token', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'But I am tired...',
        },
      });
    const res = await request(app)
      .get(`/api/messages/${msgRes.body.message._id}`)
      .set('Authorization', `Bearer ${debbieToken}`);
    expect(res.error.text).toContain(
      'Not authorized, message not authored by user'
    );
  });

  test('Single message route responds with 200 when message exists', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am ALIVE!!!',
        },
      });
    const res = await request(app)
      .get(`/api/messages/${msgRes.body.message._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(200);
  });

  test('Single message route responds with message when it exists', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'Where am I?',
        },
      });
    const res = await request(app)
      .get(`/api/messages/${msgRes.body.message._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.body.message).toBeTruthy();
  });

  test('New message route responds with parentId when submitted with one', async () => {
    const msgRes1 = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'Hello? Is there anybody in there?',
        },
      });
    const msgRes2 = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: 'Just nod if you can hear me...',
          parentId: msgRes1.body.message._id,
        },
      });
    expect(msgRes2.body.message.parentId).toBe(msgRes1.body.message._id);
  });

  test('New message route responds without parentId when submitted without one', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'Where am I?',
        },
      });
    const res = await request(app)
      .get(`/api/messages/${msgRes.body.message._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.body.message.parentId).toBeNull();
  });

  test('do not include participants that were not involved', async () => {
    const msgRes1 = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'Hello everybody!',
          participants: [user1._id, user2._id, user3._id],
          timestamp: new Date(),
        },
      });
    const msg1 = msgRes1.body.message;

    const msgRes2 = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: "What's going on?!",
          participants: [user1._id, user2._id, user3._id],
          timestamp: new Date(),
          parentId: msg1._id,
        },
      });
    const msg2 = msgRes2.body.message;

    const msgRes3 = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user3Token}`)
      .send({
        data: {
          content: 'Who are you people?',
          participants: [user1._id, user2._id, user3._id],
          timestamp: new Date(),
          parentId: msg2._id,
        },
      });
    const msg3 = msgRes3.body.message;

    const msgRes4 = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: 'Bahaha!!!',
          participants: [user1._id, user2._id, user3._id],
          timestamp: new Date(),
          parentId: msg3._id,
        },
      });

    const msgRes5 = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: "Let's just you and I talk...",
          participants: [user1._id, user2._id],
          timestamp: new Date(),
        },
      });
    const msg5 = msgRes5.body.message;

    const msgRes6 = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'Ok, sounds good',
          participants: [user1._id, user2._id],
          timestamp: new Date(),
          parentId: msg5._id,
        },
      });

    const user1Messages = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`);

    const firstUser1MessageThreadFlat =
      user1Messages.body.messages[1].flat(Infinity);

    const firstUser1MessageThreadIDs = firstUser1MessageThreadFlat.map(
      (msg) => msg.author._id
    );

    expect(firstUser1MessageThreadIDs).not.toContain(user3._id);
  });

  test('do include participants involved', async () => {
    const user1Messages = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`);

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
      .get('/api/messages')
      .set('Authorization', `Bearer ${user4Token}`);

    expect(user4Messages.body.messages).toHaveLength(0);
  });

  test('editMessage route responds with 401 when no token in header', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a message to be edited',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .send({ data: { content: 'I am an edited message' } });
    expect(res.status).toBe(401);
  });

  test('editMessage route responds with error msg when no token in header', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am also a message to be edited',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .send({ data: { content: 'I am an edited message' } });
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('editMessage route responds with 404 when no message exists', async () => {
    const msgId = '615a8be41c2b20f6e47c256d';
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ data: { content: 'I am an edited message' } });
    expect(res.status).toBe(404);
  });

  test('editMessage route responds with error msg when no message exists', async () => {
    const msgId = '615a8be41c2b20f6e47c256d';
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ data: { content: 'I am an edited message' } });
    expect(res.error.text).toContain('Message not found');
  });

  test('editMessage route responds with 400 when body data is not sent', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a message that will still be here',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.status).toBe(400);
  });

  test('editMessage route responds with error msg when body data is not sent', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am also a message that will still be here',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.error.text).toContain('No message data sent');
  });

  test('edit message responds with 400 when authors do not match', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${debbieToken}`)
      .send({
        data: {
          content: 'I am a message that maggie cannot alter',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am maggie trying to change a message that is not mine',
        },
      });
    expect(res.status).toBe(400);
  });

  test('edit message responds with error msg when authors do not match', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am a maggie message that maggie cannot alter',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${debbieToken}`)
      .send({
        data: {
          content: 'I am debbie trying to change a message that is not mine',
        },
      });
    expect(res.error.text).toContain(
      'Cannot alter message when author and user ids do not match'
    );
  });

  test('editMessage route responds with 201 when new message is submitted', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am a message to be edited',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({ data: { content: 'I am an edited message' } });
    expect(res.status).toBe(201);
  });

  test('editMessage route responds with new message when edit is successful', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a bad message to be edited',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ data: { content: 'I am an awesome edited message' } });
    expect(res.body.message.content).toBe('I am an awesome edited message');
  });

  test('getMessage route responds with 200 when editMessage route is successful', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a message to be edited and then retrieved',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am an edited message but I will be retrieved later',
        },
      });
    const res = await request(app)
      .get(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.status).toBe(200);
  });

  test('getMessage route responds with correct message when edit is successful', async () => {
    const msgToBeEditedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user3Token}`)
      .send({
        data: {
          content: 'I am another message to be edited and then retrieved',
        },
      });
    const msgId = msgToBeEditedRes.body.message._id;
    await request(app)
      .put(`/api/messages/${msgId}/edit`)
      .set('Authorization', `Bearer ${user3Token}`)
      .send({
        data: {
          content:
            'I am another edited message but I will also be retrieved later',
        },
      });
    const res = await request(app)
      .get(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user3Token}`);
    expect(res.body.message.content).toBe(
      'I am another edited message but I will also be retrieved later'
    );
  });

  test('deleteMessage route responds with 401 when no token in header', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a bad message to be deleted',
        },
      });
    const res = await request(app).delete(
      `/api/messages/${msgRes.body.message._id}`
    );
    expect(res.status).toBe(401);
  });

  test('deleteMessage route responds with error msg when no token in header', async () => {
    const msgRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: 'I am a bad message to be deleted',
        },
      });
    const res = await request(app).delete(
      `/api/messages/${msgRes.body.message._id}`
    );
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('deleteMessage route responds with 404 when no message exists', async () => {
    const msgId = '615a8be41c2b20f6e47c256d';
    const res = await request(app)
      .delete(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.status).toBe(404);
  });

  test('deleteMessage route responds with error msg when no message exists', async () => {
    const msgId = '615a8be41c2b20f6e47c256d';
    const res = await request(app)
      .delete(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.error.text).toContain('No message found');
  });

  test('deleteMessage responds with 400 when authors do not match', async () => {
    const msgToBeDeletedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${debbieToken}`)
      .send({
        data: {
          content: 'I am a message that will not be deleted',
        },
      });
    const res = await request(app)
      .delete(`/api/messages/${msgToBeDeletedRes.body.message._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.status).toBe(400);
  });

  test('deleteMessage responds with error msg when authors do not match', async () => {
    const msgToBeDeletedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am a message that will not be deleted',
        },
      });
    const res = await request(app)
      .delete(`/api/messages/${msgToBeDeletedRes.body.message._id}`)
      .set('Authorization', `Bearer ${debbieToken}`);
    expect(res.error.text).toContain(
      'Cannot delete message when author and user ids do not match'
    );
  });

  test('deleteMessage responds with 200 when message is successfully deleted', async () => {
    const msgToBeDeletedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a message that WILL be deleted',
        },
      });
    const res = await request(app)
      .delete(`/api/messages/${msgToBeDeletedRes.body.message._id}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.status).toBe(200);
  });

  test('deleteMessage responds with deleted message id when message is successfully deleted', async () => {
    const msgToBeDeletedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: 'I am a message that WILL be deleted',
        },
      });
    const res = await request(app)
      .delete(`/api/messages/${msgToBeDeletedRes.body.message._id}`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res.body.id).toContain(msgToBeDeletedRes.body.message._id);
  });

  test('getMessage responds with 404 when deleted message id is attempted to be retrieved', async () => {
    const msgToBeDeletedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${user3Token}`)
      .send({
        data: {
          content: 'I am a message that WILL be deleted',
        },
      });
    const delMsgRes = await request(app)
      .delete(`/api/messages/${msgToBeDeletedRes.body.message._id}`)
      .set('Authorization', `Bearer ${user3Token}`);
    const res = await request(app)
      .get(`/api/messages/${delMsgRes.body.id}`)
      .set('Authorization', `Bearer ${user3Token}`);
    expect(res.status).toBe(404);
  });

  test('getMessage responds with error msg when deleted message is attempted to be retrieved', async () => {
    const msgToBeDeletedRes = await request(app)
      .post('/api/messages/new')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am a message that WILL be deleted',
        },
      });
    const delMsgRes = await request(app)
      .delete(`/api/messages/${msgToBeDeletedRes.body.message._id}`)
      .set('Authorization', `Bearer ${maggieToken}`);
    const res = await request(app)
      .get(`/api/messages/${delMsgRes.body.id}`)
      .set('Authorization', `Bearer ${maggieToken}`);
    expect(res.error.text).toContain('No message found');
  });
});
