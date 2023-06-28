const _ = require('lodash');

const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (!blogs.length > 0) return 'no blogs';

  const favorite = blogs.reduce((mostLiked, blog) =>
    blog.likes > mostLiked.likes ? blog : mostLiked,
  );

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (!blogs.length > 0) return 'no blogs';

  const groupedByAuthor = _.groupBy(blogs, 'author');

  const authorsWithBlogs = _.map(groupedByAuthor, (blogPosts, author) => {
    const totalBlogs = blogPosts.length;

    return {
      author,
      blogs: totalBlogs,
    };
  });

  const authorWithMostBlogs = _.maxBy(authorsWithBlogs, 'blogs');

  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  if (!blogs.length > 0) return 'no blogs';

  const groupedByAuthor = _.groupBy(blogs, 'author');

  const authorsWithLikes = _.map(groupedByAuthor, (blogPosts, author) => {
    const authorsTotalLikes = _.sumBy(blogPosts, 'likes');

    return { author, likes: authorsTotalLikes };
  });

  const authorWithMostLikes = _.maxBy(authorsWithLikes, 'likes');

  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
