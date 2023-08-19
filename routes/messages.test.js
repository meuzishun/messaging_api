const app = require('../app');
const request = require('supertest');
const {
  initializeMongoServer,
  disconnectMongoServer,
} = require('../mongoTestingConfig');

describe('Message routes', () => {
  beforeAll(async () => {
    await initializeMongoServer();
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

  test('Messages route responds with an array', async () => {
    const res = await request(app).get('/messages');
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
    const userRes = await request(app)
      .post('/register')
      .send({
        data: {
          firstName: 'Maggie',
          lastName: 'May',
          email: 'maggie@email.com',
          password: '1234password5678',
        },
      });
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: userRes.body.user._id,
        },
      });
    expect(res.status).toBe(400);
  });

  test('New message route responds with error msg when no content is included', async () => {
    const userRes = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'maggie@email.com',
          password: '1234password5678',
        },
      });
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: userRes.body._id,
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
    const userRes = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'maggie@email.com',
          password: '1234password5678',
        },
      });
    //* Only for isolating this test:
    // const userRes = await request(app).post('/register').send({
    //   firstName: 'Maggie',
    //   lastName: 'May',
    //   email: 'maggie@email.com',
    //   password: '1234password5678',
    // });
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: userRes.body.user._id,
          content: 'Hello world',
        },
      });
    expect(res.status).toBe(201);
  });

  test('New message route responds with message when new message submission is successful', async () => {
    const userRes = await request(app)
      .post('/login')
      .send({
        data: {
          email: 'maggie@email.com',
          password: '1234password5678',
        },
      });
    const res = await request(app)
      .post('/messages/new')
      .send({
        data: {
          author: userRes.body.user._id,
          content: 'Yo planet!',
        },
      });

    expect(res.body.message.content).toEqual('Yo planet!');
  });

  test.skip('Single message route exists', async () => {
    //! This is a strange test. If you don't include a legit-looking document id in the url, a 200 status is sent, bypassing any conditional checks in the controller. In short, may need to be rewritten or perhaps not included at all.
    const res = await request(app).get('/messages/123');
    expect(res.status).not.toBe(404);
  });

  // Single message route responds with 404 when message does not exist
  test('Single message route responds with 404 when message does not exist', async () => {
    const res = await request(app).get('/messages/615a8be41c2b20f6e47c256d');
    expect(res.status).toBe(404);
  });

  // Single message route responds with 200 when message exists
  test.skip('Single message route responds with 200 when message exists', async () => {});
  // Single message route responds with message when it exists
  test.skip('Single message route responds with message when it exists', async () => {});

  // New message route responds with parentId when submitted with one
  test.skip('New message route responds with parentId when submitted with one', async () => {});
});
