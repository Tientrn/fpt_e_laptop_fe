import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaFileContract,
  FaSignOutAlt,
  FaBars,
  FaHome,
} from "react-icons/fa";
import { toast } from "react-toastify";

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/student/profile",
      name: "Profile",
      icon: <FaUser className="w-5 h-5" />,
    },
    {
      path: "/student/requests",
      name: "Borrow Requests",
      icon: <FaClipboardList className="w-5 h-5" />,
    },
    {
      path: "/student/contractstudent",
      name: "Borrow Contracts",
      icon: <FaFileContract className="w-5 h-5" />,
    },
    {
      path: "/student/borrowhistorystudent",
      name: "Borrow Historys",
      icon: <FaFileContract className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      toast.error("Lỗi khi đăng xuất");
      console.error("Logout error:", error);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-slate-600 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-xl font-semibold ${!isSidebarOpen && "hidden"}`}>
            Sinh viên
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded hover:bg-slate-700 transition-colors duration-200"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm ${
                location.pathname === item.path
                  ? "bg-amber-600 text-white"
                  : "text-white hover:bg-slate-700"
              } transition-colors duration-200`}
            >
              {item.icon}
              <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex justify-end items-center px-4 py-3">
            <button
              onClick={handleGoHome}
              className="flex items-center px-3 py-2 mr-4 text-sm text-black border border-gray-200 rounded hover:bg-amber-50 transition-colors duration-200"
            >
              <FaHome className="w-4 h-4 mr-2" />
              Trang chủ
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm text-black border border-gray-200 rounded hover:bg-amber-50 transition-colors duration-200"
            >
              <FaSignOutAlt className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
