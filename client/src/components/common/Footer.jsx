// src/components/common/Footer.jsx

// --- Heroicons এবং React Icons ইমপোর্ট ---
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"; // ✅ Link ব্যবহারের জন্য (ধরে নেওয়া হলো react-router-dom ব্যবহার হচ্ছে)

export default function Footer() {
  // ফেসবুক পেজের URL এখানে দিন
  const facebookUrl = "https://www.facebook.com/ishasOrganization";
  const twitterUrl = "#";
  const linkedinUrl = "#";
  const currentYear = new Date().getFullYear();

  // --- Common Style Classes ---
  const headingStyle =
    "text-xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-300 border-b border-indigo-700 pb-2 inline-block";
  const linkStyle =
    "text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm";
  const iconBg =
    "w-10 h-10 flex items-center justify-center rounded-full bg-indigo-700/50 hover:bg-teal-500 transition-all duration-500 transform hover:scale-110";

  return (
    // গর্জিয়াস Gradient ব্যাকগ্রাউন্ড, উচু শ্যাডো
    <footer className="bg-gray-900 shadow-2xl mt-20 relative overflow-hidden">
      {/* Aesthetic Design Element (Optional: for extra flair) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* --- প্রধান কন্টেন্ট গ্রিড (৪ কলাম) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-indigo-800 pb-12">
          {/* ১. সংস্থা পরিচিতি (Brand & Mission) */}
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-black text-indigo-400 mb-4 tracking-widest leading-none">
              ISHAS
            </h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto md:mx-0 leading-relaxed">
              সবুজ ভবিষ্যতের পথে মানবতার অঙ্গীকার নিয়ে আমরা কাজ করে চলেছি। একটি
              উজ্জ্বল, সহানুভূতিশীল সমাজ গড়ার লক্ষ্যে আমাদের যাত্রা।
            </p>
            {/* CTA Button */}
            <Link
              to="/donate"
              className="mt-6 inline-block px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:from-teal-400 hover:to-indigo-400"
            >
              এখনই অনুদান দিন!
            </Link>
          </div>

          {/* ২. গুরুত্বপূর্ণ লিঙ্ক (Quick Links) */}
          <div className="text-center md:text-left">
            <h3 className={headingStyle}>গুরুত্বপূর্ণ লিঙ্ক</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className={linkStyle}>
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link to="/blogs" className={linkStyle}>
                  ব্লগ ও খবর
                </Link>
              </li>
              <li>
                <Link to="/notices" className={linkStyle}>
                  নোটিশ বোর্ড
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={linkStyle}>
                  সদস্য ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link to="/contact" className={linkStyle}>
                  যোগাযোগ ফর্ম
                </Link>
              </li>
            </ul>
          </div>

          {/* ৩. যোগাযোগ তথ্য (Contact Info) */}
          <div className="text-center md:text-left">
            <h3 className={headingStyle}>যোগাযোগ করুন</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center justify-center md:justify-start">
                <EnvelopeIcon className="w-5 h-5 text-teal-400 mr-3" />
                <span className="text-sm">info@ishas.org</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <PhoneIcon className="w-5 h-5 text-teal-400 mr-3" />
                <span className="text-sm">+880123456789 (হেল্পলাইন)</span>
              </div>
              <div className="flex items-start justify-center md:justify-start">
                <MapPinIcon className="w-5 h-5 text-teal-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-sm text-left">
                  প্রধান কার্যালয়: ঢাকা, বাংলাদেশ
                </span>
              </div>
            </div>
          </div>

          {/* ৪. সোশ্যাল মিডিয়া (Social Media) */}
          <div className="text-center md:text-left">
            <h3 className={headingStyle}>সাথে যুক্ত হন</h3>
            <p className="text-sm text-gray-400 mb-4">
              সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করে সমাজের পরিবর্তনে অংশ নিন।
            </p>

            <div className="flex justify-center md:justify-start space-x-4">
              {/* ফেসবুক */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={iconBg}
                title="Facebook"
              >
                <FaFacebookF className="w-5 h-5 text-white" />
              </a>
              {/* Twitter/X */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={iconBg}
                title="Twitter"
              >
                <FaTwitter className="w-5 h-5 text-white" />
              </a>
              {/* LinkedIn */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={iconBg}
                title="LinkedIn"
              >
                <FaLinkedinIn className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* --- কপিরাইট এবং ডেভেলপমেন্ট ক্রেডিট --- */}
        <div className="mt-10 pt-4 text-center space-y-3">
          {/* কপিরাইট */}
          <p className="text-sm text-gray-500">
            &copy; {currentYear}
            <span className="text-indigo-400 font-bold mx-1">ISHAS</span>.
            সর্বস্বত্ব সংরক্ষিত।
          </p>

          {/* ডিজাইন ও ডেভেলপমেন্ট ক্রেডিট: ফ্যান্সি ইফেক্ট */}
          <p className="text-xs text-gray-600">
            Engineered with ❤️ by
            <span
              className="text-teal-400 font-extrabold tracking-wide ml-1 cursor-pointer 
                             hover:text-teal-300 transition-colors duration-300 
                             relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] 
                             after:bg-teal-500 after:transition-transform after:duration-500 after:scale-x-0 hover:after:scale-x-100"
            >
              Zubayer Hossen
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
