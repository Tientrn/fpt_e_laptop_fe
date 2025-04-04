import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import borrowrequestApi from "../../api/borrowRequestApi";
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-6">
          Trạng thái yêu cầu mượn của tôi
        </h1>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-2">
              <div>
                <p className="text-xs text-gray-500">Họ và tên</p>
                <p className="text-sm text-black font-medium">
                  {userInfo.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-center p-2">
              <div>
                <p className="text-xs text-gray-500">Trạng thái</p>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status === "Pending"
                    ? "Đang chờ duyệt"
                    : request.status === "Approved"
                    ? "Đã duyệt"
                    : request.status === "Rejected"
                    ? "Bị từ chối"
                    : request.status === "Borrowing"
                    ? "Đang mượn"
                    : request.status === "Returned"
                    ? "Đã trả"
                    : request.status}
                </span>
              </div>
            </div>
            <div className="flex items-center p-2">
              <div>
                <p className="text-xs text-gray-500">Mã sinh viên</p>
                <p className="text-sm text-black font-medium">
                  {userInfo.studentCode}
                </p>
              </div>
            </div>
            <div className="flex items-center p-2">
              <div>
                <p className="text-xs text-gray-500">Ngày bắt đầu</p>
                <p className="text-sm text-black">
                  {format(new Date(request.startDate), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center p-2">
              <div>
                <p className="text-xs text-gray-500">Laptop</p>
                <p className="text-sm text-black font-medium">
                  {request.itemName}
                </p>
              </div>
            </div>
            <div className="flex items-center p-2">
              <div>
                <p className="text-xs text-gray-500">Ngày kết thúc</p>
                <p className="text-sm text-black">
                  {format(new Date(request.endDate), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          </div>

          {/* Nút Hủy Yêu Cầu */}
          {request.status === "Pending" && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleCancelRequest}
                className="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-red-700 transition"
              >
                Hủy yêu cầu
              </button>
            </div>
          )}

          {/* Quy định */}
          <div className="p-4 border border-gray-200 rounded">
            <h4 className="text-sm font-semibold text-black mb-2">
              Quy định mượn laptop:
            </h4>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              <li>Bạn chỉ có thể mượn một laptop tại một thời điểm</li>
              <li>Bạn phải trả laptop hiện tại trước khi mượn chiếc khác</li>
              <li>
                Trạng thái sẽ chuyển thành 'Đã trả' sau khi bạn hoàn trả laptop
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
