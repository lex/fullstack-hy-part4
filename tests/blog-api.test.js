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

    const response = await api
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

describe("DELETE /api/blogs/<id>", () => {
  beforeEach(async () => {
    await initializeDatabase();
  });

  test("a blog with a valid id is deleted from the list", async () => {
    const blogsBefore = await blogsInDb();
    const id = `${blogsBefore[0].id}`;

    await api.delete(`/api/blogs/${id}`).expect(204);

    const blogsAfter = await blogsInDb();

    expect(blogsAfter.length).toBe(blogsBefore.length - 1);
    expect(blogsAfter.filter(b => b.id === id).length).toBe(0);
  });

  test("a blog with an invalid id returns a suitable status code", async () => {
    const id = "1";

    await api.delete(`/api/blogs/${id}`).expect(400);
  });
});

describe("PUT /api/blogs/<id>", () => {
  beforeEach(async () => {
    await initializeDatabase();
  });

  test("a blog with a valid id is modified", async () => {
    const blogsBefore = await blogsInDb();
    const id = `${blogsBefore[0].id}`;
    let newBlog = createNewBlog();
    const likes = 7;
    newBlog.likes = likes;

    await api
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(200);

    const blogsAfter = await blogsInDb();
    const modifiedBlog = blogsAfter.filter(b => `${b.id}` === id)[0];

    expect(modifiedBlog.author === newBlog.author);
    expect(modifiedBlog.title === newBlog.title);
    expect(modifiedBlog.url === newBlog.url);
    expect(modifiedBlog.likes === newBlog.likes);
  });

  test("a blog with an invalid id return a suitable status code", async () => {
    const id = "5";
    let newBlog = createNewBlog();
    const likes = 7;
    newBlog.likes = likes;

    await api
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(400);
  });
});

afterAll(() => {
  server.close();
});
