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

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          onClick={() => navigate(`/blogs/${blog._id}`)}
          className="bg-gradient-to-r from-indigo-100 via-pink-100 to-yellow-100 rounded-2xl shadow-lg cursor-pointer overflow-hidden transform hover:scale-105 transition duration-300"
        >
          <img
            src={blog.image || "/images/default-blog.jpg"}
            alt={blog.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2 text-indigo-900">
              {blog.title}
            </h3>
            <p className="text-gray-700 mb-3">
              {blog.body ? blog.body.slice(0, 120) + "..." : "No content"}
            </p>
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <span>By: {blog.author?.name || "Unknown"}</span>
              <span>
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
