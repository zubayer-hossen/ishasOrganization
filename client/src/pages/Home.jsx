import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import BannerSlider from "../components/common/BannerSlider";
import NoticeBoard from "../components/common/NoticeBoard";
import Headlines from "../components/common/Headlines";
import BlogCards from "../components/common/BlogCards";
import {
  ClockIcon,
  ArrowRightIcon,
  BellAlertIcon,
  NewspaperIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

// ======================================================================
// 🆕 CONDITIONAL DIGITAL CLOCK COMPONENT (Overflow-Safe)
// ======================================================================
const DigitalClock = ({ message }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-center p-4 rounded-xl border border-red-200 bg-red-50">
      <ClockIcon className="h-8 w-8 mx-auto text-red-500 mb-2 animate-pulse" />
      <p className="text-3xl font-extrabold text-gray-900 tracking-wide mb-1 whitespace-nowrap overflow-hidden">
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>
      <p className="text-sm font-semibold text-gray-500 line-clamp-1">
        {time.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
      <p className="mt-3 text-base font-bold text-red-600 line-clamp-1">
        {message}
      </p>
    </div>
  );
};

// ======================================================================
// 🏠 FINAL HOME COMPONENT (Complete and Polished)
// ======================================================================
export default function Home() {
  const bannerImages = [
    "banner1.jpg",
    "banner2.jpg",
    "banner3.jpg",
    "banner4.jpg",
  ];

  // Test Case: Empty array (shows clock)
  const headlines = [""];

  // Headlines FIX: Check for valid strings and prepare the data
  const validHeadlines = headlines.filter((h) => h && h.trim().length > 0);
  const hasHeadlines = validHeadlines.length > 0;

  const headlinesData = hasHeadlines
    ? validHeadlines
    : ["No Headlines Available Right Now 📢"];

  // --- ভিডিও ডেটা স্ট্রাকচার (3rd Video Added Here) ---
  const allVideos = [
    {
      id: "RRQuhdJfYnk",
      title: "🌳 বৃক্ষরোপণ কর্মসূচি: সবুজ ভবিষ্যতের পথে",
      description:
        "আমাদের পরিবেশ সচেতনতামূলক কর্মসূচির সবচেয়ে উজ্জ্বল মুহূর্ত। দেখুন কীভাবে আমরা সবুজ ভবিষ্যতের পথে এগিয়ে চলেছি।",
      isFeatured: true, // This will be the main video
      icon: <TrophyIcon className="h-6 w-6 mr-2 text-cyan-400" />,
    },
    {
      id: "Om2JtON7JaI",
      title: "📰 আমাদের অতীত গৌরব ও মিডিয়া কভারেজ",
      description:
        "সংগঠনের দীর্ঘ পথচলার এক ঝলক। পুরনো দিনের মিডিয়া কাভারেজ দেখুন এবং আমাদের ঐতিহ্য সম্পর্কে জানুন।",
      isFeatured: false,
      icon: <NewspaperIcon className="h-6 w-6 mr-2 text-indigo-400" />,
    },
    {
      id: "9m_J-rW-2Q8", // 🆕 NEW ACHIEVEMENT VIDEO ID (Example)
      title: "🏆 সংগঠনের অর্জন: আমাদের সাফল্যগাঁথা",
      description:
        "গত বছরের সেরা অর্জন এবং সাফল্যের গল্প। সদস্যদের অক্লান্ত পরিশ্রমের ফলস্বরূপ এই অর্জন।",
      isFeatured: false,
      icon: <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />,
    },
  ];

  const featuredVideo = allVideos.find((video) => video.isFeatured);
  const otherVideos = allVideos.filter((video) => !video.isFeatured);

  const getEmbedUrl = (videoId) =>
    `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0&autoplay=0&mute=0`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* -------------------- ১. ব্যানার স্লাইডার -------------------- */}
        <section className="mb-16 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/50 transition-all duration-700 hover:shadow-indigo-500/70 border-8 border-white">
          <BannerSlider images={bannerImages} />
        </section>

        {/* -------------------- ২. মূল কন্টেন্ট গ্রিড: হেডলাইন, নোটিশ এবং ব্লগ -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-16">
          {/* 👇 কলাম A (হেডলাইন / ডিজিটাল ক্লক ও নোটিশ বোর্ড) */}
          <div className="lg:col-span-1 space-y-10">
            {/* হেডলাইন সেকশন */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-cyan-500/20 border-t-8 border-cyan-500 transform transition-transform duration-500 hover:scale-[1.03]">
              <h3 className="text-xl font-bold mb-4 text-cyan-800 border-b pb-2 flex items-center whitespace-nowrap overflow-hidden">
                <NewspaperIcon className="h-5 w-5 mr-2 text-cyan-500" />
                তাৎক্ষণিক খবর ও সময়
              </h3>

              {hasHeadlines ? (
                <Headlines headlines={headlinesData} />
              ) : (
                <DigitalClock message={headlinesData[0]} />
              )}
            </div>

            {/* নোটিশ বোর্ড */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-indigo-500/20 border-t-8 border-indigo-500 transform transition-transform duration-500 hover:scale-[1.03]">
              <h3 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2 flex items-center whitespace-nowrap overflow-hidden">
                <BellAlertIcon className="h-5 w-5 mr-2 text-indigo-500" />
                গুরুত্বপূর্ণ বিজ্ঞপ্তি
              </h3>
              <NoticeBoard />
            </div>
          </div>

          {/* 👇 কলাম B (লেটেস্ট ব্লগ) */}
          <div className="lg:col-span-3">
            <section className="bg-white p-10 rounded-3xl shadow-2xl shadow-gray-400/30 border border-gray-100 transform transition-transform duration-500 hover:shadow-indigo-500/30">
              <h2 className="text-3xl font-extrabold mb-8 text-indigo-700 border-b-2 border-indigo-100 pb-3 flex items-center whitespace-nowrap overflow-hidden">
                📚 সাম্প্রতিক ব্লগ পোস্ট ও নিবন্ধ
              </h2>
              <BlogCards />
              <div className="text-right mt-8">
                <button className="inline-flex items-center text-lg font-bold text-indigo-600 hover:text-indigo-800 transition duration-300">
                  <a href="/blogs">সকল পোস্ট দেখুন</a>
                  <ArrowRightIcon className="h-6 w-6 ml-2" />
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* -------------------- সেকশন ডিভাইডার -------------------- */}
        <div className="h-1 bg-cyan-500/50 rounded-full my-16 max-w-2xl mx-auto"></div>

        {/* -------------------- ৩. ফিচারড ভিডিও সেকশন (ভিজ্যুয়াল হাইলাইট) -------------------- */}
        {featuredVideo && (
          <section className="my-20 pt-12 pb-16 bg-gray-800 rounded-3xl border-8 border-indigo-500/50 shadow-2xl shadow-indigo-900/50">
            <div className="text-center mb-12">
              <span className="text-lg font-semibold uppercase text-cyan-400">
                বিশেষ মিডিয়া কাভারেজ
              </span>
              <h2 className="text-5xl font-black text-white mt-2 mb-3 tracking-tighter line-clamp-2">
                আমাদের সবচেয়ে গুরুত্বপূর্ণ প্রতিবেদন
              </h2>
            </div>

            <div className="max-w-6xl mx-auto px-4">
              {/* Featured Video Container */}
              <div className="p-4 bg-gray-900 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] border-4 border-cyan-500">
                <div className="relative overflow-hidden pt-[56.25%] rounded-xl">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={getEmbedUrl(featuredVideo.id)}
                    title={featuredVideo.title}
                    allow="accelerometer; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    frameBorder="0"
                  ></iframe>
                </div>
              </div>

              <div className="text-center mt-6 p-6 bg-gray-700 rounded-xl border border-cyan-500/50">
                <h3 className="text-2xl font-bold text-cyan-400 line-clamp-1">
                  {featuredVideo.title}
                </h3>
                <p className="text-md text-gray-300 mt-2 line-clamp-2">
                  {featuredVideo.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* -------------------- ৪. অন্যান্য ভিডিও সেকশন (আর্কাইভ মিডিয়া) -------------------- */}
        {otherVideos.length > 0 && (
          <section className="my-16 py-10 bg-gray-100 rounded-3xl shadow-inner shadow-gray-300 border border-gray-200">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tighter">
                📺 আর্কাইভ মিডিয়া গ্যালারি ও অর্জন
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
              {otherVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative overflow-hidden pt-[56.25%] rounded-lg">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={getEmbedUrl(video.id)}
                      title={video.title}
                      allow="accelerometer; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      frameBorder="0"
                    ></iframe>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center line-clamp-1">
                      {video.icon}
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 transition duration-300 transform hover:scale-105"
              >
                Watch All Videos on YouTube
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </a>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
