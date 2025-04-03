import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaHistory,
  FaClipboardList,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaFileContract,
  FaMoneyBillWave,
} from "react-icons/fa";
import { toast } from "react-toastify";

const StaffLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/staff/borrow-requests",
      name: "Borrow Requests",
      icon: <FaClipboardList className="w-5 h-5" />,
    },
    {
      path: "/staff/borrow-history",
      name: "Borrow History",
      icon: <FaHistory className="w-5 h-5" />,
    },
    {
      path: "/staff/contracts",
      name: "Contracts",
      icon: <FaFileContract className="w-5 h-5" />,
    },
    {
      path: "/staff/statistics",
      name: "Statistics",
      icon: <FaChartLine className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-slate-600 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-500">
          <h2 className={`text-xl font-semibold ${!isSidebarOpen && "hidden"}`}>
            Staff Dashboard
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                location.pathname === item.path
                  ? "bg-amber-600 text-white"
                  : "text-white hover:bg-slate-700"
              } transition-colors`}
            >
              {item.icon}
              <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout in Sidebar */}
        
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-amber-600 font-medium">
              {/* {menuItems.find((item) => item.path === location.pathname)
                ?.name || "Staff Dashboard"} */}
            </div>
            <div className="p-4 border-slate-500">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-black hover:bg-teal-600 transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </button>
        </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
