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

describe('Get messages routes', () => {
  test('exists', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).not.toBe(404);
  });

  test('responds with 200 status when token in header', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieToken}`);

    expect(res.status).toBe(200);
  });

  test('responds with 401 error when no token in header', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).toBe(401);
  });

  test('responds with error msg when no token in header', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with an array when user is signed in', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieToken}`);

    expect(res.body.messages).toBeInstanceOf(Array);
  });

  test('responds with empty array when user has no messages', async () => {
    const { token: user4Token } = loggedInUsers.find(
      (user) => user.firstName === 'Fourth'
    );
    const user4Messages = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${user4Token}`);

    expect(user4Messages.body.messages).toHaveLength(0);
  });

  test('responds with array of length 1 when only one message thread exists', async () => {
    const { token: user10token } = loggedInUsers.find(
      (user) => user.firstName === 'Tenth'
    );

    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user10token}`)
      .send({
        data: {
          content: 'I am a test message.',
        },
      });

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${user10token}`);

    expect(res.body.messages.length).toBe(1);
  });

  test('responds with populated author data with firstName and lastName properties', async () => {
    const { token: user1Token, _id: user1id } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`);

    const authors = res.body.messages
      .flat(Infinity)
      .map((message) => message.author);

    for (const author of authors) {
      expect(author).toHaveProperty('firstName');
      expect(author).toHaveProperty('lastName');
    }
  });

  test('responds with populated author data without unnecessary properties', async () => {
    const { token: user1Token, _id: user1id } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`);

    const authors = res.body.messages
      .flat(Infinity)
      .map((message) => message.author);

    for (const author of authors) {
      expect(author).not.toHaveProperty('email');
      expect(author).not.toHaveProperty('password');
      expect(author).not.toHaveProperty('friends');
    }
  });

  test('responds with array of participants', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const maggieUser = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${debbieUser.token}`)
      .send({
        data: {
          content: 'Hi Maggie',
          participants: [debbieUser._id, maggieUser._id],
        },
      });

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    for (const thread of res.body.messages) {
      for (const message of thread) {
        expect(Array.isArray(message.participants)).toBe(true);
      }
    }
  });

  test('responds with participants that have first names', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    for (const thread of res.body.messages) {
      for (const message of thread) {
        for (const participant of message.participants) {
          expect(participant.firstName).toBeTruthy();
        }
      }
    }
  });

  test('responds with participants that have last names', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    for (const thread of res.body.messages) {
      for (const message of thread) {
        for (const participant of message.participants) {
          expect(participant.lastName).toBeTruthy();
        }
      }
    }
  });

  test('responds with participants that have emails', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    for (const thread of res.body.messages) {
      for (const message of thread) {
        for (const participant of message.participants) {
          expect(participant.email).toBeTruthy();
        }
      }
    }
  });

  test('responds with participants that have ids', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    for (const thread of res.body.messages) {
      for (const message of thread) {
        for (const participant of message.participants) {
          expect(participant._id).toBeTruthy();
        }
      }
    }
  });

  test('responds with participants that do not have passwords', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    for (const thread of res.body.messages) {
      for (const message of thread) {
        for (const participant of message.participants) {
          expect(participant.password).toBeFalsy();
        }
      }
    }
  });

  test('responds with participants that do not have friends', async () => {
    const debbieUser = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${debbieUser.token}`);

    for (const thread of res.body.messages) {
      for (const message of thread) {
        for (const participant of message.participants) {
          expect(participant.friends).toBeFalsy();
        }
      }
    }
  });
});

describe('New message route', () => {
  test('exists', async () => {
    const res = await request(app).post('/api/messages');
    expect(res.status).not.toBe(404);
  });

  test('responds with 400 status when no body is sent', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(400);
  });

  test('responds with error msg when no body is sent', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.error.text).toContain('Message has no content');
  });

  //? not sure this test is needed
  test('responds with 400 status when no content is included', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(400);
  });

  //? not sure this test is needed
  test('responds with error msg when no content is included', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.error.text).toContain('Message has no content');
  });

  test('responds with 401 status when token is not included in header', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({
        data: {
          content: 'Hello world',
        },
      });

    expect(res.status).toBe(401);
  });

  test('responds with error msg when token is not included in header', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({
        data: {
          content: 'Hello world',
        },
      });

    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with 201 status when new message submission is successful', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'Hello world',
        },
      });

    expect(res.status).toBe(201);
  });

  test('responds with message when new message submission is successful', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'Yo planet!',
        },
      });

    expect(res.body.message.content).toEqual('Yo planet!');
  });

  test('responds with 400 status when message body is empty', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: '',
        },
      });

    expect(res.status).toBe(400);
  });

  test('responds with parentId when submitted with one', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const { token: user2Token } = loggedInUsers.find(
      (user) => user.firstName === 'Second'
    );

    const msgRes1 = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'Hello? Is there anybody in there?',
        },
      });

    const msgRes2 = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: 'Just nod if you can hear me...',
          parentId: msgRes1.body.message._id,
        },
      });

    expect(msgRes2.body.message.parentId).toBe(msgRes1.body.message._id);
  });

  test('responds without parentId when submitted without one', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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

  test('responds without participants that were not involved', async () => {
    const { token: user1Token, _id: user1id } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const { token: user2Token, _id: user2id } = loggedInUsers.find(
      (user) => user.firstName === 'Second'
    );

    const { token: user3Token, _id: user3id } = loggedInUsers.find(
      (user) => user.firstName === 'Third'
    );

    const msgRes1 = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'Hello everybody!',
          participants: [user1id, user2id, user3id],
          timestamp: new Date(),
        },
      });

    const msg1 = msgRes1.body.message;

    const msgRes2 = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: "What's going on?!",
          participants: [user1id, user2id, user3id],
          timestamp: new Date(),
          parentId: msg1._id,
        },
      });
    const msg2 = msgRes2.body.message;

    const msgRes3 = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user3Token}`)
      .send({
        data: {
          content: 'Who are you people?',
          participants: [user1id, user2id, user3id],
          timestamp: new Date(),
          parentId: msg2._id,
        },
      });
    const msg3 = msgRes3.body.message;

    const msgRes4 = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: 'Bahaha!!!',
          participants: [user1id, user2id, user3id],
          timestamp: new Date(),
          parentId: msg3._id,
        },
      });

    const msgRes5 = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        data: {
          content: "Let's just you and I talk...",
          participants: [user1id, user2id],
          timestamp: new Date(),
        },
      });
    const msg5 = msgRes5.body.message;

    const msgRes6 = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'Ok, sounds good',
          participants: [user1id, user2id],
          timestamp: new Date(),
          parentId: msg5._id,
        },
      });

    const user1Messages = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`);

    const firstUser1MessageThreadFlat =
      user1Messages.body.messages[2].flat(Infinity);

    const firstUser1MessageThreadIDs = firstUser1MessageThreadFlat.map(
      (msg) => msg.author._id
    );

    expect(firstUser1MessageThreadIDs).not.toContain(user3id);
  });

  test('responds with participants involved', async () => {
    const { token: user1Token, _id: user1id } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const { _id: user2id } = loggedInUsers.find(
      (user) => user.firstName === 'Second'
    );

    const user1Messages = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`);

    const firstUser1MessageThreadFlat =
      user1Messages.body.messages[1].flat(Infinity);

    const firstUser1MessageThreadIDs = firstUser1MessageThreadFlat.map(
      (msg) => msg.author._id
    );

    expect(firstUser1MessageThreadIDs).toContain(user1id);
    expect(firstUser1MessageThreadIDs).toContain(user2id);
  });
});

describe('Get message route', () => {
  test('exists', async () => {
    //! This is a strange test. If you don't include a legit-looking document id in the url, a 200 status is sent, bypassing any conditional checks in the controller. In short, may need to be rewritten or perhaps not included at all.
    const res = await request(app).get('/api/messages/123');
    expect(res.status).not.toBe(404);
  });

  test('responds with 400 when message id is wrong format', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get('/api/messages/123')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(400);
  });

  test('responds with error msg when message id is wrong format', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get('/api/messages/123')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.error.text).toContain('Invalid message ID');
  });

  //? How can you honestly test for this? Maybe figure out which part of the id is the date? Maybe run this test with a cleared db?
  test('responds with 404 when message does not exist', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get('/api/messages/615a8be41c2b20f6e47c256d')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(404);
  });

  //? How can you honestly test for this? Maybe figure out which part of the id is the date? Maybe run this test with a cleared db?
  test('responds with error msg when message does not exist', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const res = await request(app)
      .get('/api/messages/615a8be41c2b20f6e47c256d')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.error.text).toContain('No message found with id');
  });

  test('responds with 401 when token not in header', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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

  test('responds with error msg when token not in header', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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

  test('responds with 401 when author id does not match token', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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

  test('responds with error msg when author id does not match token', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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

  test('responds with 200 when message exists', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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

  test('responds with message when it exists', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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
});

describe('Edit message route', () => {
  test('responds with 401 when no token in header', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a message to be edited',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .send({ data: { content: 'I am an edited message' } });

    expect(res.status).toBe(401);
  });

  test('responds with error msg when no token in header', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am also a message to be edited',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .send({ data: { content: 'I am an edited message' } });

    expect(res.error.text).toContain('Not authorized, no token');
  });

  test('responds with 404 when no message exists', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgId = '615a8be41c2b20f6e47c256d';
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ data: { content: 'I am an edited message' } });

    expect(res.status).toBe(404);
  });

  test('responds with error msg when no message exists', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgId = '615a8be41c2b20f6e47c256d';
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ data: { content: 'I am an edited message' } });

    expect(res.error.text).toContain('Message not found');
  });

  test('responds with 400 when body data is not sent', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a message that will still be here',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(400);
  });

  test('responds with error msg when body data is not sent', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am also a message that will still be here',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.error.text).toContain('Message has no content');
  });

  test('responds with 400 when authors do not match', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${debbieToken}`)
      .send({
        data: {
          content: 'I am a message that maggie cannot alter',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am maggie trying to change a message that is not mine',
        },
      });

    expect(res.status).toBe(400);
  });

  test('responds with error msg when authors do not match', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am a maggie message that maggie cannot alter',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
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

  test('responds with 201 when new message is submitted', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am a message to be edited',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({ data: { content: 'I am an edited message' } });

    expect(res.status).toBe(201);
  });

  test('responds with new message when edit is successful', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a bad message to be edited',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    const res = await request(app)
      .put(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ data: { content: 'I am an awesome edited message' } });

    expect(res.body.message.content).toBe('I am an awesome edited message');
  });

  test('causes getMessage route to respond with 200 when editMessage route is successful', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        data: {
          content: 'I am a message to be edited and then retrieved',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    await request(app)
      .put(`/api/messages/${msgId}`)
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

  test('causes getMessage route to respond with correct message when editMessage is successful', async () => {
    const { token: user3Token } = loggedInUsers.find(
      (user) => user.firstName === 'Third'
    );

    const msgToBeEditedRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${user3Token}`)
      .send({
        data: {
          content: 'I am another message to be edited and then retrieved',
        },
      });

    const msgId = msgToBeEditedRes.body.message._id;
    await request(app)
      .put(`/api/messages/${msgId}`)
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
});

describe('Delete message route', () => {
  test('responds with 401 when no token in header', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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

  test('responds with error msg when no token in header', async () => {
    const { token: user2Token } = loggedInUsers.find(
      (user) => user.firstName === 'Second'
    );

    const msgRes = await request(app)
      .post('/api/messages')
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

  test('responds with 400 status when messageId is invalid', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${maggieToken}`)
      .send({
        data: {
          content: 'I am a bad message to be deleted',
        },
      });

    const res = await request(app)
      .delete('/api/messages/123abc')
      .set('Authorization', `Bearer ${maggieToken}`);

    expect(res.status).toBe(400);
  });

  test('responds with error msg when messageId is invalid', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${debbieToken}`)
      .send({
        data: {
          content: 'I am a bad message to be deleted',
        },
      });

    const res = await request(app)
      .delete('/api/messages/123abc')
      .set('Authorization', `Bearer ${debbieToken}`);

    expect(res.error.text).toContain('Invalid message ID');
  });

  test('responds with 404 when no message exists', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgId = '615a8be41c2b20f6e47c256d';
    const res = await request(app)
      .delete(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(404);
  });

  test('responds with error msg when no message exists', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgId = '615a8be41c2b20f6e47c256d';
    const res = await request(app)
      .delete(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.error.text).toContain('No message found');
  });

  test('responds with 400 when authors do not match', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgToBeDeletedRes = await request(app)
      .post('/api/messages')
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

  test('responds with error msg when authors do not match', async () => {
    const { token: debbieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Debbie'
    );

    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgToBeDeletedRes = await request(app)
      .post('/api/messages')
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

  test('responds with 200 when message is successfully deleted', async () => {
    const { token: user1Token } = loggedInUsers.find(
      (user) => user.firstName === 'User'
    );

    const msgToBeDeletedRes = await request(app)
      .post('/api/messages')
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

  test('responds with deleted message id when message is successfully deleted', async () => {
    const { token: user2Token } = loggedInUsers.find(
      (user) => user.firstName === 'Second'
    );

    const msgToBeDeletedRes = await request(app)
      .post('/api/messages')
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

  test('causes getMessage to respond with 404 when deleted message id is attempted to be retrieved', async () => {
    const { token: user3Token } = loggedInUsers.find(
      (user) => user.firstName === 'Third'
    );

    const msgToBeDeletedRes = await request(app)
      .post('/api/messages')
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

  test('causes getMessage to respond with error msg when deleted message is attempted to be retrieved', async () => {
    const { token: maggieToken } = loggedInUsers.find(
      (user) => user.firstName === 'Maggie'
    );

    const msgToBeDeletedRes = await request(app)
      .post('/api/messages')
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
