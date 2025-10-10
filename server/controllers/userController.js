const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// GET OWN PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name','fatherName','phone','nid','address','occupation','avatar','bio'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true }).select('-password');

    await AuditLog.create({ action: 'update-profile', actor: req.user._id, detail: updates });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// LIST USERS (ADMIN)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// CHANGE ROLE & VERIFICATION (ADMIN)
exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isVerified } = req.body;
    const updateData = {};
    const validRoles = ['member','committee','treasurer','admin','owner','kosadhokko'];
    if (role && validRoles.includes(role)) updateData.role = role;
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await AuditLog.create({ action: 'update-user', actor: req.user._id, detail: { id, ...updateData } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await AuditLog.create({ action: 'delete-user', actor: req.user._id, detail: { id } });
    res.json({ msg: 'User deleted successfully', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
