import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHistory, FaCog, FaSignOutAlt } from "react-icons/fa";
import api, { setAccessToken } from "../config/axios.js";

interface LeftSidebarUserProps {
  customHeight?: string;
  fullname?: string;
  avatarUrl?: string;
  country?: string;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  textColor?: string;
  action?: () => void;
}

const LeftSidebarUser: React.FC<LeftSidebarUserProps> = ({
  customHeight = "h-screen w-64 min-w-44",
}) => {
  const navigate = useNavigate();
  const fullname = localStorage.getItem("fullname") || "Guest User";
  const avatarUrl = localStorage.getItem("avatarUrl") || "/img/avatar/default_avatar.jpg";

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
       localStorage.clear();    
    } catch (err) {
      console.error("Logout server failed:", err);
    } finally {
      setAccessToken(null);
      navigate("/login", { replace: true });
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Lịch sử làm bài", icon: <FaHistory />, to: "/history" },
    { label: "Cài đặt", icon: <FaCog />, to: "/settings" },
    { label: "Đăng xuất", icon: <FaSignOutAlt />, textColor: "text-red-500", action: handleLogout },
  ];

  return (
    <aside className={`bg-gray-100 flex flex-col p-4 ${customHeight}`}>
      {/* Thông tin người dùng */}
      <div className="flex items-center mb-6">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">{fullname}</h2>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="mr-1">Xin chào!</span>
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.label} className="mb-2">
              {item.action ? (
                <button
                  onClick={item.action}
                  className={`flex items-center w-full p-2 rounded hover:bg-blue-100 ${item.textColor || "text-gray-700"}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ) : (
                <Link
                  to={item.to || "#"}
                  className={`flex items-center p-2 rounded hover:bg-blue-100 ${item.textColor || "text-gray-700"}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default LeftSidebarUser;
