import { useEffect, useState } from "react"; // useState যোগ করা হয়েছে
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUser,
  deleteUser,
} from "../../redux/slices/adminSlice";
import { toast } from "react-toastify";

export default function UserManagement() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleVerify = (id, verify) => {
    dispatch(updateUser({ userId: id, data: { isVerified: verify } }))
      .unwrap()
      .then(() =>
        toast.success(`User ${verify ? "verified" : "unverified"} successfully`)
      )
      .catch(() => toast.error("Failed to update verification"));
  };

  const handleRole = (id, role) => {
    dispatch(updateUser({ userId: id, data: { role } }))
      .unwrap()
      .then(() => toast.success("Role updated successfully"))
      .catch(() => toast.error("Failed to update role"));
  };

  // 🔒 নতুন পাসওয়ার্ড আপডেট ফাংশন
  const handlePasswordUpdate = (id) => {
    const newPassword = window.prompt("Enter the new password for this user:");

    if (newPassword && newPassword.trim() !== "") {
      // কমপক্ষে 6 অক্ষরের পাসওয়ার্ড নিশ্চিত করুন
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }

      // updateUser thunk ব্যবহার করে পাসওয়ার্ড আপডেট করা হচ্ছে
      // মনে রাখবেন, আপনার Redux slice এবং backend-এ 'password' ফিল্ড হ্যান্ডেল করার জন্য
      // যুক্তি থাকতে হবে।
      dispatch(updateUser({ userId: id, data: { password: newPassword } }))
        .unwrap()
        .then(() => toast.success("Password updated successfully"))
        .catch(() => toast.error("Failed to update password"));
    } else if (newPassword === null) {
      // ব্যবহারকারী বাতিল (Cancel) ক্লিক করলে কিছু হবে না
    } else {
      toast.error("Password cannot be empty.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => toast.success("User deleted successfully"))
        .catch(() => toast.error("Failed to delete user"));
    }
  };

  if (loading)
    return <p className="text-center text-blue-600">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">👥 User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Verified</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="border p-3 font-medium">{u.name}</td>
                  <td className="border p-3">{u.email}</td>
                  <td className="border p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRole(u._id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                      <option value="kosadhokko">Kosadhokko</option>
                    </select>
                  </td>
                  <td className="border p-3">
                    {u.isVerified ? (
                      <span className="text-green-600 font-semibold">
                        ✔ Yes
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">✘ No</span>
                    )}
                  </td>
                  <td className="border p-3 flex flex-wrap gap-2">
                    {/* পাসওয়ার্ড আপডেট বাটন */}
                    <button
                      onClick={() => handlePasswordUpdate(u._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      🔒 Pass
                    </button>
                    {!u.isVerified ? (
                      <button
                        onClick={() => handleVerify(u._id, true)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Verify
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(u._id, false)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Unverify
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(u._id)}
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
