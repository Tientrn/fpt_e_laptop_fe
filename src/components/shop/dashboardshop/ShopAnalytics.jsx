import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBoxOpen,
  FaClipboardCheck,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";

const ShopAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`/api/analytics/shop/${user.userId}`);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchAnalytics();
  }, [user?.userId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-amber-600">Shop Analytics</h1>
      {loading ? (
        <p>Loading...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow border border-slate-200 rounded-lg p-4 flex items-center gap-4">
            <FaBoxOpen className="text-3xl text-amber-500" />
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-xl font-bold text-black">
                {stats.totalProducts}
              </p>
            </div>
          </div>

          <div className="bg-white shadow border border-slate-200 rounded-lg p-4 flex items-center gap-4">
            <FaClipboardCheck className="text-3xl text-amber-500" />
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-black">
                {stats.totalOrders}
              </p>
            </div>
          </div>

          <div className="bg-white shadow border border-slate-200 rounded-lg p-4 flex items-center gap-4">
            <FaDollarSign className="text-3xl text-amber-500" />
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-black">
                ${stats.totalRevenue}
              </p>
            </div>
          </div>

          <div className="bg-white shadow border border-slate-200 rounded-lg p-4 flex items-center gap-4">
            <FaUsers className="text-3xl text-amber-500" />
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-xl font-bold text-black">
                {stats.totalCustomers}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default ShopAnalytics;
