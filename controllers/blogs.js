const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      _id: 1,
      username: 1,
      name: 1
    });
    response.json(blogs.map(Blog.format));
  } catch (exception) {
    response.status(500).json({ error: "something went wrong" });
  }
});

blogsRouter.get("/:id", async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);

    if (blog) {
      response.json(Blog.format(blog));
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    return response.status(400).json({ error: "no such id" });
  }
});

blogsRouter.post("/", async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const body = request.body;

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    if (body.title === undefined) {
      return response.status(400).json({ error: "title missing" });
    }

    if (body.author === undefined) {
      return response.status(400).json({ error: "author missing" });
    }

    if (body.url === undefined) {
      return response.status(400).json({ error: "url missing" });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url,
      likes: body.likes,
      user: user._id
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (exception) {
    console.log(exception);
    response.status(500).json({ error: "something went wrong" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const blog = await Blog.findById(request.params.id);

    if (decodedToken.id !== `${blog.user}`) {
      return response.status(401).json({ error: "unauthorized" });
    }

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
