import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/slices/blogSlice";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function BlogManagement() {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blog);

  // 📝 ব্লগ যোগ বা সম্পাদনার জন্য স্টেট
  const [form, setForm] = useState({
    title: "",
    body: "",
    image: "",
  });

  // 🔄 এডিটিং স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD / UPDATE BLOG FUNCTION =================
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // নির্ধারণ করুন এটি যোগ (ADD) নাকি সম্পাদনা (UPDATE)
    const url = isEditing ? `/blogs/${currentBlogId}` : "/blogs";
    const method = isEditing ? axios.put : axios.post;
    const actionText = isEditing ? "updated" : "added";

    try {
      await method(url, form);

      toast.success(`Blog ${actionText} successfully! 🎉`);

      // স্টেট রিসেট করুন
      setForm({ title: "", body: "", image: "" });
      setIsEditing(false);
      setCurrentBlogId(null);

      dispatch(fetchBlogs()); // তালিকা আপডেট করুন
    } catch (err) {
      console.error(`${actionText} Blog Error:`, err);
      toast.error(
        err.response?.data?.msg ||
          `Failed to ${actionText} blog. Check permissions.`
      );
    }
  };

  // ================= SET EDIT MODE FUNCTION =================
  const handleEdit = (blog) => {
    setCurrentBlogId(blog._id);
    setForm({
      title: blog.title,
      body: blog.body,
      image: blog.image,
    });
    setIsEditing(true);
    // ফর্ম এর দিকে স্ক্রল করার জন্য
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= CANCEL EDIT FUNCTION =================
  const handleCancelEdit = () => {
    setForm({ title: "", body: "", image: "" });
    setIsEditing(false);
    setCurrentBlogId(null);
  };

  // ================= DELETE BLOG FUNCTION =================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
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

      {/* Add/Edit Blog Form */}
      <form
        onSubmit={handleEditSubmit}
        className="mb-10 p-6 border rounded-xl shadow-lg bg-white space-y-4"
      >
        <h3 className="text-xl font-bold text-indigo-600 border-b pb-2 mb-4">
          {isEditing
            ? `✏️ Editing: ${form.title.substring(0, 30)}...`
            : "➕ Add New Blog"}
        </h3>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <textarea
          name="body"
          placeholder="Body (Use <b>, <p>, etc. tags for formatting)" // HTML ট্যাগ ব্যবহারের নির্দেশনা
          value={form.body}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
          rows={6}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
        />

        <div className="flex space-x-3">
          <button
            type="submit"
            className={`px-4 py-2 rounded font-semibold text-white transition-colors ${
              isEditing
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isEditing ? "Save Changes" : "Add Blog"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
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
                Body (Excerpt)
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
                <td className="px-6 py-4 font-semibold text-gray-800 line-clamp-2">
                  {b.title}
                </td>
                <td className="px-6 py-4 text-gray-700 line-clamp-2">
                  {/* এডমিন টেবিলে সাধারণত ট্যাগ ছাড়া টেক্সট দেখানো হয় */}
                  {b.body
                    ? b.body.replace(/<[^>]+>/g, "").substring(0, 50) + "..."
                    : "No content"}
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
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-sm">
                  {new Date(b.publishedAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(b)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
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
