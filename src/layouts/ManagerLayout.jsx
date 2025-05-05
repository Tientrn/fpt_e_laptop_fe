import React, { useState, useEffect } from "react";
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
  FaUser,
  FaHome,
  FaArrowLeft,
  FaCog,
  FaQuestion,
} from "react-icons/fa";
import { toast } from "react-toastify";

const ManagerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Detect scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user data
  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        setUserData(JSON.parse(userDataStr));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  // Get user's first name initial or first two letters of email
  const getUserInitial = () => {
    if (!userData) return "M";
    
    if (userData.fullName) {
      return userData.fullName.charAt(0).toUpperCase();
    } else if (userData.email) {
      return userData.email.substring(0, 2).toUpperCase();
    }
    
    return "M";
  };

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
    // Uncomment these if needed in the future
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

  const handleGoHome = () => {
    navigate("/");
  };

  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname.includes('overview')) return 'Dashboard Overview';
    if (location.pathname.includes('borrow-requests')) return 'Borrow Requests';
    if (location.pathname.includes('staff-management')) return 'Staff Management';
    if (location.pathname.includes('organization')) return 'Organization';
    if (location.pathname.includes('approvals')) return 'Approvals';
    if (location.pathname.includes('create-user')) return 'Create User';
    if (location.pathname.includes('roles')) return 'Roles & Access';
    return 'Manager Dashboard';
  };

  // Function to check if a path is active
  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-10 transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2.5 rounded-full bg-indigo-700 text-white shadow-lg hover:bg-indigo-600 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-all duration-300 ease-in-out
          w-72 bg-white shadow-xl border-r border-gray-100 flex flex-col
        `}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex items-center h-20 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 px-6">
          <button
            onClick={() => navigate("/")}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-200 active:scale-95 flex items-center justify-center"
            aria-label="Go back"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <div className="ml-3 flex items-center">
            <div className="p-2 bg-white/20 rounded-lg flex items-center justify-center">
              <FaUsersCog className="text-white w-4 h-4" />
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-bold text-white leading-tight">Manager</h2>
              <p className="text-xs text-white/80">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {getUserInitial()}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-800 truncate">
                {userData?.fullName || "Manager Account"}
              </p>
              <p className="text-xs text-gray-500 truncate">{userData?.email || "manager@fpt.edu.vn"}</p>
              <div className="mt-1 flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                <span className="text-xs text-green-700 font-medium">Active Admin</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Menu Items */}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-3 rounded-xl
                transition-all duration-200 group
                ${isPathActive(item.path) 
                  ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-md" 
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }
              `}
            >
              <span className={`w-5 h-5 mr-3 group-hover:scale-110 transition-transform ${!isPathActive(item.path) && "text-indigo-600"}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
          
          
        </nav>

        {/* Footer with version info */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              FPT e-Laptop Program <span className="text-xs opacity-60">v1.2</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-xs text-red-600 hover:text-red-700 font-medium py-1 px-2 rounded hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="w-3.5 h-3.5 mr-1" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>
          <div className="flex justify-between items-center h-16 px-4 md:px-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
              <div className="ml-3 hidden md:block">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  Manager Portal
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGoHome}
                className="flex items-center rounded-full bg-indigo-700 hover:bg-indigo-600 py-2 px-5 text-sm font-medium text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <FaHome className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 py-2 px-5 text-sm font-medium text-gray-700 transition-all hover:shadow-sm"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 mb-6 border border-gray-100">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
