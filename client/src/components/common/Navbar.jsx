// src/components/common/Navbar.jsx
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { logout } from "../../redux/slices/authSlice";
import { Menu, X, Sun, Moon, UserCircle } from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Dynamic time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 15) setGreeting("Good Noon");
    else if (hour >= 15 && hour < 18) setGreeting("Good Afternoon");
    else if (hour >= 18 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo & Desktop Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="font-extrabold text-2xl tracking-wide hover:scale-110 transition-transform duration-300"
          >
            ISHAS
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-5 font-medium text-white">
            <Link to="/" className="hover:text-yellow-300 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-yellow-300 transition">
              About
            </Link>
            <Link to="/notices" className="hover:text-yellow-300 transition">
              Notices
            </Link>
            <Link to="/blogs" className="hover:text-yellow-300 transition">
              Blogs
            </Link>
            {user && (
              <>
                {["admin", "owner", "kosadhokko"].includes(user.role) ? (
                  <Link
                    to="/admin"
                    className="hover:text-yellow-300 font-semibold transition"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="hover:text-yellow-300 font-semibold transition"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Desktop Greeting & User */}
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex flex-col items-end text-sm">
                <span className="text-yellow-200 font-semibold">
                  {greeting},
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition">
                  <UserCircle size={16} /> {user.name}
                </span>
              </div>
              <button
                onClick={() => dispatch(logout())}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded hover:bg-white/20 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 bg-gradient-to-b from-indigo-700 to-purple-800 rounded-xl shadow-lg p-4 space-y-3 font-medium text-white animate-fadeIn">
          <div className="flex flex-col gap-2 mb-2 text-sm">
            {user && (
              <span className="text-yellow-200 font-semibold">
                {greeting}, {user.name}
              </span>
            )}
          </div>
          <Link
            to="/"
            className="block hover:text-yellow-300 transition"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block hover:text-yellow-300 transition"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/notices"
            className="block hover:text-yellow-300 transition"
            onClick={toggleMenu}
          >
            Notices
          </Link>
          <Link
            to="/blogs"
            className="block hover:text-yellow-300 transition"
            onClick={toggleMenu}
          >
            Blogs
          </Link>
          {user && (
            <>
              {["admin", "owner", "kosadhokko"].includes(user.role) ? (
                <Link
                  to="/admin"
                  className="block hover:text-yellow-300 transition"
                  onClick={toggleMenu}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="block hover:text-yellow-300 transition"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  dispatch(logout());
                  setMenuOpen(false);
                }}
                className="w-full bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <Link
              to="/login"
              className="block w-full bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
          {/* Extra Feature: Theme toggle placeholder */}
          <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
            <Sun size={16} /> <span>Light / Dark Mode</span>
          </div>
        </div>
      )}
    </nav>
  );
}
