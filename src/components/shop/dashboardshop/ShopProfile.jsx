import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import shopApi from "../../../api/shopApi";
import userApi from "../../../api/userApi";
import { FaStoreAlt, FaUserCircle, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaIdCard, FaUniversity, FaCreditCard } from "react-icons/fa";
import { MdVerified, MdErrorOutline } from "react-icons/md";
import PropTypes from "prop-types";

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
          toast.error("Unable to load shop information");
        }

      } catch (error) {
        console.error("Main error:", error);
        toast.error(error.message || "An error occurred while loading information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-indigo-600 font-medium animate-pulse">Loading profile...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Shop Profile</h1>
              <p className="text-white/80">Your shop information could not be found</p>
            </div>
            
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">Please create a new shop profile to continue using our platform&apos;s seller features.</p>
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
                  {shop.status === "Active" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </span>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:flex-row items-center md:items-end justify-between w-full">
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center md:justify-start">
                    <FaStoreAlt className="mr-2 text-white/80" /> 
                    {shop.shopName}
                  </h1>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                    {shop.status === "Active" ? (
                      <MdVerified className="mr-1.5 text-white" />
                    ) : (
                      <MdErrorOutline className="mr-1.5 text-white" />
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
                        <MdVerified className="text-indigo-500 text-xl" />
                      ) : (
                        <MdErrorOutline className="text-indigo-500 text-xl" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <span className="text-sm text-gray-500 block mb-1">Status</span>
                      <span
                        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                          shop.status === "Active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {shop.status === "Active" ? (
                          <MdVerified className="mr-1" />
                        ) : (
                          <MdErrorOutline className="mr-1" />
                        )}
                        {shop.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shop Stats Summary (you could add this as an enhancement) */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Products", value: "0", color: "from-indigo-400 to-indigo-500" },
                { label: "Orders", value: "0", color: "from-purple-400 to-purple-500" },
                { label: "Revenue", value: "0₫", color: "from-violet-400 to-violet-500" },
                { label: "Rating", value: "N/A", color: "from-amber-400 to-amber-500" }
              ].map((stat, index) => (
                <div key={index} className={`bg-gradient-to-r ${stat.color} rounded-xl p-4 text-white shadow-md`}>
                  <h4 className="text-white/80 text-sm font-medium">{stat.label}</h4>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
            
            {/* Edit Profile Button */}
            <div className="mt-8 text-center">
              <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Edit Shop Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable InfoItem component for displaying profile information
const InfoItem = ({ icon, label, value, isSensitive = false }) => {
  // For sensitive information like account numbers, we can mask part of it
  const displayValue = isSensitive && value ? 
    value.slice(0, 4) + "•".repeat(Math.max(0, value.length - 8)) + value.slice(-4) : 
    value;
    
  return (
    <div className="flex items-start group">
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
        {icon}
      </div>
      <div className="ml-4 flex-1">
        <span className="text-sm text-gray-500 block mb-1">{label}</span>
        <span className="text-base font-medium text-gray-800">{displayValue || "N/A"}</span>
      </div>
    </div>
  );
};

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  isSensitive: PropTypes.bool
};

export default ShopProfile;
