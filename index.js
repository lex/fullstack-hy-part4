const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./utils/config");
const mongoose = require("mongoose");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

app.use(cors());
app.use(bodyParser.json());

const mongoUrl = config.mongoUrl;
mongoose.connect(mongoUrl);
mongoose.Promise = global.Promise;
const PORT = config.port;

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("close", () => {
  mongoose.connection.close();
});

module.exports = { app, server };
