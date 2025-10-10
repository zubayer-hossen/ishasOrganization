// server/controllers/uploadController.js
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

exports.uploadMiddleware = upload.single('file');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const stream = cloudinary.uploader.upload_stream({ folder: 'ishas' }, (error, result) => {
      if (error) return res.status(500).json({ msg: 'Upload error', error });
      return res.json({ url: result.secure_url, public_id: result.public_id });
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
