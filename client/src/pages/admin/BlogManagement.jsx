import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/slices/blogSlice";
// ✅ সঠিক Axios Instance import করুন
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function BlogManagement() {
  const dispatch = useDispatch();
  // ধরে নেওয়া হচ্ছে 'blog' slice এ blogs, loading, error আছে
  const { blogs, loading, error } = useSelector((state) => state.blog);

  const [form, setForm] = useState({
    title: "",
    body: "",
    image: "",
  });

  // ℹ️ এই state টি Update Modal বা Form হ্যান্ডেল করার জন্য ব্যবহার করা যেতে পারে,
  // তবে সহজ রাখার জন্য এখানে শুধু Add ও Delete দেখানো হলো।
  // const [isEditing, setIsEditing] = useState(false);
  // const [currentBlog, setCurrentBlog] = useState(null);

  useEffect(() => {
    // ব্লগ লোড করতে হবে একবার
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD BLOG FUNCTION =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ এখানে আলাদা করে Headers বা Token সেট করার প্রয়োজন নেই,
      // কারণ axiosInstance.js-এ Interceptor স্বয়ংক্রিয়ভাবে তা হ্যান্ডেল করবে।
      const res = await axios.post("/blogs", form);

      // সার্ভার রেসপন্স 201 হলে
      toast.success("Blog added successfully! 🥳");
      setForm({ title: "", body: "", image: "" });
      dispatch(fetchBlogs()); // নতুন ব্লগ সহ তালিকা আপডেট করুন
    } catch (err) {
      console.error("Create Blog Error:", err);
      // 'unauthorized no token' error হলেও Interceptor সেটাকে Refresh Token দিয়ে
      // handle করার চেষ্টা করবে। যদি ব্যর্থ হয়, তবে লগআউট হবে বা error দেবে।
      toast.error(
        err.response?.data?.msg || "Failed to add blog. Check credentials/role."
      );
    }
  };

  // ================= DELETE BLOG FUNCTION =================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        // ✅ এখানেও Headers বা Token সেট করার প্রয়োজন নেই।
        await axios.delete(`/blogs/${id}`);

        toast.success("Blog deleted successfully! 🗑️");
        dispatch(fetchBlogs()); // তালিকা আপডেট করুন
      } catch (err) {
        console.error("Delete Blog Error:", err);
        toast.error(
          err.response?.data?.msg || "Failed to delete blog. Check permissions."
        );
      }
    }
  };

  if (loading)
    return <p className="text-center text-blue-600 mt-4">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">
        📝 Blog Management
      </h2>

      {/* Add Blog Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="title" // name prop যোগ করা হয়েছে
          placeholder="Title"
          value={form.title}
          onChange={handleChange} // handleChange ব্যবহার করা হয়েছে
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="body" // name prop যোগ করা হয়েছে
          placeholder="Body"
          value={form.body}
          onChange={handleChange} // handleChange ব্যবহার করা হয়েছে
          className="border p-2 rounded w-full"
          rows={4}
        />
        <input
          type="text"
          name="image" // name prop যোগ করা হয়েছে
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange} // handleChange ব্যবহার করা হয়েছে
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Blog
        </button>
      </form>

      {/* Blog Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded-lg shadow-lg">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Body
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Published
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((b, idx) => (
              <tr
                key={b._id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {b.title}
                </td>
                <td className="px-6 py-4 text-gray-700 line-clamp-2">
                  {b.body}
                </td>
                <td className="px-6 py-4">
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(b.publishedAt).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 space-x-2">
                  {/* আপনি এখানে একটি Edit Button যোগ করতে পারেন */}
                  {/* <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
