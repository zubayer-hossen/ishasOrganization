// src/pages/BlogDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// নিশ্চিত করুন যে আপনি সঠিক axiosInstance ব্যবহার করছেন
import axios from "../utils/axiosInstance"; // যদি axiosInstance.js ব্যবহার করেন

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setBlog(null); // ব্লগ না পেলে সেট করুন
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-xl font-semibold text-indigo-600">
        Loading blog details... ⏳
      </p>
    );
  if (!blog)
    return (
      <p className="text-center mt-10 text-xl font-bold text-red-600">
        Blog not found. 😟
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-2xl border-t-8 border-indigo-500">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-lg font-semibold text-blue-600 hover:text-blue-800 transition duration-200 flex items-center"
      >
        <span className="mr-2">←</span> Back to Blogs
      </button>

      {/* Blog Image */}
      <img
        src={blog.image || "/images/default-blog.jpg"}
        alt={blog.title}
        className="w-full max-h-96 object-cover rounded-lg mb-6 shadow-xl"
      />

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-4 text-indigo-900 leading-tight">
        {blog.title}
      </h1>

      {/* Metadata */}
      <div className="flex justify-between text-gray-600 mb-8 border-b pb-4">
        <span className="font-medium">
          By:{" "}
          <span className="text-indigo-600">
            {blog.author?.name || "Unknown"}
          </span>
        </span>
        <span className="text-sm">
          Published:{" "}
          {new Date(blog.publishedAt).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* 🚀 মূল পরিবর্তন: HTML Content Rendering */}
      <div
        className="text-gray-800 leading-relaxed text-lg blog-content space-y-4"
        // ⚠️ সতর্কতা: অ্যাডমিন ইনপুট স্যানিটাইজ করা আবশ্যক।
        dangerouslySetInnerHTML={{ __html: blog.body }}
      />
      {/* ----------------------------------------------- */}

      {/* অতিরিক্ত স্টাইলিং নোট: `blog-content` ক্লাসে আপনি গ্লোবাল CSS এ 
          h1, h2, p, ul ইত্যাদির জন্য স্টাইল যোগ করতে পারেন। */}
    </div>
  );
}
