import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, User, Wallet, PlusCircle, ChevronRight } from "lucide-react";

export default function Sidebar({ collapsed }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div
      className={`bg-gradient-to-b from-indigo-600 to-purple-700 text-white h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/20">
        <div className="bg-white/20 p-2 rounded-full">
          <ChevronRight size={22} />
        </div>
        {!collapsed && (
          <h2 className="text-xl font-bold tracking-wide">My Dashboard</h2>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex flex-col mt-6 px-3 space-y-2">
        <SidebarLink
          to="/"
          icon={<Home size={20} />}
          label="Home"
          collapsed={collapsed}
        />
        <SidebarLink
          to="/dashboard/profile"
          icon={<User size={20} />}
          label="Profile"
          collapsed={collapsed}
        />
        <SidebarLink
          to="/dashboard/transactions"
          icon={<Wallet size={20} />}
          label="My Transactions"
          collapsed={collapsed}
        />
        {/* {user?.role !== "member" && (
          <SidebarLink
            to="/dashboard/transactions/add"
            icon={<PlusCircle size={20} />}
            label="Add Transaction"
            collapsed={collapsed}
          />
        )} */}
      </div>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-white/10 text-sm opacity-80 text-center">
        {!collapsed && <p>Logged in as {user?.role || "guest"}</p>}
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
          isActive
            ? "bg-white/20 shadow-inner"
            : "hover:bg-white/10 hover:shadow-md"
        }`
      }
    >
      {icon}
      {!collapsed && <span className="font-medium">{label}</span>}
    </NavLink>
  );
}
