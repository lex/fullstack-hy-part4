const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

const formatUser = user => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    adult: user.adult
  };
};

usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({});
    response.json(users.map(formatUser));
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

    response.json(formatUser(savedUser));
  } catch (exception) {
    console.log(exception);
    response.status(500).json({ error: "something went wrong" });
  }
});

module.exports = usersRouter;
