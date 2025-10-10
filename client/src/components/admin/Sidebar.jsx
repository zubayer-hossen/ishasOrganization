// src/components/admin/Sidebar.jsx (Updated)
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <NavLink
        to="/"
        className={({ isActive }) =>
          `mb-3 px-3 py-2 rounded ${
            isActive ? "bg-gray-700" : "hover:bg-gray-700"
          }`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/admin/profile"
        className={({ isActive }) =>
          `mb-3 px-3 py-2 rounded ${
            isActive ? "bg-gray-700" : "hover:bg-gray-700"
          }`
        }
      >
        Profile
      </NavLink>

      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `mb-3 px-3 py-2 rounded ${
            isActive ? "bg-gray-700" : "hover:bg-gray-700"
          }`
        }
      >
        User Management
      </NavLink>

      <NavLink
        to="/admin/notices"
        className={({ isActive }) =>
          `mb-3 px-3 py-2 rounded ${
            isActive ? "bg-gray-700" : "hover:bg-gray-700"
          }`
        }
      >
        Notice Management
      </NavLink>

      <NavLink
        to="/admin/blogs"
        className={({ isActive }) =>
          `mb-3 px-3 py-2 rounded ${
            isActive ? "bg-gray-700" : "hover:bg-gray-700"
          }`
        }
      >
        Blog Management
      </NavLink>

      {/* 🟢 নতুন ফান্ড ম্যানেজমেন্ট লিঙ্ক */}
      <NavLink
        to="/admin/funds"
        className={({ isActive }) =>
          `mb-3 px-3 py-2 rounded ${
            isActive ? "bg-gray-700" : "hover:bg-gray-700"
          }`
        }
      >
        Fund Management {/* অথবা Transaction Management */}
      </NavLink>
    </div>
  );
}
