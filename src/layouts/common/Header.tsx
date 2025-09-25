import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaHome, FaClipboardList, FaFileAlt, FaSearch, FaCrown} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../../config/axios.js";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fullname = localStorage.getItem("fullname");
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout server failed:", err);
    } finally {
    localStorage.clear();
    setAccessToken(null);
    setOpenMenu(false);
    navigate("/login");
  }
  };

  const navLinks = [
    { to: "/", label: "Trang chủ", icon: <FaHome className="text-xl" /> },
    {
      to: "/practice",
      label: "Luyện tập",
      icon: <FaClipboardList className="text-xl" />,
    },
    {
      to: "/mock-test",
      label: "Thi thử",
      icon: <FaFileAlt className="text-xl" />,
    },
    {
      to: "/resource",
      label: "Tài nguyên",
      icon: <FaSearch className="text-xl" />,
    },
    {
      to: "/payment",
      label: "Premium",
      icon: <FaCrown className="text-xl text-yellow-500" />,
      premium: true,
    },
  ];

  return (
    <header className="bg-white shadow-md px-4 sm:px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <span className="text-blue-600 font-extrabold text-xl tracking-wide">
          TOEIC MASTER
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`hidden sm:block relative transition-colors duration-200 ${
              location.pathname === link.to
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-500"
            } ${link.premium ? "text-yellow-600 hover:text-yellow-500" : ""}`}
          >
            {link.label}
            {location.pathname === link.to && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </Link>
        ))}

        {/* Mobile (icon) */}
        {navLinks.map((link) => (
          <Link
            key={link.to + "-mobile"}
            to={link.to}
            className={`sm:hidden transition-colors duration-200 ${
              location.pathname === link.to
                ? "text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {link.icon}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="relative">
        {fullname ? (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
            >
              <span className="font-medium text-gray-700 hidden sm:block">
                {fullname}
              </span>
              <CiUser className="text-2xl text-gray-700" />
            </button>

            {/* Dropdown */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-50 animate-fadeIn">
                <Link
                  to="/settings"
                  onClick={() => setOpenMenu(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-gradient-to-r from-blue-500 shadow-lg to-purple-500 hover:opacity-90 text-white px-4 py-2 rounded-full font-medium transition">
                
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
