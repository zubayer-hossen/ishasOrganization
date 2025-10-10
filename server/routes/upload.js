// server/routes/upload.js
const express = require('express');
const router = express.Router();
const uploadCtrl = require('../controllers/uploadController');
const auth = require('../middlewares/auth');

router.post('/', auth, uploadCtrl.uploadMiddleware, uploadCtrl.uploadFile);

module.exports = router;
