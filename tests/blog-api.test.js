const supertest = require("supertest");
const { app, server } = require("../index");
const api = supertest(app);
const Blog = require("../models/blog");

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

const initializeDatabase = async () => {
  await Blog.remove({});

  await Promise.all(
    initialBlogs.map(async b => {
      let blogObject = new Blog(b);
      await blogObject.save();
    })
  );
};

describe("GET /api/blogs", () => {
  beforeEach(async () => {
    await initializeDatabase();
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body.length).toBe(initialBlogs.length);
  });

  test("a specific blog is within the returned notes", async () => {
    const response = await api.get("/api/blogs");

    const contents = response.body.map(r => r.title);

    expect(contents).toContain("Type wars");
  });
});

describe("POST /api/blogs", () => {
  beforeEach(async () => {
    await initializeDatabase();
  });

  test("posted blog is added to the list of blogs", async () => {
    const newBlog = { title: "j", author: "j", url: "j" };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const blogs = response.body.map(r => r.title);

    expect(response.body.length).toBe(initialBlogs.length + 1);
    expect(blogs).toContain("j");
  });

  test("a blog without a title is not added", async () => {
    const newBlog = { author: "j", url: "j" };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400);

    const response = await api.get("/api/blogs");
    const blogs = response.body.map(r => r.title);

    expect(response.body.length).toBe(initialBlogs.length);
  });

  test("a blog without an author is not added", async () => {
    const newBlog = { title: "j", url: "j" };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400);

    const response = await api.get("/api/blogs");
    const blogs = response.body.map(r => r.title);

    expect(response.body.length).toBe(initialBlogs.length);
  });

  test("a blog without a url is not added", async () => {
    const newBlog = { title: "j", author: "j" };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400);

    const response = await api.get("/api/blogs");
    const blogs = response.body.map(r => r.title);

    expect(response.body.length).toBe(initialBlogs.length);
  });

  test("a blog without likes has its likes initialized to 0", async () => {
    const newBlog = { title: "j", author: "j", url: "j" };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201);

    const response = await api.get("/api/blogs");
    const blog = response.body.find(b => b.title === "j");

    expect(blog.likes).toBe(0);
  });
});

afterAll(() => {
  server.close();
});
