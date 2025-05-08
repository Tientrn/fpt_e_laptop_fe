import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import shopApi from "../../../api/shopApi";
import userApi from "../../../api/userApi";
import walletApi from "../../../api/walletApi";
import {
  FaStoreAlt,
  FaUserCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard,
  FaUniversity,
  FaCreditCard,
  FaWallet,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import { MdVerified, MdErrorOutline } from "react-icons/md";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ShopProfile = () => {
  const [shop, setShop] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          if (userRes && userRes.isSuccess) {
            // Thay đổi điều kiện kiểm tra
            setUserInfo({
              email: decodedToken.email,
              fullName: decodedToken.fullName,
              roleName: decodedToken.role,
              avatar: userRes.data?.avatar || null,
            });
          } else {
            // Nếu không lấy được từ API, dùng thông tin từ token
            setUserInfo({
              email: decodedToken.email,
              fullName: decodedToken.fullName,
              roleName: decodedToken.role,
              avatar: null,
            });
          }
        } catch (userError) {
          console.error("Error fetching user:", userError);
          // Vẫn set userInfo từ token nếu API lỗi
          setUserInfo({
            email: decodedToken.email,
            fullName: decodedToken.fullName,
            roleName: decodedToken.role,
            avatar: null,
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
          toast.error("Unable to load shop information");
        }

        // Lấy thông tin ví
        try {
          const walletRes = await walletApi.getWallet();
          console.log("Wallet Response:", walletRes);

          if (walletRes && walletRes.data) {
            const userWallet = walletRes.data.find(
              (w) => w.userId === Number(userId)
            );
            console.log("Found wallet:", userWallet);
            setWalletInfo(userWallet || null);
          }
        } catch (walletError) {
          console.error("Error fetching wallet:", walletError);
          toast.error("Unable to load wallet information");
        }
      } catch (error) {
        console.error("Main error:", error);
        toast.error(
          error.message || "An error occurred while loading information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-indigo-600 font-medium animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!shop || !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
            <div className="bg-gradient-to-r from-red-500 to-indigo-900 p-8 text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <MdErrorOutline className="text-white text-5xl" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Shop Profile
              </h1>
              <p className="text-white/80">
                Your shop information could not be found
              </p>
            </div>

            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                Please create a new shop profile to continue using our
                platform&apos;s seller features.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Create Shop Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 transition-all hover:shadow-2xl">
          {/* Banner & Profile Header */}
          <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 h-48 flex items-end">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="flex flex-col md:flex-row items-center md:items-end p-6 w-full relative z-10">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-white -mt-12 md:mt-0 md:-mb-12 flex-shrink-0 relative overflow-hidden">
                <img
                  src={userInfo.avatar || "https://via.placeholder.com/150"}
                  alt={`${shop.shopName} profile`}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute bottom-1 right-1 w-5 h-5 rounded-full ${
                    shop.status === "Active" ? "bg-green-500" : "bg-red-500"
                  } border-2 border-white flex items-center justify-center`}
                >
                  {shop.status === "Active" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </span>
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:flex-row items-center md:items-end justify-between w-full">
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center md:justify-start">
                    <FaStoreAlt className="mr-2 text-white/80" />
                    {shop.shopName}
                  </h1>
                  <div
                    className={`mt-2 inline-flex items-center px-3 py-1 rounded-full ${
                      shop.status === "Active"
                        ? "bg-green-500/20 backdrop-blur-sm text-green-100"
                        : "bg-red-500/20 backdrop-blur-sm text-red-100"
                    }`}
                  >
                    {shop.status === "Active" ? (
                      <MdVerified className="mr-1.5 text-green-100" />
                    ) : (
                      <MdErrorOutline className="mr-1.5 text-red-100" />
                    )}
                    {shop.status}
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm shadow-sm">
                    {userInfo.roleName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Wallet Summary Card */}
            {walletInfo && (
              <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-lg transform transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="p-6 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center">
                      <FaWallet className="mr-2" />
                      Shop Wallet
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        walletInfo.status === "Active"
                          ? "bg-green-500/20 text-green-100"
                          : "bg-red-500/20 text-red-100"
                      }`}
                    >
                      {walletInfo.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-white/70 text-sm mb-1 flex items-center">
                        <FaMoneyBillWave className="mr-2" />
                        Current Balance
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(walletInfo.balance)}
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-white/70 text-sm mb-1 flex items-center">
                        <FaTag className="mr-2" />
                        Wallet Type
                      </div>
                      <div className="text-2xl font-bold">
                        {walletInfo.type}
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-white/70 text-sm mb-1 flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        Created Date
                      </div>
                      <div className="text-lg font-medium">
                        {formatDate(walletInfo.createdDate)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium transition-all hover:bg-indigo-50 flex items-center"
                      onClick={() => navigate("/shop/wallet")}
                    >
                      <FaWallet className="mr-2" />
                      Manage Wallet
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Business Information Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="bg-indigo-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <FaIdCard className="mr-2" />
                    Business Information
                  </h3>
                </div>

                <div className="p-6 space-y-5">
                  <InfoItem
                    icon={<FaStoreAlt className="text-indigo-500" />}
                    label="Shop Name"
                    value={shop.shopName}
                  />

                  <InfoItem
                    icon={<FaUniversity className="text-indigo-500" />}
                    label="Bank Name"
                    value={shop.bankName}
                  />

                  <InfoItem
                    icon={<FaCreditCard className="text-indigo-500" />}
                    label="Account Number"
                    value={shop.bankNumber}
                    isSensitive
                  />

                  <InfoItem
                    icon={<FaPhoneAlt className="text-indigo-500" />}
                    label="Phone Number"
                    value={shop.shopPhone}
                  />
                </div>
              </div>

              {/* Additional Information Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="bg-indigo-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <FaUserCircle className="mr-2" />
                    Additional Information
                  </h3>
                </div>

                <div className="p-6 space-y-5">
                  <InfoItem
                    icon={<FaEnvelope className="text-indigo-500" />}
                    label="Email"
                    value={userInfo.email}
                  />

                  <InfoItem
                    icon={<FaMapMarkerAlt className="text-indigo-500" />}
                    label="Address"
                    value={shop.shopAddress}
                  />

                  <InfoItem
                    icon={<FaIdCard className="text-indigo-500" />}
                    label="Tax Code"
                    value={shop.businessLicense}
                  />

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      {shop.status === "Active" ? (
                        <MdVerified className="text-green-600 text-lg" />
                      ) : (
                        <MdErrorOutline className="text-red-500 text-lg" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-gray-700 text-sm font-medium">
                        Status
                      </h4>
                      <p
                        className={`text-base ${
                          shop.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {shop.status}
                      </p>
                    </div>
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

// Info Item Component
const InfoItem = ({ icon, label, value, isSensitive = false }) => {
  // Mask sensitive information like account numbers
  const maskValue = (val) => {
    if (!val) return "N/A";
    if (typeof val !== "string") val = String(val);

    // Mask all but last 4 characters
    const visible = val.slice(-4);
    const masked = "*".repeat(val.length - 4);
    return masked + visible;
  };

  return (
    <div className="flex items-start">
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="ml-4 flex-1">
        <h4 className="text-gray-700 text-sm font-medium">{label}</h4>
        <p className="text-gray-800 text-base">
          {isSensitive ? maskValue(value) : value || "N/A"}
        </p>
      </div>
    </div>
  );
};

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isSensitive: PropTypes.bool,
};

export default ShopProfile;
