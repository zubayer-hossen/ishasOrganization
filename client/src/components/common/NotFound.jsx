import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Animated Floating Background Circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-96 h-96 rounded-full bg-white/20 blur-3xl"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1.2, 1.8, 1.2], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] rounded-full bg-pink-400/30 blur-3xl"
      />

      {/* Main Content */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[150px] font-extrabold text-white drop-shadow-lg"
        >
          404
        </motion.h1>

        <h2 className="text-3xl font-semibold text-white mb-3 drop-shadow-md">
          Oops! Page Not Found 😢
        </h2>
        <p className="text-white/80 max-w-md mb-8">
          The page you’re looking for doesn’t exist or has been moved. But don’t
          worry — you can always head back to safety!
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-white/80 text-indigo-700 font-semibold rounded-full shadow-md hover:bg-white"
        >
          ⬅️ Go Back Home
        </motion.button>
      </motion.div>

      {/* Floating 3D Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotateZ: [0, 15, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-16 left-10 w-32 h-32 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-2xl shadow-2xl blur-sm"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotateZ: [0, -20, 20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-24 right-16 w-40 h-40 bg-gradient-to-br from-pink-300 to-indigo-400 rounded-full shadow-2xl blur-sm"
      />
    </div>
  );
};

export default NotFound;
