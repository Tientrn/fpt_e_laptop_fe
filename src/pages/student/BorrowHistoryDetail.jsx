import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import borrowrequestApi from "../../api/borrowRequestApi";
import feedbackborrowApi from "../../api/feedbackborrowApi";

const BorrowHistoryDetail = () => {
  const { borrowHistoryId, id } = useParams();
  const navigate = useNavigate();
  console.log("borrowHistoryId:", borrowHistoryId); // Lấy id từ URL params
  const [borrowHistory, setBorrowHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({
    borrowHistoryId: 0,
    itemId: 0,
    rating: 0,
    comments: "",
  });
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

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

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitFeedback = async () => {
    try {
      // Cập nhật dữ liệu phản hồi với borrowHistoryId và itemId
      const feedbackData = {
        borrowHistoryId: borrowHistoryId, // Lấy borrowHistoryId từ chi tiết mượn
        itemId: borrowHistory.itemId, // Lấy itemId từ chi tiết mượn
        rating: feedback.rating,
        comments: feedback.comments,
      };

      // Gọi API tạo phản hồi
      const response = await feedbackborrowApi.createFeedbackBorrow(
        feedbackData
      );

      if (response?.data) {
        setIsFeedbackSubmitted(true);
        toast.success("Cảm ơn bạn đã gửi phản hồi!");
      } else {
        toast.error("Có lỗi khi gửi phản hồi");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Lỗi khi gửi phản hồi");
    }
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
                {isValidDate(borrowHistory.startDate)
                  ? format(new Date(borrowHistory.startDate), "dd/MM/yyyy")
                  : "Ngày không hợp lệ"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày trả</p>
              <p className="text-lg text-black">
                {isValidDate(borrowHistory.endDate)
                  ? format(new Date(borrowHistory.endDate), "dd/MM/yyyy")
                  : "Ngày không hợp lệ"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-black">
              Thông tin người mượn
            </h3>
            <p className="text-lg text-gray-800">
              Tên: {borrowHistory.fullName}
            </p>
            <p className="text-lg text-gray-800">
              Email: {borrowHistory.email}
            </p>
            <p className="text-lg text-gray-800">
              Số điện thoại: {borrowHistory.phoneNumber}
            </p>
          </div>

          {borrowHistory.status === "Approved" && !isFeedbackSubmitted && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-black">
                Phản hồi của bạn
              </h3>
              <div className="mt-4">
                <label className="block text-sm text-gray-500" htmlFor="rating">
                  Đánh giá (1-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  value={feedback.rating}
                  onChange={handleFeedbackChange}
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div className="mt-4">
                <label
                  className="block text-sm text-gray-500"
                  htmlFor="comments"
                >
                  Bình luận
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  value={feedback.comments}
                  onChange={handleFeedbackChange}
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                  rows="4"
                ></textarea>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSubmitFeedback}
                  className="text-white bg-slate-600 px-6 py-3 rounded-lg hover:bg-slate-700"
                >
                  Gửi phản hồi
                </button>
              </div>
            </div>
          )}

          {isFeedbackSubmitted && (
            <div className="mt-6">
              <p className="text-lg text-green-600">
                Cảm ơn bạn đã gửi phản hồi!
              </p>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate(-1)}
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
