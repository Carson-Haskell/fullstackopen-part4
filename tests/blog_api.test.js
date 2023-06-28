const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const helper = require('./test_helper');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));

  const blogsToSave = blogObjects.map((blog) => blog.save());
  await Promise.all(blogsToSave);
});

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('notes are uniquely indentiifed with id', async () => {
  const storedBlogs = await helper.blogsInDb();

  expect(storedBlogs[0].id).toBeDefined();
});

afterAll(() => mongoose.connection.close());
