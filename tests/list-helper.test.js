const listHelper = require("../utils/list-helper");

test("dummy is called", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
];

describe("total likes", () => {
  test("when list contains only a single blog, total likes are equal to the likes of that blog", () => {
    const oneBlog = [blogs[0]];
    const expected = oneBlog[0].likes;
    const result = listHelper.totalLikes(oneBlog);
    expect(result).toBe(expected);
  });

  test("when list is empty, total likes should be 0", () => {
    const emptyBlogs = [];
    const expected = 0;
    const result = listHelper.totalLikes(emptyBlogs);
    expect(result).toBe(expected);
  });

  test("when a list of blogs is given, total likes should be the sum of likes", () => {
    const expected = blogs.reduce((acc, cur) => acc + cur.likes, 0);
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(expected);
  });
});

describe("favorite blog", () => {
  test("when a list of blogs is given, the blog with most likes should be returned", () => {
    const expected = blogs[2];
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(expected);
  });

  test("when a list of blogs with equal likes is given, the function returns one of them", () => {
    const blogsWithEqualLikes = blogs.map(blog => {
      blog.likes = 2;
      return blog;
    });
    const result = listHelper.favoriteBlog(blogsWithEqualLikes);
    expect(blogsWithEqualLikes.includes(result)).toBe(true);
  });
});
