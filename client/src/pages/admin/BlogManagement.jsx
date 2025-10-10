import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/slices/blogSlice";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export default function BlogManagement() {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blog);

  const [form, setForm] = useState({
    title: "",
    body: "",
    image: "",
  });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/blogs", form, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Blog added successfully");
      setForm({ title: "", body: "", image: "" });
      dispatch(fetchBlogs());
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add blog");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`/blogs/${id}`);
        toast.success("Blog deleted successfully");
        dispatch(fetchBlogs());
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to delete blog");
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
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          placeholder="Body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          className="border p-2 rounded w-full"
          rows={4}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
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
