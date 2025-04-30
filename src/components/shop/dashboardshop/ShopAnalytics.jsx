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
} from "react-icons/fa";
import { toast } from "react-toastify";
import productApi from "../../../api/productApi";
import shopApi from "../../../api/shopApi";
import orderApi from "../../../api/orderApi";

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

        // Cập nhật stats
        setStats(prevStats => ({
          ...prevStats,
          totalProducts: shopProducts.length,
          totalOrders: shopOrders.length,
          totalRevenue: totalRevenue,
          // Các thống kê khác có thể được thêm vào sau
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

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
        {trend && (
          <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shop Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaBoxOpen}
          title="Total Products"
          value={stats.totalProducts}
          color="text-blue-500"
          trend={5}
        />
        <StatCard
          icon={FaShoppingCart}
          title="Total Orders"
          value={stats.totalOrders}
          color="text-green-500"
          trend={12}
        />
        <StatCard
          icon={FaDollarSign}
          title="Revenue"
          value={`${stats.totalRevenue.toLocaleString()} đ`}
          color="text-amber-500"
          trend={8}
        />
        <StatCard
          icon={FaUsers}
          title="Customers"
          value={stats.totalCustomers}
          color="text-purple-500"
          trend={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Sales Overview</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-amber-100 text-amber-600 rounded-lg">
                Week
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg">
                Month
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg">
                Year
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will be implemented here
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaShoppingCart className="text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaStar className="text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">New review received</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FaRegClock className="text-amber-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Product updated</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAnalytics;
