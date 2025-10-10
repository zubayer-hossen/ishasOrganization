const Blog = require('../models/Blog');
const AuditLog = require('../models/AuditLog');

// ================= CREATE BLOG =================
exports.createBlog = async (req, res) => {
  try {
    const { title, body, image } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title required' });

    const blog = await Blog.create({
      title,
      body,
      image,
      author: req.user._id,
    });

    // Audit log
    await AuditLog.create({
      action: 'create-blog',
      actor: req.user._id,
      detail: blog,
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ================= LIST ALL BLOGS =================
exports.listBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ================= GET SINGLE BLOG =================
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      'author',
      'name avatar'
    );
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ================= DELETE BLOG =================
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    await AuditLog.create({
      action: 'delete-blog',
      actor: req.user._id,
      detail: { id: req.params.id },
    });

    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ================= UPDATE BLOG ================= (optional)
exports.updateBlog = async (req, res) => {
  try {
    const { title, body, image } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, body, image },
      { new: true }
    );

    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    await AuditLog.create({
      action: 'update-blog',
      actor: req.user._id,
      detail: blog,
    });

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
