import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  FaUserAlt,
  FaIdCard,
  FaCalendarAlt,
  FaLaptop,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import userinfoApi from "../../api/userinfoApi";
import borrowhistoryApi from "../../api/borrowhistoryApi";
import borrowrequestApi from "../../api/borrowrequestApi";
import donateitemsApi from "../../api/donateitemsApi";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "Borrowing":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "Returned":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Available":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Pending":
      return <FaCalendarAlt className="text-yellow-500" />;
    case "Approved":
      return <FaCheck className="text-green-500" />;
    case "Rejected":
      return <FaTimes className="text-red-500" />;
    case "Borrowing":
      return <FaLaptop className="text-indigo-500" />;
    case "Returned":
      return <FaCheck className="text-gray-500" />;
    case "Available":
      return <FaCheck className="text-blue-500" />;
    default:
      return <FaInfoCircle className="text-gray-500" />;
  }
};

const RequestsPage = () => {
  const [borrowHistories, setBorrowHistories] = useState([]);
  const [request, setRequest] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllBorrowHistories = () => {
    borrowhistoryApi
      .getAllBorrowHistories()
      .then((response) => {
        setBorrowHistories(response.data);
        console.log(`borrrowhistory:${JSON.stringify(response.data, null, 2)}`);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load borrow histories");
        setLoading(false);
      });
  };

  // Function to check item status using donateitemsApi
  const checkItemStatus = async (itemId) => {
    try {
      // Use the donated items API to get item details
      const response = await donateitemsApi.getDonateItemById(itemId);
      
      // Check if response is successful and contains data
      if (response?.isSuccess && response.data) {
        console.log("Item data:", response.data);
        
        // Check if the item has a status property
        if (response.data.status) {
          return response.data.status;
        }
        
        // If no status property exists, check if there is a state or condition property that might indicate availability
        if (response.data.state === "Available" || response.data.condition === "Available") {
          return "Available";
        }
      }
      return null;
    } catch (error) {
      console.error("Error checking item status:", error);
      return null;
    }
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
              
              // Check if item status is "Available" when request status is "Approved"
              let displayStatus = latestRequest.status;
              
              // If there's an itemId field, check its status
              if (latestRequest.itemId && latestRequest.status === "Approved") {
                try {
                  const status = await checkItemStatus(latestRequest.itemId);
                  
                  // If the item is "Available", update the display status
                  if (status === "Available") {
                    displayStatus = "Available";
                    console.log("Item is available, hiding request details");
                  }
                } catch (err) {
                  console.error("Failed to check item status:", err);
                }
              }
              
              setRequest({
                id: latestRequest.requestId,
                itemId: latestRequest.itemId,
                itemName: latestRequest.itemName,
                status: displayStatus, // Use the determined status
                originalStatus: latestRequest.status, // Keep the original status for reference
                startDate: latestRequest.startDate,
                endDate: latestRequest.endDate,
              });
            } else {
              toast.info("No requests found for the current user");
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error loading data");
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
      toast.error("Token not found, please log in again.");
      return;
    }

    try {
      // 1. Xóa yêu cầu mượn
      const response = await borrowrequestApi.deleteBorrowRequest(request.id);
      if (response?.isSuccess) {
        toast.success("Request canceled successfully!");

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
            historyIdToDelete
          );
          if (historyResponse?.isSuccess) {
            toast.success("Borrow history deleted successfully!");

            // Cập nhật lại borrowHistories sau khi xóa
            setBorrowHistories((prevHistories) => {
              return prevHistories.filter(
                (history) => history.borrowHistoryId !== historyIdToDelete
              );
            });
          } else {
            toast.error("Unable to delete borrow history.");
          }
        } else {
          toast.error("Borrow history not found for deletion.");
        }

        // Cập nhật lại trạng thái yêu cầu
        setRequest((prev) => ({ ...prev, status: "Canceled" }));
      } else {
        toast.error("Unable to cancel request.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu:", error);
      toast.error("Error canceling request.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
          <p className="mt-3 text-indigo-600 font-medium">Loading request status...</p>
        </div>
      </div>
    );
  }

  if (!request || !userInfo || (request && request.status === "Available")) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-indigo-600 mb-4">
            <FaExclamationTriangle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Active Requests</h2>
          <p className="text-gray-500 mb-6">You don&apos;t have any active borrow requests at the moment.</p>
          <a 
            href="#" 
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Browse Laptops
          </a>
        </div>
      </div>
    );
  }

  // Display appropriate message based on status
  const getStatusMessage = (status, originalStatus) => {
    if (status === "Available" && originalStatus === "Approved") {
      return "Your request was approved, but the item is now available. You can pick it up according to the scheduled date.";
    } else if (status === "Pending") {
      return "Your request is currently being reviewed. You will be notified once a decision has been made.";
    } else if (status === "Approved") {
      return "Your request has been approved! You can pick up the laptop according to the scheduled date.";
    } else if (status === "Rejected") {
      return "Unfortunately, your request has been rejected. Please contact the administrator for more details.";
    } else {
      return "Your request status has been updated.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">
              Borrow Request Status
            </h1>
            <p className="text-indigo-100 mt-1">Track and manage your laptop borrowing request</p>
          </div>

          {/* Status Card */}
          <div className="p-6">
            <div className={`p-6 rounded-lg border ${getStatusColor(request.status)} mb-8`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mr-4">
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Current Status</p>
                    <span className="text-xl font-semibold">
                      {request.status === "Pending"
                        ? "Pending Approval"
                        : request.status === "Approved"
                        ? "Approved"
                        : request.status === "Rejected"
                        ? "Rejected"
                        : request.status === "Available" && request.originalStatus === "Approved"
                        ? "Available for Pickup"
                        : request.status}
                    </span>
                  </div>
                </div>
                {request.status === "Pending" && (
                  <button
                    onClick={handleCancelRequest}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center"
                  >
                    <FaTimes className="mr-2" />
                    Cancel Request
                  </button>
                )}
              </div>
              <div className="mt-4 text-sm">
                <p>{getStatusMessage(request.status, request.originalStatus)}</p>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Personal Info Card */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUserAlt className="text-indigo-600 mr-2" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-base font-medium text-gray-800">
                      {userInfo.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student Code</p>
                    <p className="text-base font-medium text-gray-800">
                      <span className="flex items-center">
                        <FaIdCard className="text-indigo-600 mr-2" />
                        {userInfo.studentCode}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Info Card */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaLaptop className="text-indigo-600 mr-2" />
                  Borrow Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Laptop</p>
                    <p className="text-base font-medium text-gray-800">
                      {request.itemName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-base text-gray-800 flex items-center">
                        <FaCalendarAlt className="text-indigo-600 mr-2" />
                        {format(new Date(request.startDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="text-base text-gray-800 flex items-center">
                        <FaCalendarAlt className="text-indigo-600 mr-2" />
                        {format(new Date(request.endDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules Section */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <FaInfoCircle className="text-indigo-600 mr-2" />
                Laptop Borrowing Rules
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-indigo-800">
                  <FaCheck className="h-5 w-5 flex-shrink-0 text-indigo-600 mt-0.5" />
                  <span>You can only borrow one laptop at a time</span>
                </li>
                <li className="flex items-start gap-2 text-indigo-800">
                  <FaCheck className="h-5 w-5 flex-shrink-0 text-indigo-600 mt-0.5" />
                  <span>You must return the current laptop before borrowing another</span>
                </li>
                <li className="flex items-start gap-2 text-indigo-800">
                  <FaCheck className="h-5 w-5 flex-shrink-0 text-indigo-600 mt-0.5" />
                  <span>The status will change to &apos;Returned&apos; after you return the laptop</span>
                </li>
                <li className="flex items-start gap-2 text-indigo-800">
                  <FaCheck className="h-5 w-5 flex-shrink-0 text-indigo-600 mt-0.5" />
                  <span>Handle the laptop with care and report any issues immediately</span>
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
