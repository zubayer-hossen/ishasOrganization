// src/components/social/FacebookStatsCard.jsx
import React, { useEffect, useState } from "react";
import { Facebook } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const FacebookStatsCard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "https://ishasorganizationbackend.onrender.com/api/social/facebook"
        );
        setStats(res.data);
      } catch (err) {
        setError("Unable to load Facebook stats 😢");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-500 animate-pulse">
        Loading Facebook stats...
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

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-3xl shadow-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-4 rounded-full">
          <Facebook className="text-white w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{stats.pageName}</h2>
          <a
            href={stats.pageLink}
            target="_blank"
            rel="noreferrer"
            className="text-blue-100 underline text-sm"
          >
            Visit Facebook Page
          </a>
        </div>
      </div>

      <div className="flex gap-10 text-center">
        <div>
          <h3 className="text-3xl font-bold">
            {stats.followers?.toLocaleString()}
          </h3>
          <p className="text-sm">Followers</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold">
            {stats.likes?.toLocaleString()}
          </h3>
          <p className="text-sm">Likes</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FacebookStatsCard;
