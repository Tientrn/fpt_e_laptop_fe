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
        const decodedToken = jwtDecode(token);
        const userId = Number(
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ]
        );

        const userRes = await userApi.getUserById(userId);
        const user = userRes.data;
        setUserInfo(user);

        const allShops = await shopApi.getAllShops();
        const shopData = allShops?.data?.find((s) => s.userId === userId);
        setShop(shopData || null);
      } catch (error) {
        console.error("Failed to load user or shop info:", error);
        toast.error("Không thể tải thông tin người dùng hoặc shop.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-amber-600 text-center">
        Shop Profile
      </h1>

      {loading ? (
        <p className="text-center text-slate-600">Loading...</p>
      ) : shop && userInfo ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header with Avatar and Basic Info */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-8 text-center">
            <div className="relative inline-block">
              <img
                src={userInfo.avatar}
                alt="Shop avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto"
              />
              <span className={`absolute bottom-2 right-2 w-4 h-4 rounded-full ${
                shop.status === "active" ? "bg-green-500" : "bg-red-500"
              } border-2 border-white`}></span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{shop.shopName}</h2>
            <p className="text-gray-600">{userInfo.email}</p>
            <span className="inline-block mt-2 px-4 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
              {userInfo.roleName}
            </span>
          </div>

          {/* Shop Information Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    Business Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Shop Name</p>
                      <p className="text-base font-medium text-gray-800">{shop.shopName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bank Name</p>
                      <p className="text-base font-medium text-gray-800">{shop.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bank Number</p>
                      <p className="text-base font-medium text-gray-800">{shop.bankNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-base font-medium text-gray-800">{shop.shopPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    Additional Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-base font-medium text-gray-800">{shop.shopAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business License</p>
                      <p className="text-base font-medium text-gray-800">{shop.businessLicense}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        shop.status === "active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
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
      ) : (
        <p className="text-red-500 text-center">
          No shop profile found. Please create one.
        </p>
      )}
    </div>
  );
};

export default ShopProfile;
