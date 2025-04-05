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
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-amber-600 text-center">
        Shop Profile
      </h1>

      {loading ? (
        <p className="text-center text-slate-600">Loading...</p>
      ) : shop && userInfo ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow p-8 space-y-6">
          <div className="flex items-center space-x-6">
            <img
              src={userInfo.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full border-2 border-slate-300"
            />
            <div>
              <h2 className="text-xl font-semibold text-black">
                {userInfo.fullName}
              </h2>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
              <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                {userInfo.roleName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Shop Name</p>
              <p className="text-base font-medium text-black">
                {shop.shopName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base text-gray-800">{shop.shopPhone}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-base text-gray-800">{shop.shopAddress}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Business License</p>
              <p className="text-base text-gray-800">{shop.businessLicense}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="text-base text-gray-800">{shop.bankName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Bank Number</p>
              <p className="text-base text-gray-800">{shop.bankNumber}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p
                className={`text-base font-semibold ${
                  shop.status === "active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {shop.status}
              </p>
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
