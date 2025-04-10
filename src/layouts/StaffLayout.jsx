import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaHistory,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaFileContract,
  FaMoneyBillWave,
  FaStore,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { toast } from "react-toastify";

const StaffLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBorrowOpen, setIsBorrowOpen] = useState(true);
  const [isDonateOpen, setIsDonateOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const borrowSubItems = [
    {
      path: "/staff/contracts",
      name: "Borrow Contracts",
      icon: <FaFileContract className="w-4 h-4" />,
    },
    {
      path: "/staff/borrow-history",
      name: "Borrow History",
      icon: <FaHistory className="w-4 h-4" />,
    },
  ];

  const donateSubItems = [
    {
      path: "/staff/donate-items",
      name: "Donate Management",
      icon: <FaMoneyBillWave className="w-4 h-4" />,
    },
  ];

  const menuItems = [
    {
      path: "/staff/items",
      name: "Item Management",
      icon: <FaStore className="w-5 h-5" />,
    },
    {
      path: "/staff/products",
      name: "Product Management",
      icon: <FaStore className="w-5 h-5" />,
    },
    {
      path: "/staff/orders",
      name: "Order Management",
      icon: <FaStore className="w-5 h-5" />,
    },
    // {
    //   path: "/staff/statistics",
    //   name: "Statistics",
    //   icon: <FaChartLine className="w-5 h-5" />,
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

  // Helper function for collapsible menu
  const CollapsibleMenu = ({ isOpen, setIsOpen, title, icon, items }) => (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-slate-700 transition-colors duration-200"
      >
        {icon}
        <span className={`ml-3 flex-1 text-left ${!isSidebarOpen && "hidden"}`}>
          {title}
        </span>
        {isSidebarOpen && (
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
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

      {isOpen && isSidebarOpen && (
        <div className="ml-8 space-y-1">
          {items.map((item) => (
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
  );

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
          {/* Borrow Group */}
          <CollapsibleMenu
            isOpen={isBorrowOpen}
            setIsOpen={setIsBorrowOpen}
            title="Borrow"
            icon={<FaFileContract className="w-5 h-5" />}
            items={borrowSubItems}
          />

          {/* Donate Group */}
          <CollapsibleMenu
            isOpen={isDonateOpen}
            setIsOpen={setIsDonateOpen}
            title="Donate"
            icon={<FaHandHoldingHeart className="w-5 h-5" />}
            items={donateSubItems}
          />

          {/* Other Menu Items */}
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

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-500">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-2">
            <div className="text-sm text-amber-600 font-medium">
              {menuItems.find((item) => item.path === location.pathname)
                ?.name ||
                borrowSubItems.find((item) => item.path === location.pathname)
                  ?.name ||
                donateSubItems.find((item) => item.path === location.pathname)
                  ?.name ||
                "Staff Dashboard"}
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
