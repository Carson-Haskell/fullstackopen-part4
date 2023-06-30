const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');

const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

// Verify unique username
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('123', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'carsonhas',
      name: 'Carson Haskell',
      password: '123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: '123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

// Verify valid password and username
describe('when invalid data is given', () => {
  test('creation fails with proper statuscode when password is null', async () => {
    const usersAtStart = helper.usersInDb();

    const newUser = {
      username: 'carsonhas',
      name: 'Carson Haskell',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password required');

    const usersAtEnd = helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode when password is too short', async () => {
    const usersAtStart = helper.usersInDb();

    const newUser = {
      username: 'carsonhas',
      name: 'Carson Haskell',
      password: '12',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password must be at least 3 characters long',
    );

    const usersAtEnd = helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper status code when username is null', async () => {
    const usersAtStart = helper.usersInDb();

    const newUser = {
      name: 'Carson Haskell',
      password: '123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username required');

    const usersAtEnd = helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper status code when username is too short', async () => {
    const usersAtStart = helper.usersInDb();

    const newUser = {
      username: 'ca',
      name: 'Carson Haskell',
      password: '123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'username must be at least 3 characters long',
    );

    const usersAtEnd = helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});
