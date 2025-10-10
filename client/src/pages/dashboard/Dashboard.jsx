import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Section */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        } flex-1`}
      >
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Outlet Area */}
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
