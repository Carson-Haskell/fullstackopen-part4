const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', (req, res, next) => {
  const { title, name, author, url, likes } = req.body;

  const blog = new Blog({
    title,
    name,
    author,
    url,
    likes,
  });

  blog
    .save()
    .then((savedBlog) => res.json(savedBlog))
    .catch((err) => next(err));
});

module.exports = blogsRouter;
