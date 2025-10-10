require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// =====================
// Connect to MongoDB
// =====================
connectDB();

// =====================
// Middleware
// =====================
app.use(helmet()); // Security headers
app.use(express.json({ limit: '10mb' })); // JSON parsing
app.use(express.urlencoded({ extended: true })); // URL encoded
app.use(cookieParser()); // Parse cookies

// Enable CORS for frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://ishasorganization.netlify.app',
  credentials: true
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

// =====================
// Routes
// =====================
app.use('/api/auth', require('./routes/auth'));      // Auth routes
app.use('/api/users', require('./routes/users'));    // User routes
app.use('/api/funds', require('./routes/fund'));      // Fund routes
app.use('/api/upload', require('./routes/upload'));  // Upload routes
app.use('/api/blogs', require('./routes/blog'));     // Blog routes
app.use('/api/notices', require('./routes/notice')); // Notice routes

// =====================
// Health Check
// =====================
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// =====================
// Error Handler
// =====================
app.use(errorHandler);

// =====================
// Export app
// =====================
module.exports = app;
