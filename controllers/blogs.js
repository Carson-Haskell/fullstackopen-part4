const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (req, res) => {
  Blog.find({}).then((blogs) => res.json(blogs));
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
