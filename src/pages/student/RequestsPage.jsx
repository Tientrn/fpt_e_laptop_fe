import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import userinfoApi from "../../api/userinfoApi";
import borrowhistoryApi from "../../api/borrowhistoryApi";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-800";
    case "Approved":
      return "bg-blue-100 text-blue-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Borrowing":
      return "bg-amber-600 text-white";
    case "Returned":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const RequestsPage = () => {
  const [borrowHistories, setBorrowHistories] = useState([]);
  const [request, setRequest] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllBorrowHistories = () => {
    borrowhistoryApi
      .getAllBorrowHistories()
      .then((response) => {
        setBorrowHistories(response.data);
        console.log(`borrrowhistory:${JSON.stringify(response.data, null, 2)}`); // Lưu dữ liệu vào state
        setLoading(false); // Set loading là false khi lấy xong dữ liệu
      })
      .catch((err) => {
        setError("Failed to load borrow histories"); // Xử lý lỗi nếu có
        setLoading(false); // Set loading là false khi có lỗi
      });
  };

  useEffect(() => {
    getAllBorrowHistories();
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await userinfoApi.getUserInfo();
        if (userResponse?.isSuccess && userResponse.data) {
          const userData = userResponse.data;
          setUserInfo({
            fullName: userData.fullName,
            studentCode: userData.studentCode,
            userId: userData.userId,
          });

          const requestResponse = await borrowrequestApi.getAllBorrowRequests();
          if (requestResponse?.isSuccess && requestResponse.data) {
            const userRequests = requestResponse.data.filter(
              (req) => req.userId === userData.userId
            );

            if (userRequests.length > 0) {
              const latestRequest = userRequests[userRequests.length - 1];
              setRequest({
                id: latestRequest.requestId, // Thêm ID để hủy yêu cầu
                itemName: latestRequest.itemName,
                status: latestRequest.status,
                startDate: latestRequest.startDate,
                endDate: latestRequest.endDate,
              });
            } else {
              toast.info("Không tìm thấy yêu cầu nào cho người dùng hiện tại");
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelRequest = async () => {
    if (!request || request.status !== "Pending") return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Không tìm thấy token, bạn cần đăng nhập lại.");
      return;
    }

    // 2. Cấu hình header để đính kèm token vào yêu cầu xóa yêu cầu
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Đính kèm token vào header
      },
    };

    try {
      // 1. Xóa yêu cầu mượn
      const response = await borrowrequestApi.deleteBorrowRequest(request.id);
      if (response?.isSuccess) {
        toast.success("Hủy yêu cầu thành công!");

        // 2. Xóa lịch sử mượn tương ứng
        const borrowHistory = borrowHistories.find(
          (history) => history.requestId === request.id
        );

        console.log("historyIdToDelete:", borrowHistory);

        if (borrowHistory) {
          // Nếu tìm thấy borrowHistory, truy cập borrowHistoryId từ object
          const historyIdToDelete = borrowHistory?.borrowHistoryId; // Lấy borrowHistoryId từ object

          console.log("historyIdToDelete:", historyIdToDelete); // Kiểm tra giá trị

          // Thực hiện xóa lịch sử mượn với borrowHistoryId
          const historyResponse = await borrowhistoryApi.deleteBorrowHistory(
            historyIdToDelete,
            config
          );
          if (historyResponse?.isSuccess) {
            toast.success("Xóa lịch sử mượn thành công!");

            // Cập nhật lại borrowHistories sau khi xóa
            setBorrowHistories((prevHistories) => {
              return prevHistories.filter(
                (history) => history.borrowHistoryId !== historyIdToDelete
              );
            });
          } else {
            toast.error("Không thể xóa lịch sử mượn.");
          }
        } else {
          toast.error("Không tìm thấy lịch sử mượn để xóa.");
        }

        // Cập nhật lại trạng thái yêu cầu
        setRequest((prev) => ({ ...prev, status: "Canceled" }));
      } else {
        toast.error("Không thể hủy yêu cầu.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu:", error);
      toast.error("Lỗi khi hủy yêu cầu.");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (!request || !userInfo) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <p className="text-gray-500 text-sm">Không tìm thấy yêu cầu nào</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Trạng thái yêu cầu mượn của tôi
            </h1>
            <div className="h-1 w-32 bg-amber-500 rounded-full mb-6"></div>

            {/* Status Card */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 text-white mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Trạng thái hiện tại</p>
                  <span className="text-xl font-semibold">
                    {request.status === "Pending"
                      ? "Đang chờ duyệt"
                      : request.status === "Approved"
                      ? "Đã duyệt"
                      : request.status === "Rejected"
                      ? "Bị từ chối"
                      : request.status}
                  </span>
                </div>
                <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {request.status === "Pending" ? (
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                    </svg>
                  ) : request.status === "Approved" ? (
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Card */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin cá nhân
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="text-base font-medium text-gray-800">
                      {userInfo.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã sinh viên</p>
                    <p className="text-base font-medium text-gray-800">
                      {userInfo.studentCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Info Card */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin mượn
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Thiết bị</p>
                    <p className="text-base font-medium text-gray-800">
                      {request.itemName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                      <p className="text-base text-gray-800">
                        {format(new Date(request.startDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày kết thúc</p>
                      <p className="text-base text-gray-800">
                        {format(new Date(request.endDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            {request.status === "Pending" && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleCancelRequest}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Hủy yêu cầu
                </button>
              </div>
            )}

            {/* Rules Section */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Quy định mượn laptop
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-blue-800">
                  <svg
                    className="h-5 w-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Bạn chỉ có thể mượn một laptop tại một thời điểm
                </li>
                <li className="flex items-center gap-2 text-blue-800">
                  <svg
                    className="h-5 w-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Bạn phải trả laptop hiện tại trước khi mượn chiếc khác
                </li>
                <li className="flex items-center gap-2 text-blue-800">
                  <svg
                    className="h-5 w-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Trạng thái sẽ chuyển thành 'Đã trả' sau khi bạn hoàn trả
                  laptop
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
