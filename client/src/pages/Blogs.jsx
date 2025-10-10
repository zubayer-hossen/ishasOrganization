import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/slices/blogSlice";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function Blogs() {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading)
    return <p className="text-center text-blue-600 mt-10">Loading blogs...</p>;

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 mt-15">All Blogs</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {blogs.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No blogs found.
            </p>
          )}

          {blogs.map((blog) => (
            <Link
              to={`/blogs/${blog._id}`} // future BlogDetails page
              key={blog._id}
              className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={blog.image || "/images/default-blog.jpg"}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="font-bold text-lg mb-2">{blog.title}</h2>
                <p className="text-gray-700 text-sm mb-2">
                  {blog.body ? blog.body.slice(0, 100) + "..." : "No content"}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>{blog.author?.name || "Unknown Author"}</span>
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
