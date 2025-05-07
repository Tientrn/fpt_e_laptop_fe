import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaBoxOpen,
  FaClipboardCheck,
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaShoppingCart,
  FaStar,
  FaRegClock,
  FaArrowUp,
  FaArrowDown,
  FaChevronRight,
  FaRegCalendarAlt,
  FaStore,
} from "react-icons/fa";
import { toast } from "react-toastify";
import productApi from "../../../api/productApi";
import shopApi from "../../../api/shopApi";
import orderApi from "../../../api/orderApi";
import PropTypes from 'prop-types';

const ShopAnalytics = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageRating: 0,
    pendingOrders: 0,
    recentSales: 0,
  });
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy token và decode để xác định user
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        // Lấy thông tin shop của user
        const shopsRes = await shopApi.getAllShops();
        if (!shopsRes || !shopsRes.isSuccess) {
          throw new Error("Failed to fetch shops");
        }

        const userShop = shopsRes.data.find(
          (shop) => shop.userId === Number(userId)
        );

        if (!userShop) {
          throw new Error("Shop not found for this user");
        }

        setShopId(userShop.shopId);

        // Lấy tất cả sản phẩm
        const productsRes = await productApi.getAllProducts();
        if (!productsRes || !productsRes.isSuccess) {
          throw new Error("Failed to fetch products");
        }

        // Lọc sản phẩm thuộc về shop của user
        const shopProducts = productsRes.data.filter(
          (product) => product.shopId === userShop.shopId
        );

        // Lấy tất cả đơn hàng
        const ordersRes = await orderApi.getAllOrders();
        if (!ordersRes || !ordersRes.isSuccess) {
          throw new Error("Failed to fetch orders");
        }

        // Lọc đơn hàng có sản phẩm thuộc về shop của user
        const shopOrders = ordersRes.data.filter(order => 
          order.orderDetails.some(detail => 
            shopProducts.some(product => product.productId === detail.productId)
          )
        );

        // Tính tổng doanh thu từ các đơn hàng
        const totalRevenue = shopOrders.reduce((sum, order) => {
          const orderTotal = order.orderDetails.reduce((orderSum, detail) => {
            const product = shopProducts.find(p => p.productId === detail.productId);
            return orderSum + (product ? product.price * detail.quantity : 0);
          }, 0);
          return sum + orderTotal;
        }, 0);

        // Đếm số khách hàng độc lập
        const uniqueCustomers = new Set(shopOrders.map(order => order.userId)).size;

        // Đếm số đơn hàng đang chờ xử lý
        const pendingOrders = shopOrders.filter(order => 
          order.status === "Pending" || order.status === "Processing"
        ).length;

        // Cập nhật stats
        setStats(prevStats => ({
          ...prevStats,
          totalProducts: shopProducts.length,
          totalOrders: shopOrders.length,
          totalRevenue: totalRevenue,
          totalCustomers: uniqueCustomers || 0,
          pendingOrders: pendingOrders || 0,
          // Thêm giá trị mẫu cho rating 
          averageRating: 4.7,
          // Thêm giá trị mẫu cho doanh số gần đây
          recentSales: Math.round(totalRevenue * 0.3)
        }));

      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "An error occurred while loading analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mẫu dữ liệu chart (sẽ thay thế bằng dữ liệu thực sau này)
  const sampleChartData = {
    week: [
      { date: "Mon", sales: 12000 },
      { date: "Tue", sales: 19000 },
      { date: "Wed", sales: 15000 },
      { date: "Thu", sales: 22000 },
      { date: "Fri", sales: 28000 },
      { date: "Sat", sales: 33000 },
      { date: "Sun", sales: 24000 },
    ],
    month: [
      { date: "Week 1", sales: 85000 },
      { date: "Week 2", sales: 97000 },
      { date: "Week 3", sales: 125000 },
      { date: "Week 4", sales: 110000 },
    ],
    year: [
      { date: "Jan", sales: 340000 },
      { date: "Feb", sales: 290000 },
      { date: "Mar", sales: 430000 },
      { date: "Apr", sales: 380000 },
      { date: "May", sales: 410000 },
      { date: "Jun", sales: 495000 },
      { date: "Jul", sales: 520000 },
      { date: "Aug", sales: 490000 },
      { date: "Sep", sales: 550000 },
      { date: "Oct", sales: 610000 },
      { date: "Nov", sales: 680000 },
      { date: "Dec", sales: 720000 },
    ],
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor, trend, isLoading }) => (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
      <div className="flex h-full">
        <div className={`${bgColor} w-1.5`}></div>
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${bgColor}`}>
              <Icon className={`text-xl ${color}`} />
            </div>
            {!isLoading && trend !== undefined && (
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                trend >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {trend >= 0 ? <FaArrowUp className="mr-1 text-xs" /> : <FaArrowDown className="mr-1 text-xs" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            {isLoading ? (
              <div className="h-7 bg-gray-200 animate-pulse rounded mt-1 w-20"></div>
            ) : (
              <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    trend: PropTypes.number,
    isLoading: PropTypes.bool
  };

  const TimeRangeButton = ({ range, current, onClick, children }) => (
    <button 
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
        range === current 
          ? 'bg-indigo-100 text-indigo-600 font-medium' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      onClick={() => onClick(range)}
    >
      {children}
    </button>
  );

  TimeRangeButton.propTypes = {
    range: PropTypes.string.isRequired,
    current: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  };

  const ChartBar = ({ label, value, maxValue, color }) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">{label}</span>
          <span className="text-xs font-medium">{value.toLocaleString()}đ</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-1000 ease-out`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  ChartBar.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  };

  const ActivityItem = ({ icon: Icon, title, time, color, bgColor, isNew }) => (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group relative">
      {isNew && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500"></span>
      )}
      <div className={`p-2.5 rounded-full ${bgColor}`}>
        <Icon className={`text-sm ${color}`} />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <FaChevronRight className="text-gray-300 group-hover:text-gray-400 transition-colors" />
    </div>
  );

  ActivityItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    isNew: PropTypes.bool
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-indigo-200 border-opacity-50 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-indigo-600 font-medium animate-pulse">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const currentData = sampleChartData[timeRange];
  const maxSales = Math.max(...currentData.map(item => item.sales));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl shadow-lg mb-8 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center">
              <FaStore className="text-3xl mr-4 text-white/80" />
    <div>
                <h1 className="text-2xl md:text-3xl font-bold">Shop Analytics</h1>
                <p className="text-indigo-200 mt-1">View your store&apos;s performance metrics</p>
              </div>
            </div>
            <div className="flex items-center mt-4 md:mt-0 bg-white/10 backdrop-blur-sm py-2 px-4 rounded-lg">
              <FaRegCalendarAlt className="text-indigo-100 mr-2" />
              <p className="text-sm text-indigo-50">
                Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            icon={FaBoxOpen}
            title="Total Products"
            value={stats.totalProducts.toLocaleString()}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
            trend={5}
            isLoading={loading}
          />
          <StatCard
            icon={FaShoppingCart}
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            color="text-purple-600"
            bgColor="bg-purple-100"
            trend={12}
            isLoading={loading}
          />
          <StatCard
            icon={FaDollarSign}
            title="Total Revenue"
            value={`${stats.totalRevenue.toLocaleString()} đ`}
            color="text-amber-600"
            bgColor="bg-amber-100"
            trend={8}
            isLoading={loading}
          />
          <StatCard
            icon={FaRegClock}
            title="Pending Orders"
            value={stats.pendingOrders.toLocaleString()}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
            trend={-3}
            isLoading={loading}
          />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-md lg:col-span-2 overflow-hidden border border-indigo-100">
            <div className="border-b px-6 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <FaChartLine className="mr-2 text-indigo-500" />
                  Sales Overview
                </h2>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <TimeRangeButton 
                    range="week" 
                    current={timeRange} 
                    onClick={setTimeRange}
                  >
                    Week
                  </TimeRangeButton>
                  <TimeRangeButton 
                    range="month" 
                    current={timeRange} 
                    onClick={setTimeRange}
                  >
                    Month
                  </TimeRangeButton>
                  <TimeRangeButton 
                    range="year" 
                    current={timeRange} 
                    onClick={setTimeRange}
                  >
                    Year
                  </TimeRangeButton>
                </div>
            </div>
          </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 font-medium">Revenue Overview</p>
                  <p className="text-sm font-bold text-indigo-600">
                    {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Year'}
                  </p>
                </div>
                <div className="mt-1 flex items-end space-x-1">
                  <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} đ</p>
                  <p className="text-sm text-green-500 pb-1 flex items-center">
                    <FaArrowUp className="mr-1" /> 8%
                  </p>
                </div>
              </div>
              
              <div className="space-y-5">
                {currentData.map((item, index) => (
                  <ChartBar 
                    key={index}
                    label={item.date}
                    value={item.sales}
                    maxValue={maxSales}
                    color={
                      index % 3 === 0 ? "bg-indigo-500" :
                      index % 3 === 1 ? "bg-purple-500" :
                      "bg-amber-500"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="grid grid-cols-1 gap-6">
            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-indigo-100">
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 px-5 py-3">
                <h2 className="text-lg font-bold text-white">Quick Stats</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Average Rating</p>
                    <div className="flex items-center mt-1">
                      <p className="text-xl font-bold mr-2">{stats.averageRating}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`text-sm ${i < Math.floor(stats.averageRating) ? 'text-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FaStar className="text-amber-600" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
                    <p className="text-sm text-gray-500">Unique Customers</p>
                    <p className="text-xl font-bold mt-1">{stats.totalCustomers}</p>
                  </div>
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FaUsers className="text-indigo-600" />
            </div>
          </div>

                <div className="flex justify-between items-center">
            <div>
                    <p className="text-sm text-gray-500">Recent 7-Day Sales</p>
                    <p className="text-xl font-bold mt-1">{stats.recentSales.toLocaleString()} đ</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaDollarSign className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-indigo-100">
              <div className="border-b px-5 py-3 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                  3 new
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                <ActivityItem
                  icon={FaShoppingCart}
                  title="New order #1234 received"
                  time="2 hours ago"
                  color="text-purple-600"
                  bgColor="bg-purple-100"
                  isNew={true}
                />
                <ActivityItem
                  icon={FaStar}
                  title="New 5-star review from Customer"
                  time="5 hours ago"
                  color="text-amber-600"
                  bgColor="bg-amber-100"
                  isNew={true}
                />
                <ActivityItem
                  icon={FaDollarSign}
                  title="Payment of 2,500,000đ received"
                  time="Yesterday"
                  color="text-indigo-600"
                  bgColor="bg-indigo-100"
                  isNew={true}
                />
                <ActivityItem
                  icon={FaBoxOpen}
                  title="Inventory updated for 5 products"
                  time="2 days ago"
                  color="text-purple-600"
                  bgColor="bg-purple-100"
                  isNew={false}
                />
              </div>
              <div className="p-3 border-t">
                <button className="w-full py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAnalytics;
