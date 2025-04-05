import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/shop/${user.userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchOrders();
  }, [user?.userId]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "approved":
        return <FaCheckCircle className="text-green-600" />;
      case "rejected":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-amber-600">Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-slate-200 rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Order #{order.id}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Customer: {order.customerName}
                  </p>
                  <p className="text-sm text-gray-600">Date: {order.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium capitalize">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                Total: ${order.totalAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopOrders;
