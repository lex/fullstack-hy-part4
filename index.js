const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl);
mongoose.Promise = global.Promise;
const PORT = process.env.PORT || 3001;

const blogsRouter = require("./controllers/blogs");
app.use("/api/blogs", blogsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
