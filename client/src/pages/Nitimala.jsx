import { useState } from "react";
import {
  FiDownloadCloud,
  FiZap,
  FiCheckCircle,
  FiStar,
  FiHome,
} from "react-icons/fi";
import { saveAs } from "file-saver";

// 🔗 ডাউনলোড ফাইলের তথ্য
const PDF_FILE_PATH = "/Nitimala_01.pdf"; // আপনার পাবলিক ফোল্ডারের আসল ফাইল পাথ
const DOWNLOAD_FILE_NAME = "ISHAS_Nitimala_Gothontontro.pdf";
// 🏠 হোমপেজ রুট: সাধারণত '/' হয়
const HOME_PAGE_PATH = "/";

export default function InspiredDownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    // Simulate a brief delay for the animation/user experience
    setTimeout(() => {
      try {
        saveAs(PDF_FILE_PATH, DOWNLOAD_FILE_NAME);
        // Reset state after successful download (or prompt closure)
        setIsDownloading(false);
      } catch (error) {
        console.error("Download failed:", error);
        setIsDownloading(false);
        alert("দুঃখিত, ডাউনলোড শুরু করা যায়নি।");
      }
    }, 1500); // 1.5 সেকেন্ডের অপেক্ষা
  };

  // 🔄 Function to handle redirection (use window.location for simple redirect)
  const redirectToHome = () => {
    // Note: If you are using React Router, you should use navigate(HOME_PAGE_PATH) instead.
    window.location.href = HOME_PAGE_PATH;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-gray-800 shadow-3xl rounded-3xl p-8 md:p-12 text-center border-4 border-teal-500/50 transform hover:scale-[1.01] transition-transform duration-500">
        {/* 🏆 Title & Motivation */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-400 mb-4 animate-fadeInUp">
          <FiZap className="inline mr-3 text-5xl" />
          সংগঠনের মূল ভিত্তি ডাউনলোড করুন!
        </h1>
        <p className="text-lg text-gray-400 mb-10 animate-fadeInUp delay-300">
          এই ফাইলটিতে ISHAS সংগঠনের সম্পূর্ণ গঠনতন্ত্র এবং নীতিমালা রয়েছে—যা
          প্রতিটি সদস্যের জন্য অপরিহার্য।
        </p>

        {/* 🌟 Key Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<FiCheckCircle />}
            title="সম্পূর্ণ স্পষ্টতা"
            description="সকল বিধি ও নিয়মাবলি সহজ ভাষায় লিখিত।"
            color="text-green-400"
          />
          <FeatureCard
            icon={<FiStar />}
            title="সর্বশেষ আপডেট"
            description="২০২৪ সালের সর্বশেষ সংশোধিত সংস্করণ।"
            color="text-yellow-400"
          />
          <FeatureCard
            icon={<FiDownloadCloud />}
            title="দ্রুত অ্যাক্সেস"
            description="এক ক্লিকেই আপনার ডিভাইসে ফাইলটি সুরক্ষিত রাখুন।"
            color="text-blue-400"
          />
        </div>

        {/* ⬇️ The Animated Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`
            w-full py-5 px-6 rounded-full font-black text-2xl uppercase transition-all duration-300 mb-4
            flex items-center justify-center shadow-2xl tracking-wider 
            ${
              isDownloading
                ? "bg-gray-600 text-gray-300 cursor-not-allowed animate-pulse"
                : "bg-teal-500 text-gray-900 hover:bg-teal-400 transform hover:scale-105 button-animation"
            }
          `}
        >
          {isDownloading ? (
            <>
              ডাউনলোড হচ্ছে...
              <div className="loader ml-3"></div>
            </>
          ) : (
            <>
              <FiDownloadCloud className="text-3xl mr-3" />
              এখনি ডাউনলোড করুন (ফ্রি)
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 mb-6">
          ফাইল সাইজ: ~২ মেগাবাইট | ফরম্যাট: PDF
        </p>

        {/* 🏠 New Home Button */}
        <button
          onClick={redirectToHome}
          className="w-full py-3 px-6 rounded-full font-bold text-lg transition-all duration-300 
                     flex items-center justify-center bg-gray-600 text-white hover:bg-gray-500 hover:text-teal-400
                     transform hover:scale-[1.02] shadow-xl border border-gray-500"
        >
          <FiHome className="text-2xl mr-3" />
          সম্পূর্ণ ওয়েবসাইট দেখুন
        </button>
      </div>

      <style>{`
        /* Custom Keyframes for Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fadeInUp.delay-300 {
          animation-delay: 0.3s;
        }

        /* Button Glow Animation */
        .button-animation {
            box-shadow: 0 0 15px rgba(52, 211, 163, 0.7); /* Teal glow */
        }
        .button-animation:hover {
            box-shadow: 0 0 25px rgba(16, 185, 129, 0.9); /* Stronger glow on hover */
        }

        /* Loader Spinner Style */
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #fff;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .shadow-3xl {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

// Helper component for structured feature cards
const FeatureCard = ({ icon, title, description, color }) => (
  <div className="p-4 bg-gray-700 rounded-xl transition-transform transform hover:scale-105 hover:bg-gray-600 border border-gray-600">
    <div className={`text-4xl mb-3 ${color} flex justify-center`}>{icon}</div>
    <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);
