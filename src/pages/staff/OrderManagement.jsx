import React, { useState, useEffect } from "react";
import orderApis from "../../api/orderApi";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài đặt và import react-toastify
import { FaBoxOpen, FaTrash } from "react-icons/fa";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderApis.getAllOrders();
      if (response.data) {
        // Sắp xếp đơn hàng mới nhất lên trên cùng
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý click nút delete
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      setIsLoading(true);

      // Gọi API xóa order
      const response = await orderApis.deleteOrder(orderToDelete.orderId);

      if (response && response.isSuccess) {
        // Xóa thành công, cập nhật UI
        toast.success("Order deleted successfully");

        // Cập nhật lại danh sách orders
        setOrders(
          orders.filter((order) => order.orderId !== orderToDelete.orderId)
        );

        // Điều chỉnh trang hiện tại nếu cần
        if (currentOrders.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(response?.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center shadow">
            <FaBoxOpen className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 tracking-tight">
            Order Management
          </h2>
        </div>
        {isLoading && (
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
          </div>
        )}
        <div className="overflow-auto shadow-xl rounded-2xl border border-green-100 bg-white">
          <table className="min-w-full bg-white rounded-2xl">
            <thead>
              <tr className="bg-gradient-to-r from-green-400 to-green-600 text-white">
                <th className="px-6 py-4 text-left text-base font-bold rounded-tl-2xl">
                  CREATED DATE
                </th>
                <th className="px-6 py-4 text-left text-base font-bold">
                  TOTAL PRICE
                </th>
                <th className="px-6 py-4 text-left text-base font-bold">
                  ORDER ADDRESS
                </th>
                <th className="px-6 py-4 text-left text-base font-bold">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-base font-bold rounded-tr-2xl">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-t hover:bg-green-50 transition-all"
                >
                  <td className="px-6 py-4 text-base text-gray-800 font-medium">
                    {new Date(order.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-base text-green-700 font-bold">
                    {order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-base text-gray-700">
                    {order.orderAddress}
                  </td>
                  <td className="px-6 py-4 text-base">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-bold shadow border transition-all duration-200
                        ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : order.status === "Success"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                      `}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-base">
                    <button
                      onClick={() => handleDeleteClick(order)}
                      className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow transition-all duration-200"
                    >
                      <FaTrash className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 bg-green-50 p-4 rounded-2xl shadow border border-green-100 gap-4">
          <div className="text-base text-green-700 font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200
                ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-green-700 border border-green-200 hover:bg-green-100"
                }
              `}
            >
              &lt;
            </button>
            {/* Hiển thị số trang */}
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200
                    ${
                      currentPage === index + 1
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-white text-green-700 border border-green-200 hover:bg-green-100"
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200
                ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-green-700 border border-green-200 hover:bg-green-100"
                }
              `}
            >
              &gt;
            </button>
          </div>
        </div>
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl border-t-4 border-red-400">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTrash className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-red-600">
                Confirm Delete
              </h3>
              <p className="text-gray-600 text-center mb-8">
                Are you sure you want to delete order{" "}
                <span className="font-bold">{orderToDelete?.orderId}</span>?
                <br />
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
