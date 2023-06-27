const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { logInfo } = require('./utils/logger');

const app = express();

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl =
  'mongodb+srv://carson:ch6632ch@cluster0.xinayli.mongodb.net/bloglist';
mongoose.connect(mongoUrl).then(() => logInfo('connected to ', mongoUrl));

app.use(cors());
app.use(express.json());

app.get('./api/blogs', (req, res) => {
  Blog.find({}).then((blogs) => res.json(blogs));
});

app.post('/api/blogs', (req, res) => {
  const blog = Blog(req.body);

  blog.save().then((savedBlog) => res.status(201).json(savedBlog));
});

const PORT = 3003;
app.listen(PORT, () => logInfo(`Server running on port ${PORT}`));
