import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { Menu } from "lucide-react";

export default function Navbar({ collapsed, setCollapsed }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md h-14">
      {/* Left: Toggle Button + Welcome */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-indigo-600 transition-all"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">
          Welcome, {user?.name || "User"}
        </h1>
      </div>

      {/* Right: Logout */}
      <button
        onClick={() => dispatch(logout())}
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
      >
        Logout
      </button>
    </div>
  );
}
