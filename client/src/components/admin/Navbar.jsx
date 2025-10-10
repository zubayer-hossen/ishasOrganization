// src/components/admin/Navbar.jsx
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex justify-between items-center bg-gray-100 p-4 shadow">
      <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
      <button
        onClick={() => dispatch(logout())}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
