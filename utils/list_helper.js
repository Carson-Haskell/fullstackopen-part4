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

  const mostBlogged = _.head(
    _(blogs).countBy('author').entries().maxBy(_.last),
  );

  let blogCount = 0;
  blogs.forEach((blog) => {
    if (blog.author === mostBlogged) {
      blogCount += 1;
    }
  });

  return {
    author: mostBlogged,
    blogs: blogCount,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
