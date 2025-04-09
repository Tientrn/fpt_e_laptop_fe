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
  const [isBorrowOpen, setIsBorrowOpen] = useState(true); // mở mặc định
  const location = useLocation();
  const navigate = useNavigate();

  const borrowSubItems = [
    {
      path: "/student/requests",
      name: "Borrow Requests",
      icon: <FaClipboardList className="w-4 h-4" />,
    },
    {
      path: "/student/contractstudent",
      name: "Borrow Contracts",
      icon: <FaFileContract className="w-4 h-4" />,
    },
    {
      path: "/student/borrowhistorystudent",
      name: "Borrow Historys",
      icon: <FaFileContract className="w-4 h-4" />,
    },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logout successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout error");
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
        <div className="p-4 flex justify-between items-center ml-4">
          <h2 className={`text-xl font-semibold ${!isSidebarOpen && "hidden"}`}>
            Student
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded hover:bg-slate-700 transition-colors duration-200"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-6 space-y-1">
          {/* Profile */}
          <Link
            to="/student/profile"
            className={`flex items-center px-4 py-3 text-sm ${
              location.pathname === "/student/profile"
                ? "bg-amber-600 text-white"
                : "text-white hover:bg-slate-700"
            } transition-colors duration-200`}
          >
            <FaUser className="w-5 h-5" />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Profile
            </span>
          </Link>

          {/* Borrow Group */}
          <div>
            <button
              onClick={() => setIsBorrowOpen(!isBorrowOpen)}
              className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-slate-700 transition-colors duration-200"
            >
              <FaFileContract className="w-5 h-5" />
              <span
                className={`ml-3 flex-1 text-left ${
                  !isSidebarOpen && "hidden"
                }`}
              >
                Borrow
              </span>
              {isSidebarOpen && (
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isBorrowOpen ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>

            {/* Sub-menu */}
            {isBorrowOpen && isSidebarOpen && (
              <div className="ml-8 space-y-1">
                {borrowSubItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${
                      location.pathname === item.path
                        ? "bg-amber-600 text-white"
                        : "text-white hover:bg-slate-700"
                    } transition-colors duration-200`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
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
              Home
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm text-black border border-gray-200 rounded hover:bg-amber-50 transition-colors duration-200"
            >
              <FaSignOutAlt className="w-4 h-4 mr-2" />
              Logout
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
