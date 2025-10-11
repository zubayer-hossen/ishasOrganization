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
    "আমাদের সংগঠন 'ইশাস' জাতীয় শান্তি সম্মেলনে সম্মাননা পেলো",
  ];

  // --- ভিডিও ডেটা স্ট্রাকচার (আপনার দেওয়া তথ্য অনুযায়ী) ---
  const videos = [
    {
      id: "RRQuhdJfYnk", // বৃক্ষরোপণ ভিডিও (ফিচারড)
      title: "🌳 বৃক্ষরোপণ কর্মসূচি: সবুজ ভবিষ্যতের পথে",
      description:
        "আমাদের পরিবেশ সচেতনতামূলক কর্মসূচির সবচেয়ে উজ্জ্বল মুহূর্ত। দেখুন কীভাবে আমরা সবুজ ভবিষ্যতের পথে এগিয়ে চলেছি।",
      isFeatured: true,
    },
    {
      id: "Om2JtON7JaI", // পুরাতন মিডিয়া ভিডিও (আর্কাইভ)
      title: "📰 আমাদের অতীত গৌরব ও মিডিয়া কভারেজ",
      description:
        "সংগঠনের দীর্ঘ পথচলার এক ঝলক। পুরনো দিনের মিডিয়া কাভারেজ দেখুন এবং আমাদের ঐতিহ্য সম্পর্কে জানুন।",
      isFeatured: false,
    },
  ];

  const featuredVideo = videos.find((video) => video.isFeatured);
  const otherVideos = videos.filter((video) => !video.isFeatured);

  // ইউটিউব এমবেড URL তৈরি (নিয়ন্ত্রিত প্লেব্যাক)
  const getEmbedUrl = (videoId) =>
    `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0&autoplay=0&mute=0`;

  return (
    // সম্পূর্ণ পেজের জন্য ফ্যাকাশে সাদা ব্যাকগ্রাউন্ড
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Navbar fixed হওয়ায় অতিরিক্ত padding-top */}
      <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- ব্যানার স্লাইডার: ফ্ল্যাট শ্যাডো ও রাউন্ডেড লুক --- */}
        <section className="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/30 transform hover:scale-[1.005] transition-transform duration-500">
          <BannerSlider images={bannerImages} />
        </section>

        {/* -------------------- হাইলাইট: ফিচারড ভিডিও সেকশন -------------------- */}
        {featuredVideo && (
          <section className="my-16 py-12 bg-teal-50 rounded-3xl border-4 border-dashed border-teal-200 shadow-xl shadow-teal-500/20">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase text-teal-600">
                বিশেষ মিডিয়া কাভারেজ
              </span>
              <h2 className="text-5xl font-black text-gray-900 mt-2 mb-3 tracking-tighter">
                {/* হেডিং ডিজাইন: গ্লোয়িং ইফেক্ট */}✨ আমাদের গুরুত্বপূর্ণ
                প্রতিবেদন দেখুন
              </h2>
              <p className="text-xl text-gray-700 font-medium">
                সর্বশেষ এবং হাইলাইট করা কার্যক্রমের বিস্তারিত।
              </p>
            </div>

            <div className="max-w-5xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-center">
                {/* ভিডিও কনটেইনার: প্রিমিয়াম লুক */}
                <div className="p-3 bg-white rounded-3xl shadow-[0_40px_80px_rgba(20,_184,_166,_0.4)] transform hover:scale-[1.005] transition-all duration-700 ease-out">
                  <div className="relative overflow-hidden pt-[56.25%] rounded-2xl ring-8 ring-teal-600/50">
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
                {/* ভিডিওর নিচে আকর্ষণীয় বর্ণনা */}
                <div className="text-center mt-6 p-6 bg-teal-100 rounded-xl border border-teal-300">
                  <h3 className="text-2xl font-bold text-teal-800">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-md text-gray-700 mt-2">
                    {featuredVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* -------------------- ফিচারড ভিডিও সেকশন শেষ -------------------- */}

        {/* --- মূল কন্টেন্ট গ্রিড: হেডলাইন, নোটিশ এবং ব্লগ --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
          {/* 👇 বাম কলাম (হেডলাইন ও নোটিশ বোর্ড) */}
          <div className="lg:col-span-1 space-y-8">
            {/* হেডলাইন সেকশন: অ্যাম্বার/গোল্ডেন থিম */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-amber-500 transform hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-2xl font-extrabold mb-4 text-amber-700 border-b pb-2 flex items-center">
                🚨 তাৎক্ষণিক খবর
              </h3>
              <Headlines headlines={headlines} />
            </div>

            {/* নোটিশ বোর্ড সেকশন: অ্যাম্বার/গোল্ডেন থিম */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-amber-600 transform hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-2xl font-extrabold mb-4 text-amber-700 border-b pb-2 flex items-center">
                🔔 গুরুত্বপূর্ণ বিজ্ঞপ্তি
              </h3>
              <NoticeBoard />
            </div>
          </div>

          {/* 👇 ডান কলাম (লেটেস্ট ব্লগ) */}
          <div className="lg:col-span-2">
            <section className="bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-teal-500 transform hover:scale-[1.005] transition-transform duration-300">
              <h2 className="text-3xl font-extrabold mb-6 text-teal-800 border-b-2 border-gray-200 pb-3 flex items-center">
                📚 সাম্প্রতিক ব্লগ পোস্ট ও নিবন্ধ
              </h2>
              <BlogCards />
            </section>
          </div>
        </div>

        {/* -------------------- অন্যান্য ভিডিও সেকশন (আর্কাইভ মিডিয়া) -------------------- */}
        {otherVideos.length > 0 && (
          <section className="my-16 py-10 bg-gray-900 rounded-3xl shadow-2xl border-b-8 border-amber-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tighter">
                📺 আর্কাইভ মিডিয়া গ্যালারি
              </h2>
              <p className="text-lg text-gray-300 font-medium">
                আমাদের অতীতের অর্জনগুলো দেখুন।
              </p>
            </div>

            <div className="max-w-4xl mx-auto px-4">
              {otherVideos.map((video) => (
                <div key={video.id} className="mb-12 last:mb-0">
                  <div className="p-2 bg-gray-800 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform hover:scale-[1.01] transition-all duration-700 ease-out">
                    <div className="relative overflow-hidden pt-[56.25%] rounded-xl ring-4 ring-amber-500/50">
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
                  </div>
                  <div className="text-center mt-6 p-4 bg-gray-800 rounded-xl border border-amber-500/50">
                    <h3 className="text-2xl font-bold text-amber-400">
                      {video.title}
                    </h3>
                    <p className="text-md text-gray-400 mt-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* -------------------- অন্যান্য ভিডিও সেকশন শেষ -------------------- */}
      </div>

      <Footer />
    </div>
  );
}
