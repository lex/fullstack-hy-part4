const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  try {
    const body = request.body;

    if (body.title === undefined) {
      return response.status(400).json({ error: "title missing" });
    }

    if (body.author === undefined) {
      return response.status(400).json({ error: "author missing" });
    }

    if (body.url === undefined) {
      return response.status(400).json({ error: "url missing" });
    }

    const blog = new Blog(request.body);

    if (blog.likes === undefined) {
      blog.likes = 0;
    }

    const result = await blog.save();
    response.status(201).json(result);
  } catch (exception) {
    console.log(exception);
    response.status(500).json({ error: "something went wrong" });
  }
});

module.exports = blogsRouter;
