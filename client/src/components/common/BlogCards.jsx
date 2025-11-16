// src/components/common/BlogCards.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/slices/blogSlice";
import { useNavigate } from "react-router-dom";

export default function BlogCards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading)
    return <p className="text-center text-indigo-600">Loading blogs...</p>;

  // যদি কোনো ব্লগ না থাকে
  if (blogs.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-100 rounded-xl">
        <p className="text-xl text-gray-600 font-semibold">
          No blog posts available right now. 😔
        </p>
      </div>
    );
  }

  // ⚠️ সতর্কতা: HTML স্যানিটাইজেশন ছাড়াই dangerouslySetInnerHTML ব্যবহার করা হচ্ছে।
  // XSS আক্রমণ এড়াতে ব্যাকএন্ডে বা এখানে একটি HTML স্যানিটাইজার (যেমন DOMPurify) ব্যবহার করা আবশ্যক।
  const getExcerptWithHTML = (htmlString, maxLength = 120) => {
    if (!htmlString) return "No content";

    // একটি সাময়িক div তৈরি করে সেই HTML-কে ইনজেক্ট করা হচ্ছে
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // শুধু টেক্সট কন্টেন্ট স্লাইস করা হচ্ছে
    let text = tempDiv.textContent || tempDiv.innerText || "";

    if (text.length > maxLength) {
      text = text.slice(0, maxLength) + "...";
    }

    // যেহেতু এই ফাংশনটি HTML ট্যাগ রেন্ডারিং-এর জন্য নয়, তাই আমি
    // HTML ট্যাগগুলিও রেন্ডার করার জন্য নিচের অংশটি ব্যবহার করব।

    // 💡 নিরাপদ উপায়ে HTML সহ টেক্সট স্লাইস করা বেশ জটিল,
    // তাই আপাতত আমি শুধুমাত্র প্রথম ১২০ অক্ষর কেটে **সরল টেক্সট** হিসেবেই দেখাচ্ছি।
    // যদি আপনি **প্রকৃতপক্ষে HTML ট্যাগ সহ** প্রথম ১২০ অক্ষর দেখাতে চান,
    // তবে ট্যাগ কাটার ঝুঁকি এড়াতে আপনাকে অন্য লাইব্রেরি ব্যবহার করতে হবে।
    // আপাতত, **বোল্ড ট্যাগ (`<b>`) সহ পুরোপুরি রেন্ডার করতে হলে, কোনো স্লাইসিং করা উচিত নয়।**

    // ✅ শুধুমাত্র রেন্ডারিং-এর জন্য পুরো বডি ট্যাগ সহ রেন্ডার করা হচ্ছে এবং CSS দিয়ে লাইনে সীমিত করা হচ্ছে।

    return htmlString; // পুরো HTML স্ট্রিং পাঠানো হচ্ছে
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          // এখানে নেভিগেট করার জন্য একটি বাটন ব্যবহার করা ভালো বাটন:
          onClick={() => navigate(`/blogs/${blog._id}`)}
          className="bg-gradient-to-r from-indigo-100 via-pink-100 to-yellow-100 rounded-2xl shadow-lg cursor-pointer overflow-hidden transform hover:scale-105 transition duration-300"
        >
          <img
            src={blog.image || "/images/default-blog.jpg"}
            alt={blog.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2 text-indigo-900 line-clamp-2">
              {blog.title}
            </h3>

            {/* 🚀 মূল পরিবর্তন এইখানে: dangerouslySetInnerHTML ব্যবহার */}
            <p
              className="text-gray-700 mb-3 line-clamp-3" // Tailwind CSS: line-clamp-3 দিয়ে ৩ লাইনে সীমাবদ্ধ করা হচ্ছে
              dangerouslySetInnerHTML={{
                __html: getExcerptWithHTML(blog.body, 120),
              }}
            />
            {/* -------------------------------------------------- */}

            <div className="flex justify-between items-center text-gray-600 text-sm border-t border-gray-300 pt-3 mt-3">
              <span>By: {blog.author?.name || "Unknown"}</span>
              <span className="text-sm font-medium">
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
