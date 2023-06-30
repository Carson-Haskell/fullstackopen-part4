const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes, userId } = req.body;

  if (!title || !url) {
    res.status(400).json({ error: 'Title and url required to post' });
  }

  const user = await User.findById(userId);

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

  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
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

  console.log(updatedBlog);
  await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true });

  res.status(204).json(updatedBlog);
});

module.exports = blogsRouter;
