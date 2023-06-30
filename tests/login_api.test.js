const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');

const User = require('../models/user');

const api = supertest(app);

describe('when attempting to login', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('123', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('login succeeds with valid credentials', async () => {
    const loginCreds = {
      username: 'root',
      password: '123',
    };

    const result = await api
      .post('/api/login')
      .send(loginCreds)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.username).toBe(loginCreds.username);
  });

  test('successful login generates token', async () => {
    const loginCredentials = {
      username: 'root',
      password: '123',
    };

    const result = await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.token).toBeDefined();
  });

  test('login fails with properstatus code and message if username invalid', async () => {
    const invalidLoginCreds = {
      username: 'notroot',
      password: '123',
    };

    const result = await api
      .post('/api/login')
      .send(invalidLoginCreds)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('invalid username or password');
  });

  test('login fails with properstatus code and message if password invalid', async () => {
    const invalidLoginCreds = {
      username: 'root',
      password: 'wrongpassword',
    };

    const result = await api
      .post('/api/login')
      .send(invalidLoginCreds)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('invalid username or password');
  });
});
