// server/routes/socialRoutes.js
const express = require("express");
const router = express.Router();
const socialCtrl = require("../controllers/socialController");

// 👉 Facebook page stats (likes/followers)
router.get("/facebook", socialCtrl.getFacebookStats);

// 👉 Facebook live videos (embed)
router.get("/facebook/live", socialCtrl.getFacebookLiveVideos);

module.exports = router;
