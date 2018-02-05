const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (exception) {
    response.status(500).json({ error: "something went wrong" });
  }
});

blogsRouter.get("/:id", async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    return response.status(400).json({ error: "no such id" });
  }
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

    const result = await blog.save();
    response.status(201).json(result);
  } catch (exception) {
    console.log(exception);
    response.status(500).json({ error: "something went wrong" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    console.log(exception);
    response.status(400).send({ error: "no such id" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  try {
    const body = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
      new: true
    });
    response.json(updatedBlog);
  } catch (exception) {
    console.log(exception);
    response.status(400).send({ error: "no such id" });
  }
});

module.exports = blogsRouter;
