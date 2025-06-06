import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LaptopIcon from "@mui/icons-material/Laptop";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { jwtDecode } from "jwt-decode";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

export const SponsorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notificationCount] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detect scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("user");
    
    if (token && userDataStr) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          handleLogout();
        } else {
          // Valid token
          setIsLoggedIn(true);
          setUserData(JSON.parse(userDataStr));
        }
      } catch {
        // Invalid token
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      setIsLoggedIn(false);
    }
    
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/login");
  };

  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname.includes('register')) return 'Laptop Donation Request';
    if (location.pathname.includes('laptop-info')) return 'My Donations';
    if (location.pathname.includes('laptop-status')) return 'Laptop Status';
    return 'Sponsor Dashboard';
  };

  // Get user's first name initial or first two letters of email
  const getUserInitial = () => {
    if (!userData) return "?";
    
    if (userData.fullName) {
      return userData.fullName.charAt(0).toUpperCase();
    } else if (userData.email) {
      return userData.email.substring(0, 2).toUpperCase();
    }
    
    return "S";
  };

  const sidebarItems = [
    {
      path: "/sponsor/register",
      icon: <HandshakeIcon />,
      label: "Laptop Donation Request",
    },
    {
      path: "/sponsor/laptop-info",
      icon: <LaptopIcon />,
      label: "My Donations",
    },
    {
      path: "/sponsor/laptop-status",
      icon: <AssessmentIcon />,
      label: "Laptop Status",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
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
        {isSidebarOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
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
        {/* Sidebar Header with Logo and Back Button */}
        <div className="flex items-center h-20 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 px-5">
          <button
            onClick={() => navigate("/")}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-200 active:scale-95 flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowBackIcon fontSize="small" />
          </button>
          <div className="ml-3 flex items-center">
            <div className="p-2 bg-white/20 rounded-lg flex items-center justify-center">
              <DashboardIcon className="text-white" fontSize="small" />
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-bold text-white leading-tight">Sponsor</h2>
              <p className="text-xs text-white/80">Management Portal</p>
            </div>
          </div>
        </div>

        {/* User Profile Section - Only show when logged in */}
        {isLoggedIn ? (
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {getUserInitial()}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {userData?.fullName || "Sponsor Account"}
                </p>
                <p className="text-xs text-gray-500 truncate">{userData?.email || "Supporting students"}</p>
                <div className="mt-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="text-xs text-green-700 font-medium">Active Sponsor</span>
                </div>
              </div>
              
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
            <div className="flex flex-col items-center space-y-3">
              <p className="text-sm font-medium text-gray-700">Sign in to access all features</p>
              <div className="flex space-x-2 w-full">
                <Link 
                  to="/login" 
                  className="flex-1 py-2 bg-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-all flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5"
                >
                  <LoginIcon fontSize="small" className="mr-1.5" /> Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-indigo-900 rounded-lg text-sm font-medium transition-all flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5"
                >
                  <PersonAddIcon fontSize="small" className="mr-1.5" /> Register
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-xl
                transition-all duration-200 group
                ${isActive 
                  ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-md" 
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }
                ${!isLoggedIn && "opacity-60 pointer-events-none filter grayscale"}
              `}
            >
              <span className={`mr-3 text-xl group-hover:scale-110 transition-transform ${!location.pathname.includes(item.path) && "text-indigo-600"}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
              {item.path === "/sponsor/register" && (
                <span className="ml-auto bg-white/90 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">New</span>
              )}
            </NavLink>
          ))}
          
          
        </nav>
        
        {/* Footer with version info */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              FPT e-Laptop Program <span className="text-xs opacity-60">v1.2</span>
            </div>
            {isLoggedIn && (
              <button 
                onClick={handleLogout}
                className="flex items-center text-xs text-red-600 hover:text-red-700 font-medium py-1 px-2 rounded hover:bg-red-50 transition-colors"
              >
                <LogoutIcon fontSize="small" className="w-3.5 h-3.5 mr-1" /> Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className={`bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>
          <div className="flex justify-between items-center h-16 px-4 md:px-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
              <div className="ml-3 hidden md:block">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  Sponsor Portal
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  {/* User profile for desktop - Only show when logged in */}
                  <div className="hidden md:flex items-center space-x-3">
                    <button
                      onClick={() => navigate("/")}
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
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="rounded-full bg-indigo-700 hover:bg-indigo-600 py-2 px-5 text-sm font-medium text-white transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center"
                  >
                    <LoginIcon fontSize="small" className="w-4 h-4 mr-1.5" /> Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-400 py-2 px-5 text-sm font-medium text-indigo-900 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center"
                  >
                    <PersonAddIcon fontSize="small" className="w-4 h-4 mr-1.5" /> Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {!isLoggedIn && location.pathname !== "/sponsor" ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <LoginIcon className="text-indigo-600 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Authentication Required</h3>
                  <p className="text-gray-600 mb-5 max-w-md">Please sign in or register to access this feature</p>
                  <div className="flex space-x-3">
                    <Link 
                      to="/login" 
                      className="px-5 py-2.5 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-600 transition-all shadow-md hover:-translate-y-0.5"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-indigo-900 rounded-lg font-medium transition-all shadow-md hover:-translate-y-0.5"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 mb-6 border border-gray-100">
                <Outlet />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
