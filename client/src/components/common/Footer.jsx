// src/components/common/Footer.jsx

import { FaFacebookF } from "react-icons/fa"; // ফেসবুুক আইকন ব্যবহারের জন্য এটি ইনস্টল করে নিতে হবে

export default function Footer() {
  // ফেসবুক পেজের URL এখানে দিন
  const facebookUrl = "https://www.facebook.com/ishasOrganization";
  const currentYear = new Date().getFullYear();

  return (
    // গর্জিয়াস ব্যাকগ্রাউন্ড ও শ্যাডো
    <footer className="bg-gray-900 text-white mt-16 shadow-2xl">
      <div className="container mx-auto px-4 py-10">
        {/* --- প্রধান কন্টেন্ট গ্রিড (৩ কলাম) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-indigo-700 pb-8">
          {/* ১. সংস্থা পরিচিতি */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-indigo-400 mb-3 tracking-wider">
              ISHAS
            </h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto md:mx-0">
              সবুজ ভবিষ্যতের পথে মানবতার অঙ্গীকার নিয়ে আমরা কাজ করে চলেছি।
              আমাদের সাথে যুক্ত থাকুন।
            </p>
          </div>

          {/* ২. যোগাযোগ ও লিঙ্ক */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-indigo-300 border-b border-indigo-600 inline-block pb-1">
              যোগাযোগ
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-medium text-indigo-200">ইমেইল:</span>{" "}
                info@ishas.org
              </p>
              <p>
                <span className="font-medium text-indigo-200">ফোন:</span>{" "}
                +880123456789
              </p>
              <p>
                <span className="font-medium text-indigo-200">ঠিকানা:</span>{" "}
                ঢাকা, বাংলাদেশ
              </p>
            </div>
          </div>

          {/* ৩. সোশ্যাল মিডিয়া */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4 text-indigo-300 border-b border-indigo-600 inline-block pb-1">
              আমাদের সাথে যুক্ত হন
            </h3>

            {/* ফেসবুক আইকন: কালারফুল ও ইন্টারেক্টিভ */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors duration-300 shadow-lg transform hover:scale-110"
              title="আমাদের ফেসবুক পেজ"
            >
              <FaFacebookF className="w-6 h-6 text-white" />
            </a>
            <p className="text-sm text-gray-400 mt-2">
              ফেসবুকে আমাদের অনুসরণ করুন
            </p>
          </div>
        </div>

        {/* --- কপিরাইট এবং ডেভেলপমেন্ট ক্রেডিট --- */}
        <div className="mt-8 pt-4 text-center space-y-3">
          {/* কপিরাইট */}
          <p className="text-sm text-gray-400 font-medium">
            &copy; {currentYear} **ISHAS**. সর্বস্বত্ব সংরক্ষিত।
          </p>

          {/* ডিজাইন ও ডেভেলপমেন্ট ক্রেডিট: আকর্ষণীয় ফন্ট ও কালার */}
          <p className="text-xs text-gray-500">
            Design & Developed by
            <span className="text-indigo-400 font-extrabold tracking-wider ml-1 hover:text-indigo-300 transition-colors duration-300 cursor-pointer">
              Zubayer Hossen
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
