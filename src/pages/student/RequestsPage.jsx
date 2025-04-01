import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import borrowrequestApi from "../../api/borrowRequestApi";
import userinfoApi from "../../api/userinfoApi";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-blue-100 text-blue-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Borrowing":
      return "bg-green-100 text-green-800";
    case "Returned":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusMessage = (status) => {
  switch (status) {
    case "Borrowing":
      return {
        message: "You currently have a laptop borrowed. You cannot borrow another laptop until you return this one.",
        className: "text-gray-600 font-italic"
      };
    case "Returned":
      return {
        message: "You can now borrow another laptop.",
        className: "text-green-600 font-medium"
      };
    default:
      return null;
  }
};

const RequestsPage = () => {
  const [request, setRequest] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin user
        const userResponse = await userinfoApi.getUserInfo();
        console.log("User info response:", userResponse);

        if (userResponse && userResponse.isSuccess && userResponse.data) {
          const userData = userResponse.data;
          setUserInfo({
            fullName: userData.fullName,
            studentCode: userData.studentCode,
            userId: userData.userId,
          });

          // Lấy thông tin request
          const requestResponse = await borrowrequestApi.getAllBorrowRequests();
          console.log("All requests response:", requestResponse);

          if (
            requestResponse &&
            requestResponse.isSuccess &&
            requestResponse.data
          ) {
            // Lọc request theo userId hiện tại
            const userRequests = requestResponse.data.filter(
              (req) => req.userId === userData.userId
            );

            if (userRequests.length > 0) {
              const latestRequest = userRequests[userRequests.length - 1];
              setRequest({
                itemName: latestRequest.itemName,
                status: latestRequest.status,
                startDate: latestRequest.startDate,
                endDate: latestRequest.endDate,
              });
            } else {
              toast.info("No requests found for current user");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!request || !userInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No request found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">My Borrow Request Status</h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Full Name
            </h3>
            <p className="text-lg font-medium">{userInfo.fullName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <span
              className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                request.status
              )}`}
            >
              {request.status}
            </span>
            {/* Hiển thị thông báo dựa trên trạng thái */}
            {getStatusMessage(request.status) && (
              <p className={`mt-2 text-sm ${getStatusMessage(request.status).className}`}>
                {getStatusMessage(request.status).message}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Student Code
            </h3>
            <p className="text-lg font-medium">{userInfo.studentCode}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Start Date
            </h3>
            <p>{format(new Date(request.startDate), "dd/MM/yyyy")}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Laptop</h3>
            <p className="text-lg font-medium">{request.itemName}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">End Date</h3>
            <p>{format(new Date(request.endDate), "dd/MM/yyyy")}</p>
          </div>
        </div>

        {/* Thêm phần giải thích về quy định mượn laptop */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">
            Laptop Borrowing Rules:
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>You can only borrow one laptop at a time</li>
            <li>
              You must return your current laptop before borrowing another one
            </li>
            <li>
              The status will change to 'Returned' after you successfully return
              the laptop
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
