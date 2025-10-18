// server/app.js
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

// Allow frontend requests with credentials
const allowedOrigins = [
  'https://ishasorganization.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

// =====================
// Middleware
// =====================
app.use(helmet()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 

// Enable CORS for frontend using the dynamic whitelist

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // postman / curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // ✅ must for cookies
}));

// Rate limiting...
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200, 
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

// =====================
// Routes...
// =====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/funds', require('./routes/fund'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/notices', require('./routes/notice'));

// =====================
// Health Check...
// =====================
app.get('/', (req, res) => {
    res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// =====================
// Error Handler...
// =====================
app.use(errorHandler);

// =====================
// Export app
// =====================
module.exports = app;