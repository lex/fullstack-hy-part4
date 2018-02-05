const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
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

const initialUsers = [
  {
    username: "mluukkai",
    _id: 123456,
    notes: [
      {
        content: "HTML on helppoa",
        important: false
      },
      {
        content: "HTTP-protokollan tärkeimmät metodit ovat GET ja POST",
        important: true
      }
    ]
  },
  {
    content: "hellas",
    _id: 141414,
    notes: [
      {
        content:
          "Java on kieli, jota käytetään siihen asti kunnes aurinko sammuu",
        important: false
      }
    ]
  }
];

const format = blog => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: blog._id
  };
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(format);
};

const initializeDatabase = async () => {
  await User.remove({});
  const user = new User({ username: "root", password: "sekret" });
  await user.save();

  await Blog.remove({});

  await Promise.all(
    initialBlogs.map(async b => {
      let blogObject = new Blog(b);
      await blogObject.save();
    })
  );
};

const createNewBlog = () => {
  return {
    title: "j",
    author: "j",
    url: "j"
  };
};

const usersInDb = async () => {
  const users = await User.find({});
  return users;
};

const createNewUser = (username, password, name, adult) => {
  return {
    username: username,
    name: name,
    password: password,
    adult: adult
  };
};

const getUserFromDb = async () => {
  const user = await User.findOne({});
  return user;
};

module.exports = {
  initialBlogs,
  format,
  initializeDatabase,
  blogsInDb,
  createNewBlog,
  usersInDb,
  createNewUser,
  getUserFromDb
};
