// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Phone,
  DollarSign,
  Info,
  Loader,
  Edit,
  Save,
  X,
} from "lucide-react";

import api from "../../api.js";

// Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Loader className="animate-spin text-5xl text-indigo-600" />
  </div>
);

// Input component (read-only by default, editable only for Bio)
const Input = ({ label, name, value, onChange, editable }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600 mb-1 block">
      {label}
    </label>
    {editable ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
      />
    ) : (
      <p className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 shadow-sm">
        {value || "N/A"}
      </p>
    )}
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser) {
      setUser(localUser);
      setFormData(localUser);
      setLoading(false);
    } else fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/me");
      setUser(data);
      setFormData(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  // Handle Bio change
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Only update Bio
  const handleUpdate = async () => {
    const loadingToast = toast.loading("Updating Bio...");
    try {
      const { data } = await api.put("/users/me", { bio: formData.bio });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setIsEditing(false);
      toast.success("Bio updated successfully!", { id: loadingToast });
    } catch (err) {
      toast.error("Update failed", { id: loadingToast });
    }
  };

  if (loading) return <Spinner />;
  if (!user)
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        User not found. Please log in again.
      </div>
    );

  const roleColor =
    {
      owner: "bg-gradient-to-r from-red-500 to-pink-500",
      admin: "bg-gradient-to-r from-indigo-500 to-blue-500",
      member: "bg-gradient-to-r from-green-400 to-emerald-600",
      committee: "bg-gradient-to-r from-blue-400 to-indigo-600",
      treasurer: "bg-gradient-to-r from-yellow-400 to-orange-500",
      kosadhokko: "bg-gradient-to-r from-orange-400 to-red-500",
    }[user.role] || "bg-gradient-to-r from-gray-400 to-gray-600";

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-red-100 py-10 px-4 font-inter">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* HEADER */}
          <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80">
            {/* Banner */}
            <img
              src="https://i.ibb.co.com/Lz2PFvXz/472336431-122098466192716914-7147800908504199836-n.png" // Replace with your banner URL
              alt="Organization Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Avatar */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 sm:-bottom-20">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User"
                  )}&size=200&background=random&bold=true`
                }
                alt="Avatar"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-2xl object-cover"
              />
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 pb-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                {user.name}
              </h1>
              <p className="text-gray-500">{user.email}</p>
              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider text-white shadow-lg ${roleColor}`}
              >
                {user.role}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center sm:justify-end mb-6 gap-3 flex-wrap">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  <Edit size={16} /> Edit Bio
                </button>
              ) : (
                <>
                  <button
                    onClick={handleUpdate}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(user);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                  >
                    <X size={16} /> Cancel
                  </button>
                </>
              )}
            </div>

            {/* SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-indigo-700 mb-4">
                  <User size={18} /> Basic Info
                </h3>
                <div className="space-y-3">
                  <Input label="Full Name" value={user.name} />
                  <Input label="Father's Name" value={user.fatherName || "-"} />
                  <Input label="NID Number" value={user.nid || "-"} />
                  <Input label="Occupation" value={user.occupation || "-"} />
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-blue-700 mb-4">
                  <Phone size={18} /> Contact Info
                </h3>
                <div className="space-y-3">
                  <Input label="Email" value={user.email} />
                  <Input label="Phone Number" value={user.phone || "-"} />
                  <Input label="Address" value={user.address || "-"} />
                </div>
              </div>

              {/* Financial Info */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-100 shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-green-700 mb-4">
                  <DollarSign size={18} /> Financial Info
                </h3>
                <div className="space-y-3">
                  <Input
                    label="Monthly Chadar (৳)"
                    value={user.chadarPoriman}
                  />
                  <Input label="Total Due (৳)" value={user.due} />
                  <Input label="Upcoming Due" value={user.upcomingDue} />
                  <Input
                    label="Paid Months"
                    value={user.paidMonths?.join(", ") || "-"}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-pink-50 rounded-xl p-5 border border-pink-100 shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-pink-700 mb-4">
                  <Info size={18} /> Additional Info
                </h3>
                <div className="space-y-3">
                  <Input
                    label="Verified"
                    value={user.isVerified ? "Yes ✅" : "No ❌"}
                  />
                  <Input
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    editable={isEditing}
                  />
                  <Input
                    label="Joined On"
                    value={new Date(user.createdAt).toLocaleDateString()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
