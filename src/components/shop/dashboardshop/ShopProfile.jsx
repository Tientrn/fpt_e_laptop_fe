import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import shopApi from "../../../api/shopApi";
import userApi from "../../../api/userApi";

const ShopProfile = () => {
  const [shop, setShop] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Vui lòng đăng nhập lại");
          return;
        }

        const decodedToken = jwtDecode(token);
        // Lấy userId trực tiếp từ token
        const userId = decodedToken.userId;

        console.log("Decoded token:", decodedToken);
        console.log("UserID:", userId);

        // Fetch shops trước
        const shopsResponse = await shopApi.getAllShops();
        console.log("Shops response:", shopsResponse);

        if (shopsResponse && shopsResponse.data) {
          const userShop = shopsResponse.data.find(
            (shop) => shop.userId === Number(userId)
          );
          console.log("Found shop:", userShop);
          
          if (userShop) {
            setShop(userShop);
            
            // Nếu tìm thấy shop, mới fetch user info
            try {
              const userResponse = await userApi.getUserById(userId);
              console.log("User response:", userResponse);
              if (userResponse && userResponse.data) {
                setUserInfo(userResponse.data);
              }
            } catch (userError) {
              console.error("Error fetching user:", userError);
              // Nếu không lấy được user info, vẫn hiển thị shop
              setUserInfo({
                email: "N/A",
                roleName: "Shop Owner",
                avatar: "https://via.placeholder.com/150"
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Không thể tải thông tin shop");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-amber-600 text-center">
          Shop Profile
        </h1>
        <div className="text-center py-10">
          <p className="text-red-500 text-lg mb-4">
            No shop profile found. Please create one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4 text-amber-600 text-center">
        Shop Profile
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Avatar and Basic Info */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 text-center">
          <div className="relative inline-block">
            <img
              src={userInfo?.avatar || "https://via.placeholder.com/150"}
              alt="Shop avatar"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto object-cover"
            />
            <span className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${
              shop.status === "Active" ? "bg-green-500" : "bg-red-500"
            } border-2 border-white`}></span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mt-3">{shop.shopName}</h2>
          <span className="inline-block mt-1 px-3 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
            {userInfo?.roleName || "Shop Owner"}
          </span>
        </div>

        {/* Shop Information Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">
                  Business Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Shop Name</p>
                    <p className="text-sm font-medium text-gray-800">{shop.shopName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p className="text-sm font-medium text-gray-800">{shop.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bank Account</p>
                    <p className="text-sm font-medium text-gray-800">{shop.bankNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{shop.shopPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">
                  Additional Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">{userInfo?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-800">{shop.shopAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tax Code</p>
                    <p className="text-sm font-medium text-gray-800">{shop.businessLicense}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      shop.status === "Active" 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    }`}>
                      {shop.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
