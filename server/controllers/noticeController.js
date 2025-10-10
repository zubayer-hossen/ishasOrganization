// server/controllers/noticeController.js
const Notice = require('../models/Notice');
const AuditLog = require('../models/AuditLog');

exports.createNotice = async (req, res) => {
  try {
    const { title, content, pinned } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title required' });
    const notice = await Notice.create({ title, content, pinned, postedBy: req.user._id });
    await AuditLog.create({ action: 'create-notice', actor: req.user._id, detail: notice });
    res.status(201).json(notice);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.listNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate('postedBy', 'name').sort({ pinned: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    await AuditLog.create({ action: 'delete-notice', actor: req.user._id, detail: { id: req.params.id } });
    res.json({ msg: 'Deleted' });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};
