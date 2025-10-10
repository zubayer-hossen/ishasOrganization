import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import BannerSlider from "../components/common/BannerSlider";
import NoticeBoard from "../components/common/NoticeBoard";
import Headlines from "../components/common/Headlines";
import BlogCards from "../components/common/BlogCards";

export default function Home() {
  const bannerImages = [
    "https://imgs.search.brave.com/Q0V_CGAHwwJ1T2blOjvxO90TFCe2Aj8rdoR7jzD5kv8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi93aWxk/LWZsb3dlcnMtcGxh/bnQtc3VtbWVyLWF1/dHVtbi1uYXR1cmUt/YmFja2dyb3VuZC1i/YW5uZXItd2Vic2l0/ZS01NTk3Njk3MS5q/cGc",
    "https://imgs.search.brave.com/zt1FvDRwFaMUTu7flO2JToSM-r31lG0FHPRfEAuhhD8/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMi8x/MS8xNC8yMC8yNS9i/YW5uZXItNzU5MjQ4/Ml82NDAuanBn",
    "https://imgs.search.brave.com/X6NkFk_zaxWwUzTIm4V1iPMz1T5u4OSfNDJxEQOZ0Pw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9zcHJp/bmctc3VtbWVyLWJh/Y2tncm91bmQtZ3Jl/ZW4tdHJlZS1zdW5s/aWdodC1zdW4tcmF5/cy1wYW5vcmFtYS00/ODE5MDQxNC5qcGc",
  ];

  const headlines = [
    "Welcome to ISHAS",
    "Annual Donation Campaign Started",
    "Volunteer Recruitment Open",
  ];

  return (
    <div>
      <Navbar />

      {/* 👇 Navbar fixed হওয়ায় extra padding-top দিলাম */}
      <div className="pt-24 container mx-auto px-6 py-6">
        <BannerSlider images={bannerImages} />
        <Headlines headlines={headlines} />
        <NoticeBoard />
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
          <BlogCards />
        </section>
      </div>

      <Footer />
    </div>
  );
}
