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

test('blogs are uniquely indentiifed with id', async () => {
  const storedBlogs = await helper.blogsInDb();

  expect(storedBlogs[0].id).toBeDefined();
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'A Test Blog',
    author: 'Mr. Test',
    url: 'www.test.com',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const addedBlog = blogsAtEnd.at(-1);
  expect(addedBlog.title).toBe(newBlog.title);
  expect(addedBlog.author).toBe(newBlog.author);
  expect(addedBlog.url).toBe(newBlog.url);
  expect(addedBlog.likes).toBe(newBlog.likes);
});

afterAll(() => mongoose.connection.close());
