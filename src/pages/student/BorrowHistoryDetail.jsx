import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import axiosClient from "../../api/axiosClient";
import borrowrequestApi from "../../api/borrowRequestApi"; // Import axiosClient để sử dụng API

const BorrowHistoryDetail = () => {
  const { id } = useParams(); // Lấy id từ URL params
  const [borrowHistory, setBorrowHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowHistoryDetail = async () => {
      try {
        setLoading(true);
        // Thay đổi ở đây để gọi API getBorrowRequestById từ axiosClient
        const response = await borrowrequestApi.getBorrowRequestById(id);
        if (response?.data) {
          setBorrowHistory(response.data); // Giả sử response.data chứa chi tiết mượn
        } else {
          toast.info("Không tìm thấy thông tin chi tiết mượn");
        }
      } catch (error) {
        console.error("Error fetching borrow history details:", error);
        toast.error("Lỗi khi tải chi tiết mượn");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistoryDetail();
  }, [id]);

  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (!borrowHistory) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <p className="text-gray-500 text-sm">
          Không tìm thấy thông tin chi tiết mượn
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-6">
          Chi tiết lịch sử mượn
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-black">
              Thông tin sản phẩm
            </h2>
            <p className="text-lg text-gray-800">{borrowHistory.itemName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-500">Ngày mượn</p>
              <p className="text-lg text-black">
                {isValidDate(borrowHistory.borrowDate)
                  ? format(new Date(borrowHistory.borrowDate), "dd/MM/yyyy")
                  : "Ngày không hợp lệ"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày trả</p>
              <p className="text-lg text-black">
                {isValidDate(borrowHistory.returnDate)
                  ? format(new Date(borrowHistory.returnDate), "dd/MM/yyyy")
                  : "Ngày không hợp lệ"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-black">
              Thông tin người mượn
            </h3>
            <p className="text-lg text-gray-800">
              Tên: {borrowHistory.studentName}
            </p>
            <p className="text-lg text-gray-800">
              Email: {borrowHistory.studentEmail}
            </p>
            <p className="text-lg text-gray-800">
              Số điện thoại: {borrowHistory.studentPhone}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {}}
              className="text-slate-600 border border-slate-600 px-6 py-3 text-sm rounded-lg hover:bg-slate-600 hover:text-white transition"
            >
              Trở lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistoryDetail;
