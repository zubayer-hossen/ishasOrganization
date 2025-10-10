import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen p-6 md:p-12">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Hero Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>
              <div className="p-8 md:p-16 relative z-10 text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4"
                >
                  ইশাস সংগঠন <span className="text-indigo-500">⟪ ইশাস ⟫</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-gray-700 text-lg md:text-xl"
                >
                  মানবতার সেবায়, একসাথে এগিয়ে চলি।
                </motion.p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 md:p-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-indigo-100 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">ঠিকানা</h3>
                <p>Islampur, Koyra, Khulna, Khulna, Bangladesh</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-pink-100 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">যোগাযোগ</h3>
                <p>📞 +880 1898-886497</p>
                <p>✉️ ishas.official2008@gmail.com</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-100 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">ধরন</h3>
                <p>Nonprofit Organization</p>
                <p>Social Service | Youth Organization</p>
              </motion.div>
            </div>

            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 p-8 md:p-16"
            >
              <h2 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
                আমাদের লক্ষ্য
              </h2>
              <p className="text-gray-700 text-lg md:text-xl text-center max-w-3xl mx-auto">
                ইশাস একটি স্বেচ্ছাসেবী সংগঠন, যা শিক্ষা, মানবিক সহায়তা ও
                সচেতনতা বৃদ্ধিতে কাজ করে। আমাদের লক্ষ্য একটি ন্যায়সঙ্গত ও
                সমৃদ্ধ সমাজ গড়ে তোলা।
                <br />
                <span className="font-semibold text-indigo-600">
                  📚 শিক্ষা
                </span>{" "}
                |{" "}
                <span className="font-semibold text-pink-600">
                  ❤️ মানবিক সহায়তা
                </span>{" "}
                |{" "}
                <span className="font-semibold text-green-600">🗣️ সচেতনতা</span>
              </p>
            </motion.div>

            {/* Animated Footer */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="p-8 md:p-16 text-center bg-indigo-50"
            >
              <p className="text-indigo-700 font-bold text-lg md:text-xl">
                আমাদের সাথে যোগ দিন, মানবতার পথে এগিয়ে চলুন!
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
