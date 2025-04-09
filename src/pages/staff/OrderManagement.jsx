import React, { useState, useEffect } from "react";
import orderApis from "../../api/orderApi";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài đặt và import react-toastify

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Existing Orders</h2>
      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="overflow-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
          <tr className="bg-gradient-to-r from-gray-500 to-green-500 text-white">
              <th className="px-6 py-3 text-left text-sm font-medium text-white">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white">
                CREATED DATE
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white">
                TOTAL PRICE
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white">
                ORDER ADDRESS
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.orderId} className="border-t">
                <td className="px-6 py-3 text-sm text-gray-800">
                  {order.orderId}
                </td>
                <td className="px-6 py-3 text-sm text-gray-800">
                  {new Date(order.createdDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-sm text-gray-800">
                  {order.totalPrice.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-sm text-gray-800">
                  {order.orderAddress}
                </td>
                <td className="px-6 py-3 text-sm text-gray-800">
                  {order.status}
                </td>
                <td className="px-6 py-3 text-sm">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Detail
                  </button>
                  <button
                    onClick={() => handleDeleteClick(order)}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          {/* Hiển thị số trang */}
          <div className="flex items-center space-x-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete order #{orderToDelete?.orderId}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
