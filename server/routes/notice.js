// server/routes/notice.js
const express = require('express');
const router = express.Router();
const noticeCtrl = require('../controllers/noticeController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/roles');

router.post('/', auth, requireRole(['admin','owner','committee']), noticeCtrl.createNotice);
router.get('/', noticeCtrl.listNotices);
router.delete('/:id', auth, requireRole(['admin','owner','committee']), noticeCtrl.deleteNotice);

module.exports = router;
