import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotices,
  addNotice,
  deleteNotice,
} from "../../redux/slices/adminSlice";
import { toast } from "react-toastify";

export default function NoticeManagement() {
  const dispatch = useDispatch();
  const { notices, loading, error } = useSelector((state) => state.admin);
  const [form, setForm] = useState({ title: "", content: "" });

  // Load all notices on component mount
  useEffect(() => {
    dispatch(fetchNotices())
      .unwrap()
      .catch(() => toast.error("Failed to fetch notices"));
  }, [dispatch]);

  // Add new notice
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error("All fields required");

    dispatch(addNotice(form))
      .unwrap()
      .then(() => {
        toast.success("Notice added successfully");
        setForm({ title: "", content: "" });
      })
      .catch(() => toast.error("Failed to add notice"));
  };

  // Delete notice
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    dispatch(deleteNotice(id))
      .unwrap()
      .then(() => toast.success("Notice deleted successfully"))
      .catch(() => toast.error("Failed to delete notice"));
  };

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📝 Notice / Blog Management</h2>

      {/* Add Notice Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border p-2 w-full rounded"
          rows={4}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Notice
        </button>
      </form>

      {/* Notices Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Content</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  No notices found.
                </td>
              </tr>
            ) : (
              notices.map((n) => (
                <tr key={n._id} className="hover:bg-gray-50">
                  <td className="border p-2 font-medium">{n.title}</td>
                  <td className="border p-2">{n.content}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
