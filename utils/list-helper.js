const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0);
};

const favoriteBlog = blogs => {
  return blogs.reduce(
    (previous, current) => (previous.likes > current.likes ? previous : current)
  );
};

const mostBlogs = blogs => {
  return blogs
    .reduce((acc, cur) => {
      const b = acc.find(bb => bb.author === cur.author);
      if (b === undefined) {
        acc.push({ author: cur.author, blogs: 1 });
      } else {
        b.blogs += 1;
      }
      return acc;
    }, [])
    .reduce((prev, cur) => (prev.blogs > cur.blogs ? prev : cur));
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
