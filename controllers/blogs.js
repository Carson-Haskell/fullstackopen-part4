const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    res.status(400).json({ error: 'Title and url required to post' });
  }

  const blog = new Blog({
    title,
    author: author || 'anonymous',
    url,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

module.exports = blogsRouter;
