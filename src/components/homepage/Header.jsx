import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import LaptopIcon from "@mui/icons-material/Laptop";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { jwtDecode } from "jwt-decode";
import useCartStore from "../../store/useCartStore";
import { Link } from "react-router-dom";

function HeaderHomePage() {
  const [nav, setNav] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.getCartCount());

  // Detect scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isProfileOpen && !event.target.closest('.profile-container')) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = () => {
    const cartData = localStorage.getItem("cart-storage");
    localStorage.clear();
    localStorage.setItem("cart-storage", cartData);

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        handleLogout();
      }
    } catch {
      // Just clear token without handling the error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  // Parse the user JSON data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = userData.role || "";

  // Function to get role-specific dashboard link
  const getDashboardLink = () => {
    switch(userRole) {
      case "Admin":
        return "/admin";
      case "Student":
        return "/student";
      case "Sponsor":
        return "/sponsor/laptop-info";
      case "Staff":
        return "/staff";
      case "Manage":
        return "/manager";
      case "Shop":
        return "/shop/products";
      default:
        return "/";
    }
  };

  // Define role-specific menu items
  const getRoleSpecificMenuItems = () => {
    // Common profile dropdown items that will appear for all roles
    const commonItems = [
      <button
        key="logout"
        onClick={handleLogout}
        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <i className="fas fa-sign-out-alt text-red-500"></i>
        Logout
      </button>
    ];

    // Items specific to each role
    switch(userRole) {
      case "Admin":
        return [
          <Link
            key="admin-dashboard"
            to="/admin"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-tachometer-alt text-indigo-500"></i>
            Dashboard
          </Link>,
          <Link
            key="admin-accounts"
            to="/admin/accounts"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-users text-indigo-500"></i>
            Manage Accounts
          </Link>,
          <div key="admin-divider" className="border-t border-gray-100 my-1"></div>,
          ...commonItems
        ];
        
      case "Student":
        return [
          <Link
            key="student-profile"
            to="/student/profile"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-user-circle text-indigo-500"></i>
            My Profile
          </Link>,
          <Link
            key="student-orders"
            to="/student/orders"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-shopping-bag text-indigo-500"></i>
            My Orders
          </Link>,
          <Link
            key="student-requests"
            to="/student/requests"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-clipboard-list text-indigo-500"></i>
            My Requests
          </Link>,
          <Link
            key="student-borrowhistory"
            to="/student/borrowhistorystudent"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-history text-indigo-500"></i>
            Borrow History
          </Link>,
          <div key="student-divider" className="border-t border-gray-100 my-1"></div>,
          ...commonItems
        ];
        
      case "Sponsor":
        return [
          <Link
            key="sponsor-laptops"
            to="/sponsor/laptop-info"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-laptop text-indigo-500"></i>
            My Laptops
          </Link>,
          <Link
            key="sponsor-status"
            to="/sponsor/laptop-status"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-chart-line text-indigo-500"></i>
            Laptop Status
          </Link>,
          <div key="sponsor-divider" className="border-t border-gray-100 my-1"></div>,
          ...commonItems
        ];
        
      case "Staff":
        return [
          <Link
            key="staff-items"
            to="/staff/items"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-boxes text-indigo-500"></i>
            Item Management
          </Link>,
          <Link
            key="staff-orders"
            to="/staff/orders"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-shopping-cart text-indigo-500"></i>
            Order Management
          </Link>,
          <Link
            key="staff-borrow"
            to="/staff/borrow-history"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-history text-indigo-500"></i>
            Borrow History
          </Link>,
          <div key="staff-divider" className="border-t border-gray-100 my-1"></div>,
          ...commonItems
        ];
        
      case "Manage":
        return [
          <Link
            key="manager-overview"
            to="/manager/overview"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-chart-pie text-indigo-500"></i>
            Overview Dashboard
          </Link>,
          <Link
            key="manager-requests"
            to="/manager/borrow-requests"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-tasks text-indigo-500"></i>
            Borrow Requests
          </Link>,
          <div key="manager-divider" className="border-t border-gray-100 my-1"></div>,
          ...commonItems
        ];
        
      case "Shop":
        return [
          <Link
            key="shop-products"
            to="/shop/products"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-laptop text-indigo-500"></i>
            My Products
          </Link>,
          <Link
            key="shop-orders"
            to="/shop/orders"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-shopping-bag text-indigo-500"></i>
            Shop Orders
          </Link>,
          <Link
            key="shop-add"
            to="/shop/add-product"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-plus-circle text-indigo-500"></i>
            Add Product
          </Link>,
          <div key="shop-divider" className="border-t border-gray-100 my-1"></div>,
          ...commonItems
        ];
        
      default:
        return [
          <Link
            key="profile"
            to="/student/profile"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-user-circle text-indigo-500"></i>
            My Profile
          </Link>,
          <div key="default-divider" className="border-t border-gray-100 my-1"></div>,
          ...commonItems
        ];
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>
      {/* Sponsor Bar - Only show for non-sponsors */}
      {userRole !== "Sponsor" && (
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-indigo-900 text-white px-4 lg:px-8 py-1.5">
          <div className="mx-auto max-w-screen-xl flex justify-end">
            <button
              onClick={() => navigate("/sponsor/register")}
              className="font-medium text-md hover:text-amber-300 transition-all flex items-center h-9 gap-1.5 hover:scale-105"
            >
              <HandshakeIcon className="text-amber-300" fontSize="medium" />
              <span className="drop-shadow-md">Become a Sponsor</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={`bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white px-4 lg:px-8 py-4 transition-all duration-300 ${scrolled ? 'py-3' : ''}`}>
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center gap-2 transition-transform duration-300 transform hover:scale-105">
              <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md overflow-hidden">
                <i className="fas fa-laptop text-xl text-indigo-600"></i>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold drop-shadow-md transition-colors group-hover:text-amber-300">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">FPT</span>
                  <span className="ml-1">E-Laptop</span>
                </h1>
              </div>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm rounded-lg bg-indigo-700/30 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              onClick={() => setNav(!nav)}
            >
              <span className="sr-only">Toggle menu</span>
              {nav ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Navigation Links and Actions */}
          <div
            className={`${
              nav
                ? "absolute top-[106px] left-0 w-full bg-gradient-to-b from-indigo-900 to-indigo-950 shadow-2xl p-5 border-t border-indigo-700/50 backdrop-blur-sm"
                : "hidden md:flex"
            } md:relative md:top-0 md:w-auto md:bg-transparent md:shadow-none md:border-none md:p-0 md:items-center transition-all duration-300 z-20`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-1 lg:space-x-2 mb-6 md:mb-0">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-1.5 px-4 py-2.5 md:py-2 text-base font-medium rounded-lg hover:bg-white/10 transition-all hover:text-amber-300"
                >
                  <HomeIcon fontSize="small" className="hidden md:block" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/laptopshop"
                  className="flex items-center gap-1.5 px-4 py-2.5 md:py-2 text-base font-medium rounded-lg hover:bg-white/10 transition-all hover:text-amber-300"
                >
                  <LaptopIcon fontSize="small" className="hidden md:block" />
                  <span>Laptop Shop</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/laptopborrow"
                  className="flex items-center gap-1.5 px-4 py-2.5 md:py-2 text-base font-medium rounded-lg hover:bg-white/10 transition-all hover:text-amber-300"
                >
                  <i className="fas fa-handshake text-sm hidden md:block"></i>
                  <span>Laptop Borrow</span>
                </Link>
              </li>
              
              {/* Role-specific navigation */}
              {isLoggedIn && (
                <li>
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-1.5 px-4 py-2.5 md:py-2 text-base font-medium rounded-lg hover:bg-white/10 transition-all hover:text-amber-300"
                  >
                    <i className="fas fa-tachometer-alt text-sm hidden md:block"></i>
                    <span>{userRole || "Dashboard"}</span>
                  </Link>
                </li>
              )}
            </ul>

            <div className="flex items-center md:ml-6 lg:ml-8 gap-3 md:gap-4">
              {/* Cart Button - Show for all users except Admin, Staff, and Managers */}
              {(!isLoggedIn || (userRole !== "Admin" && userRole !== "Staff" && userRole !== "Manage")) && (
                <Link
                  to="/cart"
                  className="text-white p-2 rounded-full hover:bg-white/10 transition-all hover:scale-110 relative"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCartCheckoutIcon />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              
              {/* Login/Register or Profile */}
              {!isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="rounded-full bg-indigo-700 hover:bg-indigo-600 py-2 px-5 text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-400 py-2 px-5 text-sm font-medium text-indigo-900 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="relative profile-container">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 rounded-full hover:bg-white/10 transition-all hover:scale-110"
                    aria-label="User Profile"
                  >
                    <PersonIcon />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl py-2 z-30 border border-indigo-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">My Account</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className="font-medium">{userData.fullName || "User"}</span>
                          <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">{userRole || "User"}</span>
                        </p>
                      </div>
                      
                      {/* Dynamic role-based menu items */}
                      {getRoleSpecificMenuItems()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderHomePage;
