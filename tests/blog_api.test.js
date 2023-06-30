const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);

const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));

  const blogsToSave = blogObjects.map((blog) => blog.save());
  await Promise.all(blogsToSave);

  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('123', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

// FETCHING
describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs are uniquely indentifed with id', async () => {
    const storedBlogs = await helper.blogsInDb();

    expect(storedBlogs[0].id).toBeDefined();
  });
});

// CREATING
describe('addition of a new note', () => {
  test('properly stores in database', async () => {
    const loginCreds = {
      username: 'root',
      password: '123',
    };

    const loginInfo = await api.post('/api/login').send(loginCreds).expect(200);

    const { token } = loginInfo.body;

    await api
      .post('/api/blogs')
      .send(helper.dummyBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const addedBlog = blogsAtEnd.at(-1);
    expect(addedBlog.title).toBe(helper.dummyBlog.title);
    expect(addedBlog.author).toBe(helper.dummyBlog.author);
    expect(addedBlog.url).toBe(helper.dummyBlog.url);
    expect(addedBlog.likes).toBe(helper.dummyBlog.likes);
  });

  test('likes property defaults to 0 when not specified', async () => {
    const blogWithoutLikes = { ...helper.dummyBlog, likes: null };

    await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const addedBlog = blogsAtEnd.at(-1);
    expect(addedBlog.likes).toBe(0);
  });

  test('returns 400 status when title or url is missing from request', async () => {
    const blogMissingData = { ...helper.dummyBlog, title: null, url: null };

    await api.post('/api/blogs').send(blogMissingData).expect(400);
  });
});

// DELETING
describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const ids = blogsAtEnd.map((b) => b.id);
    expect(ids).not.toContain(blogToDelete.id);
  });
});

// UPDATING
describe('updating a blog', () => {
  test('updates likes properly with valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const likes = 7;

    const blogUpdate = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes,
    };

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogUpdate).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    const updattedBlog = blogsAtEnd[0];
    expect(updattedBlog.likes).toBe(likes);
    expect(updattedBlog.title).toBe(blogToUpdate.title);
    expect(updattedBlog.author).toBe(blogToUpdate.author);
    expect(updattedBlog.url).toBe(blogToUpdate.url);
  });
});

afterAll(() => mongoose.connection.close());
