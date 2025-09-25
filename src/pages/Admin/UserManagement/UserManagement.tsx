import React, { useEffect, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";
import api from "../../../config/axios";

interface User {
  id: number; // displayId
  _id: string; // MongoDB _id
  fullname: string;
  email: string;
  phone: string;
  role: string;
  registerDate?: string;
  status?: "Active" | "Inactive";
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalUsers, setTotalUsers] = useState(0);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Fetch users from backend
  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/users?page=${page}&limit=${pageSize}`);
      const data = res.data.data;

      setUsers(
        data.users.map((user: any, index: number) => ({
          id: (page - 1) * pageSize + index + 1,
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          role: user.role,
          registerDate: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "",
          status: user.isActive ? "Active" : "Inactive",
        }))
      );
      setTotalUsers(data.total);
    } catch (err) {
      console.error("Lấy danh sách người dùng lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalUsers / pageSize);

  // Toggle dropdown menu
  const toggleMenu = (userId: string) => {
    setMenuOpenId(menuOpenId === userId ? null : userId);
  };

  // Inactivate / Activate user
  const handleToggleStatus = async (user: User) => {
    try {
      await api.patch("/auth/change-activate-user", { email: user.email });
      setUsers((prev) =>
        prev.map((u) =>
          u.email === user.email
            ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
            : u
        )
      );
      setMenuOpenId(null);
    } catch (err) {
      console.error("Cập nhật trạng thái lỗi:", err);
    }
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen flex flex-row">
      <LeftSidebarAdmin customHeight="h-auto w-64" />
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Quản lý người dùng
        </h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-4">
          <table className="w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Tên</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Số điện thoại</th>
                <th className="px-6 py-3 text-left">Ngày đăng ký</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
                <th className="px-6 py-3 text-center">Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t relative">
                  <td className="px-6 py-3">{user.id}</td>
                  <td className="px-6 py-3">{user.fullname}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.phone}</td>
                  <td className="px-6 py-3">{user.registerDate}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white ${
                        user.status === "Active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center relative">
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => toggleMenu(user._id)}
                    >
                      <FaEllipsisH />
                    </button>

                    {/* Dropdown menu */}
                    {menuOpenId === user._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded z-50">
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.status === "Active" ? "Vô hiệu hóa" : "Kích hoạt"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
