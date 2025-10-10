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

// 💡 সমাধান: CORS হোয়াইটলিস্ট (Whitelist) তৈরি করা।
// এটি স্ল্যাশ (/) জনিত সমস্যা এড়াতে সাহায্য করবে।
const allowedOrigins = [
    'https://ishasorganization.netlify.app', // স্ল্যাশ ছাড়া
    'https://ishasorganization.netlify.app/', // স্ল্যাশসহ
    'http://localhost:3000', // লোকাল ডেভেলপমেন্টের জন্য
    'http://localhost:5173', // যদি আপনি Vite ব্যবহার করেন
];

// CLIENT_URL এনভায়রনমেন্ট ভ্যারিয়েবল থাকলে, সেটিও হোয়াইটলিস্টে যোগ করা হবে।
if (process.env.CLIENT_URL) {
    const cleanUrl = process.env.CLIENT_URL.replace(/\/$/, ''); // শেষের স্ল্যাশ মুছে
    allowedOrigins.push(cleanUrl);
    allowedOrigins.push(cleanUrl + '/');
}


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
        // Allow requests with no origin (like mobile apps or postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS Error: Origin ${origin} not allowed by the server.`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true
}));

// Rate limiting... (rest of the code remains the same)
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