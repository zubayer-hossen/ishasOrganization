const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Token from header or cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.jid;
    if (!token) return res.status(401).json({ msg: 'Unauthorized: No token' });

    // Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
    }

    // Fetch user from DB
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ msg: 'Unauthorized: User not found' });

    req.user = user; // attach user to req
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Unauthorized: Server error' });
  }
};
