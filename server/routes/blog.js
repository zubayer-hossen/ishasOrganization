const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blogController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/roles');

// ======= CREATE BLOG (Admin/Owner only) =======
router.post('/', auth, requireRole(['admin', 'owner']), blogCtrl.createBlog);

// ======= LIST ALL BLOGS (Public) =======
router.get('/', blogCtrl.listBlogs);

// ======= GET SINGLE BLOG (Public) =======
router.get('/:id', blogCtrl.getBlog);

// ======= DELETE BLOG (Admin/Owner only) =======
router.delete('/:id', auth, requireRole(['admin', 'owner']), blogCtrl.deleteBlog);

// ======= UPDATE BLOG (Admin/Owner only, optional) =======
router.put('/:id', auth, requireRole(['admin', 'owner']), blogCtrl.updateBlog);

module.exports = router;
