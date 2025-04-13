import { useEffect, useState } from "react";
import orderApis from "../../api/orderApi";
import { FaInfoCircle, FaShoppingBag, FaEye, FaTimesCircle, FaSpinner, FaSearch, FaFilter } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter và search
  useEffect(() => {
    let result = orders;
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(
        (order) => 
          order.orderId.toString().includes(searchTerm) ||
          order.orderAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(result);
  }, [statusFilter, searchTerm, orders]);

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

  const getStatusBadgeStyle = (status) => {
    const baseStyle = "px-3 py-1 rounded-full text-white text-xs font-semibold";
    switch (status.toLowerCase()) {
      case "pending":
        return `${baseStyle} bg-yellow-500`;
      case "cancelled":
        return `${baseStyle} bg-red-500`;
      case "approved":
      case "delivered":
        return `${baseStyle} bg-green-500`;
      case "processing":
        return `${baseStyle} bg-indigo-500`;
      default:
        return `${baseStyle} bg-gray-500`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
          <p className="mt-3 text-indigo-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaShoppingBag className="mr-3" /> Your Orders
            </h1>
            <p className="text-indigo-100 mt-1">Manage and track your purchases</p>
          </div>

          {/* Search and Filter */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by order ID or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-indigo-400 mb-4">
                  <FaInfoCircle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "All" 
                    ? "No orders match your current filters. Try changing your search criteria."
                    : "You haven't placed any orders yet. Start shopping to see orders here!"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(order.createdDate).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.totalPrice.toLocaleString()} đ
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                            {order.orderAddress}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadgeStyle(order.status)}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetail(order)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <FaEye className="mr-1" />
                              View
                            </button>
                            {order.status.toLowerCase() === "pending" && (
                              <button
                                onClick={() => handleCancelOrder(order.orderId)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <FaTimesCircle className="mr-1" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
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
