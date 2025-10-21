// server/controllers/socialController.js
const axios = require("axios");

const FB_API_BASE = "https://graph.facebook.com/v18.0";

/**
 * 📊 Fetch Facebook Page Stats (followers, likes, name, link)
 */
exports.getFacebookStats = async (req, res) => {
  try {
    const { FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN } = process.env;

    if (!FB_PAGE_ID || !FB_PAGE_ACCESS_TOKEN) {
      return res.status(500).json({
        ok: false,
        msg: "Server misconfiguration: FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN missing.",
      });
    }

    const fields = "fan_count,followers_count,name,link,about";
    const url = `${FB_API_BASE}/${FB_PAGE_ID}?fields=${fields}&access_token=${FB_PAGE_ACCESS_TOKEN}`;

    const fbRes = await axios.get(url, { timeout: 8000 });
    const data = fbRes.data || {};

    const result = {
      ok: true,
      pageName: data.name || "Unknown Page",
      pageLink: data.link || process.env.FB_PAGE_URL || null,
      likes: data.fan_count ?? null,
      followers: data.followers_count ?? data.fan_count ?? null,
      about: data.about || null,
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ FB stats fetch error:", err.response?.data || err.message);
    return res.status(502).json({
      ok: false,
      msg: "Unable to fetch Facebook stats (API error).",
    });
  }
};

/**
 * 🎥 Fetch Facebook Live Videos (for embedding in frontend)
 */
exports.getFacebookLiveVideos = async (req, res) => {
  try {
    const { FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN } = process.env;

    if (!FB_PAGE_ID || !FB_PAGE_ACCESS_TOKEN) {
      return res.status(500).json({
        ok: false,
        msg: "Server misconfiguration: FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN missing.",
      });
    }

    const url = `${FB_API_BASE}/${FB_PAGE_ID}/live_videos?fields=id,title,description,status,creation_time,embed_html&access_token=${FB_PAGE_ACCESS_TOKEN}`;
    const fbRes = await axios.get(url, { timeout: 10000 });
    const videos = fbRes.data?.data || [];

    return res.status(200).json({
      ok: true,
      count: videos.length,
      videos,
    });
  } catch (err) {
    console.error("❌ FB live video fetch error:", err.response?.data || err.message);
    return res.status(502).json({
      ok: false,
      msg: "Unable to fetch Facebook live videos.",
    });
  }
};
