const jwt = require('jsonwebtoken');

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    res.status(400).json({ error: 'Title and url required to post' });
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid ' });
  }

  const { user } = req;

  const blog = new Blog({
    url,
    title,
    author: author || 'anonymous',
    user: user.id,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();

  user.blogs = [...user.blogs, savedBlog._id];
  await user.save();

  return res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  const blog = await Blog.findById(req.params.id);
  const userId = blog.user.toString();

  if (userId !== decodedToken.id.toString()) {
    return res.status(401).json({ error: 'token invalid' });
  }

  await Blog.findByIdAndDelete(req.params.id);
  return res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body;

  const blogToUpdate = await Blog.findById(req.params.id);

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes,
  };

  await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true });

  res.status(204).json(updatedBlog);
});

module.exports = blogsRouter;
