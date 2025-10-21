// src/components/social/FacebookLiveVideos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const FacebookLiveVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          "https://ishasorganizationbackend.onrender.com/api/social/facebook/live"
        );
        setVideos(res.data.videos || []);
      } catch (err) {
        setError("Unable to fetch Facebook live videos 😢");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-500 animate-pulse">
        Loading live videos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-xl text-center shadow-md">
        {error}
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No live videos found right now 📺
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
        <PlayCircle className="inline w-7 h-7 text-blue-500 mr-2" />
        Live Videos from Facebook
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div
              className="aspect-video"
              dangerouslySetInnerHTML={{ __html: video.embed_html }}
            ></div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">
                {video.title || "Live Video"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {video.description || "Facebook Live Broadcast"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(video.creation_time).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FacebookLiveVideos;
