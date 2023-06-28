const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'A blog title',
    author: 'Carson Haskell',
    url: 'www.blog.com',
    likes: 3,
  },
  {
    title: 'Big Scary Dinosaur',
    author: 'Jude Haskell',
    url: 'www.blog.com',
    likes: 0,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
