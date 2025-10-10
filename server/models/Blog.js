// server/models/Blog.js
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, default:"Nothing to read." },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String, default:"" },
  publishedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', BlogSchema);
