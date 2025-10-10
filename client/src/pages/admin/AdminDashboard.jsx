// src/pages/admin/AdminDashboard.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 bg-gray-100 flex-1 overflow-auto">
          <Outlet />{" "}
          {/* এখানে UserManagement বা NoticeManagement রেন্ডার হবে */}
        </div>
      </div>
    </div>
  );
}
