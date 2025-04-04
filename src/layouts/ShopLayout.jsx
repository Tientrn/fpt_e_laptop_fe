import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaBoxOpen,
  FaClipboardCheck,
  FaChartPie,
  FaSignOutAlt,
  FaBars,
  FaStore,
  FaPlusSquare,
  FaPlusCircle,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import shopApi from "../api/shopApi";

const ShopLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasShop, setHasShop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isShop = user?.roles?.includes("shop") || user?.roleId === 6;

  useEffect(() => {
    const checkShopExists = async () => {
      try {
        const userId = user?.userId;
        if (!userId) return;

        const shopsResponse = await shopApi.getAllShops();
        if (shopsResponse && shopsResponse.data) {
          const existingShop = shopsResponse.data.find(
            shop => shop.userId === Number(userId)
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

  const getMenuItems = () => {
    const baseMenuItems = [
      {
        path: "/shop/profile",
        name: "Shop Profile",
        icon: <FaUserCircle className="w-5 h-5" />,
        requiresShop: true
      },
      {
        path: "/shop/products",
        name: "My Products",
        icon: <FaBoxOpen className="w-5 h-5" />,
        requiresShop: true
      },
      {
        path: "/shop/orders",
        name: "Orders",
        icon: <FaClipboardCheck className="w-5 h-5" />,
        requiresShop: true
      },
      {
        path: "/shop/add-product",
        name: "Add Product",
        icon: <FaPlusSquare className="w-5 h-5" />,
        requiresShop: true
      },
      {
        path: "/shop/analytics",
        name: "Analytics",
        icon: <FaChartPie className="w-5 h-5" />,
        requiresShop: true
      }
    ];

    if (!hasShop) {
      baseMenuItems.splice(1, 0, {
        path: "/shop/create-profile",
        name: "Create Shop Info",
        icon: <FaPlusCircle className="w-5 h-5" />,
        requiresShop: false
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

  if (!isShop) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h1 className="text-2xl font-semibold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You are not authorized to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-16"
        } bg-slate-600 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-500">
          <h2 className={`text-xl font-semibold ${!isSidebarOpen && "hidden"}`}>
            Shop Dashboard
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 flex-1">
          {getMenuItems().map((item) => {
            const isDisabled = item.requiresShop && !hasShop;
            
            return (
              <Link
                key={item.path}
                to={isDisabled ? "#" : item.path}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    toast.warning("Vui lòng tạo thông tin shop trước!");
                  }
                }}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-amber-600 text-white"
                    : "text-white hover:bg-slate-700"
                } ${
                  isDisabled 
                    ? "opacity-50 cursor-not-allowed" 
                    : "cursor-pointer"
                } transition-colors`}
              >
                {item.icon}
                <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-amber-600 font-medium">
              {!hasShop && "Vui lòng tạo thông tin shop để tiếp tục"}
            </div>
            <div className="p-4 border-slate-500">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-black hover:bg-teal-600 transition-colors"
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="p-6">
            {!hasShop && location.pathname !== "/shop/create-profile" ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Bạn cần tạo thông tin shop trước khi sử dụng các tính năng khác
                </h2>
                <Link
                  to="/shop/create-profile"
                  className="inline-block bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Tạo thông tin shop
                </Link>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShopLayout;
