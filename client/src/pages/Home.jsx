import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import BannerSlider from "../components/common/BannerSlider";
import NoticeBoard from "../components/common/NoticeBoard";
import Headlines from "../components/common/Headlines";
import BlogCards from "../components/common/BlogCards";

export default function Home() {
  const bannerImages = [
    "banner1.jpg",
    "banner2.jpg",
    "banner3.jpg",
    "banner4.jpg",
  ];

  const headlines = [
    "জুমার নামাজের পর “ইশাস”-এর বৃক্ষরোপণ কর্মসূচি সফলভাবে সম্পন্ন — সবুজ ভবিষ্যতের পথে মানবতার অঙ্গীকার",
  ];

  // 👇 আপনার ইউটিউব ভিডিও ID এখানে বসান
  const youtubeVideoId = "RRQuhdJfYnk";

  // ভিডিও প্লেব্যাক নিয়ন্ত্রণের জন্য উন্নত ইউআরএল
  // 'rel=0': প্লেয়ারের শেষে অন্য চ্যানেলের ভিডিও সাজেশন বন্ধ। (সিকিউরিটি)
  // 'modestbranding=1': ইউটিউব লোগো ছোট রাখা। (সুন্দর লেআউট)
  // 'controls=1': প্লেয়ার কন্ট্রোল চালু রাখা। (নিয়ন্ত্রণ)
  // 'showinfo=0': ভিডিও টাইটেল বা আপলোডার দেখানো বন্ধ রাখা। (সুন্দর লেআউট)
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&controls=1&showinfo=0&autoplay=0&mute=0`;

  return (
    // সম্পূর্ণ পেজের জন্য হালকা গ্রে ব্যাকগ্রাউন্ড
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Navbar fixed হওয়ায় অতিরিক্ত padding-top */}
      <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 👇 ব্যানার স্লাইডার: প্রিমিয়াম লুক */}
        <section className="mb-10 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-indigo-200">
          <BannerSlider images={bannerImages} />
        </section>

        {/* -------------------- ভিডিও এমবেড সেকশন: নিয়ন্ত্রিত ও গর্জিয়াস ডিজাইন -------------------- */}
        <section className="my-12 py-10 bg-indigo-50 rounded-3xl shadow-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-indigo-300/50">
          <div className="text-center mb-10">
            {/* হেডিং ডিজাইন: ভাইব্র্যান্ট কালার এবং ডিস্টিংক্ট বর্ডার */}
            <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-3 tracking-tight border-b-4 border-indigo-400 inline-block pb-1">
              ⭐ মিডিয়ায় আমাদের সেরা ভিউ ⭐
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              সর্বশেষ গুরুত্বপূর্ণ প্রতিবেদন সরাসরি দেখুন।
            </p>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            {/* ভিডিও কনটেইনার: ডিপ ব্লু শ্যাডো ও অ্যানিমেশন */}
            <div className="p-2 bg-white rounded-2xl shadow-[0_30px_60px_rgba(49,_46,_129,_0.3)] transform hover:scale-[1.01] transition-all duration-700 ease-out">
              {/* রেসপনসিভ ভিডিও এমবেড (16:9 Aspect Ratio) */}
              <div className="relative overflow-hidden pt-[56.25%] rounded-xl ring-8 ring-indigo-600/50">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={embedUrl}
                  title="News Report on Amader Songothon"
                  // 'allow' এ সুনির্দিষ্ট ফিচারগুলো রাখা হলো
                  allow="accelerometer; gyroscope; picture-in-picture; web-share"
                  // অতিরিক্ত সিকিউরিটি ফিচার
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            {/* ভিডিওর নিচে আকর্ষণীয় বর্ণনা */}
            <div className="text-center mt-8 p-4 bg-indigo-100/50 rounded-xl border border-indigo-300">
              <h3 className="text-2xl font-bold text-indigo-800">
                বৃক্ষরোপণ কর্মসূচি: মানবতার অঙ্গীকার
              </h3>
              <p className="text-md text-gray-600 mt-2">
                এই ভিডিওটি আমাদের অন্যতম সফল সামাজিক উদ্যোগের দৃশ্য ধারণ করেছে।
                দেখুন, কীভাবে আমরা সবুজ ভবিষ্যতের পথে এগিয়ে চলেছি।
              </p>
            </div>
          </div>
        </section>
        {/* -------------------- ভিডিও এমবেড সেকশন শেষ -------------------- */}

        {/* 👇 মূল কন্টেন্ট গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* 👇 বাম কলাম (হেডলাইন ও নোটিশ বোর্ড) */}
          <div className="lg:col-span-1 space-y-8">
            {/* হেডলাইন সেকশন: কালারফুল বর্ডার ও শ্যাডো */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-red-500">
              <h3 className="text-xl font-bold mb-4 text-red-600 border-b pb-2">
                🔥 ব্রেকিং নিউজ
              </h3>
              <Headlines headlines={headlines} />
            </div>

            {/* নোটিশ বোর্ড সেকশন: কালারফুল বর্ডার ও শ্যাডো */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-yellow-600">
              <h3 className="text-xl font-bold mb-4 text-yellow-700 border-b pb-2">
                📣 গুরুত্বপূর্ণ নোটিশ
              </h3>
              <NoticeBoard />
            </div>
          </div>

          {/* 👇 ডান কলাম (লেটেস্ট ব্লগ) */}
          <div className="lg:col-span-2">
            <section className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-indigo-500">
              <h2 className="text-3xl font-extrabold mb-6 text-indigo-800 border-b-2 border-gray-200 pb-3">
                📖 সাম্প্রতিক ব্লগ পোস্ট ও নিবন্ধ
              </h2>
              <BlogCards />
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
