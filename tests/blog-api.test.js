const supertest = require("supertest");
const { app, server } = require("../index");
const api = supertest(app);
const Blog = require("../models/blog");
const {
  initialBlogs,
  format,
  initializeDatabase,
  blogsInDb,
  createNewBlog
} = require("./test-helper");

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

  test("a valid blog is added to the list of blogs", async () => {
    const newBlog = createNewBlog();
    const blogsBefore = await blogsInDb();

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfter = await blogsInDb();

    expect(blogsAfter.length).toBe(blogsBefore.length + 1);
    expect(blogsAfter.filter(b => b.title === "j").length).toBe(1);
  });

  test("a blog with missing fields is not added", async () => {
    const fields = ["author", "title", "url"];
    const blogsBefore = await blogsInDb();

    await Promise.all(
      fields.map(async key => {
        let newBlog = createNewBlog();
        delete newBlog[key];

        await api
          .post("/api/blogs")
          .send(newBlog)
          .expect(400);

        const blogsAfter = await blogsInDb();
        expect(blogsBefore.length).toBe(blogsAfter.length);
      })
    );
  });

  test("a blog without likes has its likes initialized to 0", async () => {
    const newBlog = createNewBlog();

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201);

    const blogs = await blogsInDb();
    expect(blogs.filter(b => b.title === "j")[0].likes).toBe(0);
  });
});

afterAll(() => {
  server.close();
});
