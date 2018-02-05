const mongoose = require("mongoose");
const User = require("./user");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

blogSchema.statics.format = blog => {
  return {
    id: blog.id,
    author: blog.author,
    title: blog.title,
    url: blog.url,
    user: blog.user
  };
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
