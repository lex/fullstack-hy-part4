const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({}).populate("blogs", {
      _id: 1,
      likes: 1,
      author: 1,
      title: 1,
      url: 1
    });
    response.json(users.map(User.format));
  } catch (exception) {
    console.log(exception);
    response.status(500).json({ error: "something went wrong" });
  }
});

usersRouter.post("/", async (request, response) => {
  try {
    const body = request.body;

    if (body.password.length < 3) {
      return response.status(400).json({ error: "password too short" });
    }

    if (body.username === undefined) {
      return response.status(400).json({ error: "no username provided" });
    }

    const existingUser = await User.findOne({ username: body.username });
    if (existingUser !== null) {
      return response.status(400).json({ error: "username taken" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult || true,
      passwordHash
    });

    const savedUser = await user.save();

    response.json(User.format(savedUser));
  } catch (exception) {
    console.log(exception);
    response.status(500).json({ error: "something went wrong" });
  }
});

module.exports = usersRouter;
