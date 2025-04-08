import React, { useEffect, useState } from "react";
import orderApis from "../../api/orderApi";
import { FaInfoCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const OrderStudent = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  // Decode token lấy userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = Number(decoded.userId);
        setUserId(id);
      } catch (error) {
        console.error("❌ Token decode failed:", error);
      }
    }
  }, []);

  // Fetch đơn hàng theo userId
  useEffect(() => {
    if (userId === null) return;

    const fetchOrders = async () => {
      try {
        const res = await orderApis.getAllOrders();
        if (res.isSuccess) {
          const allOrders = res.data;

          const userOrders = allOrders
            .filter((order) => Number(order.userId) === userId)
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

          setOrders(userOrders);
          setFilteredOrders(userOrders);
        }
      } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Filter theo trạng thái
  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orders]);

  const navigate = useNavigate(); // View detail handler

  const handleViewDetail = (order) => {
    navigate(`/student/orderdetail/${order.orderId}`);
  };

  // Cancel order handler (mock)
  const handleCancelOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này?"
    );
    if (!confirmDelete) return;

    try {
      // Bước 1: Lấy tất cả order details
      const resDetail = await orderApis.getAllOrderDetail();
      if (!resDetail?.isSuccess)
        throw new Error("Không thể lấy danh sách order detail");

      // Bước 2: Lọc ra orderDetail của order này
      const relatedDetails = resDetail.data.filter(
        (detail) => detail.orderId === orderId
      );

      // Bước 3: Xoá từng orderDetail
      for (const detail of relatedDetails) {
        await orderApis.deleteOrderDetail(detail.orderItemId);
      }

      // Bước 4: Xoá order chính
      const res = await orderApis.deleteOrder(orderId);
      if (res?.isSuccess || res?.code === 200 || res?.code === 204) {
        toast.success(`🗑️ Đã huỷ đơn hàng #${orderId}`);
        setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      } else {
        toast.error("❌ Hủy đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi huỷ đơn hàng:", error);
      toast.error("❌ Hủy đơn hàng thất bại do lỗi hệ thống!");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">Your Orders</h1>

      {/* Filter dropdown */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 mr-2">
          Filter by status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded px-3 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Processing">Processing</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-600">Đang tải đơn hàng...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="text-slate-600 flex items-center space-x-2">
          <FaInfoCircle className="text-amber-600" />
          <span>Không có đơn hàng nào phù hợp.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-slate-200 rounded-xl shadow">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm text-black">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-sm text-black">
                  Ngày tạo
                </th>
                <th className="text-left px-4 py-3 text-sm text-black">
                  Tổng tiền
                </th>
                <th className="text-left px-4 py-3 text-sm text-black">
                  Địa chỉ
                </th>
                <th className="text-left px-4 py-3 text-sm text-black">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 text-sm text-black">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-slate-50 border-b border-slate-100"
                >
                  <td className="px-4 py-3 text-sm text-black">
                    {order.orderId}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {new Date(order.createdDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {order.totalPrice.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {order.orderAddress}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                        order.status.toLowerCase() === "pending"
                          ? "bg-amber-600"
                          : order.status.toLowerCase() === "cancelled"
                          ? "bg-red-600"
                          : order.status.toLowerCase() === "approved"
                          ? "bg-green-600"
                          : "bg-slate-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleViewDetail(order)}
                      className="px-3 py-1 text-sm rounded bg-slate-600 text-white hover:bg-slate-700"
                    >
                      View
                    </button>
                    {order.status.toLowerCase() === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default OrderStudent;
