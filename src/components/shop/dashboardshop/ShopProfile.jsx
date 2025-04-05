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
        // Lấy token và decode
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);

        // Lấy userId trực tiếp từ token
        const userId = decodedToken.userId || "15"; // Lấy trực tiếp từ token hoặc sử dụng giá trị mặc định
        console.log("UserID:", userId);

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        // Lấy thông tin user
        try {
          const userRes = await userApi.getUserById(userId);
          console.log("User Response:", userRes);
          if (userRes && userRes.isSuccess) { // Thay đổi điều kiện kiểm tra
            setUserInfo({
              email: decodedToken.email,
              fullName: decodedToken.fullName,
              roleName: decodedToken.role,
              avatar: userRes.data?.avatar || null
            });
          } else {
            // Nếu không lấy được từ API, dùng thông tin từ token
            setUserInfo({
              email: decodedToken.email,
              fullName: decodedToken.fullName,
              roleName: decodedToken.role,
              avatar: null
            });
          }
        } catch (userError) {
          console.error("Error fetching user:", userError);
          // Vẫn set userInfo từ token nếu API lỗi
          setUserInfo({
            email: decodedToken.email,
            fullName: decodedToken.fullName,
            roleName: decodedToken.role,
            avatar: null
          });
        }

        // Lấy thông tin shop
        try {
          const shopsRes = await shopApi.getAllShops();
          console.log("Shops Response:", shopsRes);
          
          if (shopsRes && shopsRes.data) {
            const userShop = shopsRes.data.find(
              (s) => s.userId === Number(userId)
            );
            console.log("Found shop:", userShop);
            setShop(userShop || null);
          } else {
            throw new Error("No shops data received");
          }
        } catch (shopError) {
          console.error("Error fetching shops:", shopError);
          toast.error("Không thể tải thông tin shop");
        }

      } catch (error) {
        console.error("Main error:", error);
        toast.error(error.message || "Có lỗi xảy ra khi tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!shop || !userInfo) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mt-2 mb-4 text-amber-600 text-center">
          Shop Profile
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-500 font-medium">
            Không tìm thấy thông tin shop. Vui lòng tạo mới.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-8 text-amber-600 text-center">
        Shop Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with Avatar and Basic Info */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-8 text-center">
          <div className="relative inline-block">
            <img
              src={userInfo.avatar || "https://via.placeholder.com/150"}
              alt="Shop avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto object-cover"
            />
            <span 
              className={`absolute bottom-2 right-2 w-4 h-4 rounded-full ${
                shop.status === "Active" ? "bg-red-500" : "bg-green-500"
              } border-2 border-white`}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            {shop.shopName}
          </h2>
          <span className="inline-block mt-2 px-4 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
            {userInfo.roleName}
          </span>
        </div>

        {/* Shop Information Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Thông tin kinh doanh */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Thông tin kinh doanh
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên shop</p>
                    <p className="text-base font-medium text-gray-800">
                      {shop.shopName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tên ngân hàng</p>
                    <p className="text-base font-medium text-gray-800">
                      {shop.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số tài khoản</p>
                    <p className="text-base font-medium text-gray-800">
                      {shop.bankNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-base font-medium text-gray-800">
                      {shop.shopPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Thông tin bổ sung */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Thông tin bổ sung
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-800">
                      {userInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="text-base font-medium text-gray-800">
                      {shop.shopAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã số thuế</p>
                    <p className="text-base font-medium text-gray-800">
                      {shop.businessLicense}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        shop.status === "Active"
                          ? "bg-green-100 text-red-700"
                          : "bg-red-100 text-green-700"
                      }`}
                    >
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
