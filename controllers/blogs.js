const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { title, name, author, url, likes } = req.body;

  const blog = new Blog({
    title,
    name,
    author,
    url,
    likes,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

module.exports = blogsRouter;
