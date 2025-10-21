// server/app.js
require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

// =====================
// 🗄️ Database Connection
// =====================
connectDB();

// =====================
// 🌍 Allowed Origins (Frontend URLs)
// =====================
const allowedOrigins = [
  "https://ishasorganization.netlify.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

// =====================
// 🧩 Global Middleware
// =====================
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow Postman / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// =====================
// 🚦 Rate Limiting
// =====================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", apiLimiter);

// =====================
// 📦 Route Imports
// =====================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/funds", require("./routes/fund"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/blogs", require("./routes/blog"));
app.use("/api/notices", require("./routes/notice"));
app.use("/api/social", require("./routes/socialRoutes"));

// =====================
// 🩺 Health Check
// =====================
app.get("/", (req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// =====================
// ⚠️ Global Error Handler
// =====================
app.use(errorHandler);

// =====================
// 🚀 Export App
// =====================
module.exports = app;
