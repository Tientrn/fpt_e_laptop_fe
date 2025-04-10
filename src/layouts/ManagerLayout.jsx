import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaUsersCog,
  FaClipboardCheck,
  FaClipboardList,
  FaChartPie,
  FaSignOutAlt,
  FaBars,
  FaBuilding,
  FaUserShield,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";

const ManagerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/manager/overview",
      name: "Overview",
      icon: <FaChartPie className="w-5 h-5" />,
    },
    {
      path: "/manager/borrow-requests",
      name: "Borrow Requests",
      icon: <FaClipboardList className="w-4 h-4" />,
    },
    // {
    //   path: "/manager/staff-management",
    //   name: "Staff Management",
    //   icon: <FaUsersCog className="w-5 h-5" />,
    // },
    // {
    //   path: "/manager/organization",
    //   name: "Organization",
    //   icon: <FaBuilding className="w-5 h-5" />,
    // },
    // {
    //   path: "/manager/approvals",
    //   name: "Approvals",
    //   icon: <FaClipboardCheck className="w-5 h-5" />,
    // },
    // {
    //   path: "/manager/create-user",
    //   name: "Create User",
    //   icon: <FaPlus className="w-5 h-5" />,
    // },
    // {
    //   path: "/manager/roles",
    //   name: "Roles & Access",
    //   icon: <FaUserShield className="w-5 h-5" />,
    // },
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
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-slate-600 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-500">
          <h2
            className={`text-xl font-bold tracking-wide ${
              !isSidebarOpen && "hidden"
            }`}
          >
            Manager Dashboard
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-semibold uppercase tracking-wide ${
                location.pathname === item.path
                  ? "bg-amber-600 text-white border-l-4 border-white"
                  : "text-white hover:bg-slate-700"
              } transition-all`}
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
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-lg text-amber-600 font-bold tracking-wide">
              Manager Mode
            </div>
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-black hover:bg-teal-600 rounded transition-colors"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
                  Logout
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
