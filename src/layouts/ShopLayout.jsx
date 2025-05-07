import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartPie,
  FaSignOutAlt,
  FaBars,
  FaStore,
  FaPlusSquare,
  FaPlusCircle,
  FaUserCircle,
  FaHome,
  FaArrowLeft,
  FaCog,
  FaQuestion,
  FaWallet,
  FaClipboardCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import shopApi from "../api/shopApi";
import walletApi from "../api/walletApi";

const ShopLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasShop, setHasShop] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isShop = user?.roles?.includes("shop") || user?.roleId === 6;

  // Detect scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkShopExists = async () => {
      try {
        const userId = user?.userId;
        if (!userId) return;

        const shopsResponse = await shopApi.getAllShops();
        if (shopsResponse && shopsResponse.data) {
          const existingShop = shopsResponse.data.find(
            (shop) => shop.userId === Number(userId)
          );
          setHasShop(!!existingShop);

          if (!existingShop && location.pathname !== "/shop/create-profile") {
            navigate("/shop/create-profile");
          }
        }
      } catch (error) {
        console.error("Error checking shop:", error);
      }
    };

    checkShopExists();
  }, [user, location.pathname, navigate]);

  // Check if user has a wallet
  useEffect(() => {
    const checkWalletExists = async () => {
      try {
        const userId = user?.userId;
        if (!userId) return;

        const walletResponse = await walletApi.getWallet();
        if (walletResponse && walletResponse.data) {
          const existingWallet = walletResponse.data.find(
            (wallet) => wallet.userId === Number(userId)
          );
          setHasWallet(!!existingWallet);
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
      }
    };

    checkWalletExists();
  }, [user]);

  const handleCreateWallet = async () => {
    try {
      setIsCreatingWallet(true);
      const type = user?.roles?.includes("Shop") ? "Shop" : "Shop";
      const response = await walletApi.createWallet(type);

      if (response && response.isSuccess) {
        setHasWallet(true);
        toast.success("Wallet created successfully!");
      } else {
        toast.error(
          response?.message || "Cannot create wallet. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast.error(
        "An error occurred while creating a wallet. Please try again later."
      );
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const getMenuItems = () => {
    const baseMenuItems = [
      {
        path: "/shop/profile",
        name: "Shop Profile",
        icon: <FaUserCircle className="w-5 h-5" />,
        requiresShop: true,
        requiresWallet: true,
      },
      {
        path: "/shop/products",
        name: "My Products",
        icon: <FaBoxOpen className="w-5 h-5" />,
        requiresShop: true,
        requiresWallet: true,
      },
      {
        path: "/shop/orders",
        name: "Orders",
        icon: <FaClipboardCheck className="w-5 h-5" />,
        requiresShop: true,
      },
      {
        path: "/shop/add-product",
        name: "Add Product",
        icon: <FaPlusSquare className="w-5 h-5" />,
        requiresShop: true,
        requiresWallet: true,
      },
      {
        path: "/shop/analytics",
        name: "Analytics",
        icon: <FaChartPie className="w-5 h-5" />,
        requiresShop: true,
        requiresWallet: true,
      },
    ];

    if (!hasShop) {
      baseMenuItems.splice(1, 0, {
        path: "/shop/create-profile",
        name: "Create Shop Info",
        icon: <FaPlusCircle className="w-5 h-5" />,
        requiresShop: false,
        requiresWallet: false,
      });
    }

    return baseMenuItems;
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("shopId");
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
    if (location.pathname.includes("profile")) return "Shop Profile";
    if (location.pathname.includes("products")) return "My Products";
    if (location.pathname.includes("orders")) return "Orders";
    if (location.pathname.includes("add-product")) return "Add Product";
    if (location.pathname.includes("analytics")) return "Analytics";
    if (location.pathname.includes("create-profile")) return "Create Shop Info";
    return "Shop Dashboard";
  };

  // Function to check if a path is active
  const isPathActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Get user's initial for avatar
  const getUserInitial = () => {
    if (!user) return "S";

    if (user.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    return "S";
  };

  if (!isShop) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md border border-red-100">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You are not authorized to view this page. Please contact an
            administrator if you believe this is an error.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Wallet Create Modal - Only show after shop profile is created */}
      {hasShop && !hasWallet && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-4 w-full border border-indigo-100 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <FaWallet className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Create Wallet to Continue
            </h2>
            <p className="text-gray-600 text-center mb-6">
              To use the shop&apos;s features, you need to create a wallet now. The
              wallet will be used for transactions and payments.
            </p>
            <button
              onClick={handleCreateWallet}
              disabled={isCreatingWallet}
              className={`w-full py-3 rounded-xl font-medium text-white 
                ${
                  isCreatingWallet
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
                } transition-all duration-200 flex items-center justify-center`}
            >
              {isCreatingWallet ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating wallet...
                </>
              ) : (
                <>
                  <FaWallet className="w-5 h-5 mr-2" /> Create wallet now
                </>
              )}
            </button>
          </div>
        </div>
      )}

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
        {isSidebarOpen ? (
          <FaArrowLeft className="w-4 h-4" />
        ) : (
          <FaBars className="w-4 h-4" />
        )}
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
              <FaStore className="text-white w-4 h-4" />
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-bold text-white leading-tight">
                Shop
              </h2>
              <p className="text-xs text-white/80">Vendor Portal</p>
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
                {user?.fullName || "Shop Account"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "shop@fpt.edu.vn"}
              </p>
              <div className="mt-1 flex items-center">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasWallet && hasShop ? "bg-green-500" : "bg-amber-500"
                  } mr-1.5`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    hasWallet && hasShop ? "text-green-700" : "text-amber-700"
                  }`}
                >
                  {!hasWallet
                    ? "Wallet Required"
                    : hasShop
                    ? "Active Vendor"
                    : "Setup Required"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {getMenuItems().map((item) => {
            const isDisabled =
              (item.requiresShop && !hasShop) ||
              (item.requiresWallet && !hasWallet);

            return (
              <Link
                key={item.path}
                to={isDisabled ? "#" : item.path}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    if (!hasWallet) {
                      toast.warning("Please create a wallet first!");
                    } else if (!hasShop) {
                      toast.warning("Please create shop info first!");
                    }
                  }
                }}
                className={`
                  flex items-center px-4 py-3 rounded-xl
                  transition-all duration-200 group
                  ${
                    isPathActive(item.path) && !isDisabled
                      ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
              >
                <span
                  className={`w-5 h-5 mr-3 group-hover:scale-110 transition-transform ${
                    !isPathActive(item.path) && !isDisabled && "text-indigo-600"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
                {!hasShop && item.path === "/shop/create-profile" && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                    Required
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer with version info */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              FPT e-Laptop Program{" "}
              <span className="text-xs opacity-60">v1.2</span>
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
        <header
          className={`bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 transition-all duration-300 ${
            scrolled ? "shadow-xl" : "shadow-md"
          }`}
        >
          <div className="flex justify-between items-center h-16 px-4 md:px-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-800">
                {getPageTitle()}
              </h1>
              <div className="ml-3 hidden md:block">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  Shop Portal
                </span>
              </div>
              {!hasWallet && (
                <div className="ml-3">
                  <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium animate-pulse">
                    Wallet Required
                  </span>
                </div>
              )}
              {hasWallet && !hasShop && (
                <div className="ml-3">
                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium animate-pulse">
                    Setup Required
                  </span>
                </div>
              )}
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
            {!hasShop && location.pathname !== "/shop/create-profile" ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-red-100">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-50 text-red-500">
                  <FaStore className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Create Your Shop Profile First
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Before you can create a wallet and manage products, you need to set up your shop profile.
                </p>
                <Link
                  to="/shop/create-profile"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FaPlusCircle className="w-4 h-4 mr-2" />
                  Create shop profile
                </Link>
              </div>
            ) : hasShop && !hasWallet && location.pathname !== "/shop/create-profile" ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-amber-100">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-amber-50 text-amber-500">
                  <FaWallet className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Create a Wallet to Access Features
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Now that your shop is set up, you need to create a wallet to manage transactions.
                </p>
                <button
                  onClick={handleCreateWallet}
                  disabled={isCreatingWallet}
                  className={`inline-flex items-center px-6 py-3 
                    ${
                      isCreatingWallet
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5"
                    } text-white rounded-full transition-all shadow-md hover:shadow-lg`}
                >
                  {isCreatingWallet ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating wallet...
                    </>
                  ) : (
                    <>
                      <FaWallet className="w-4 h-4 mr-2" />
                      Create wallet
                    </>
                  )}
                </button>
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

export default ShopLayout;
