import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import borrowrequestApi from "../../api/borrowrequestApi";
import userApi from "../../api/userApi";

const BorrowRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: "",
    rejectionReason: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState(null);
  const [userInfoMap, setUserInfoMap] = useState({});

  useEffect(() => {
    fetchBorrowRequests();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      for (const request of requests) {
        if (request.userId && !userInfoMap[request.userId]) {
          try {
            const response = await userApi.getUserById(request.userId);
            if (response.isSuccess) {
              setUserInfoMap((prev) => ({
                ...prev,
                [request.userId]: response.data,
              }));
            }
          } catch (error) {
            console.error(
              `Error fetching user info for ID ${request.userId}:`,
              error
            );
          }
        }
      }
    };

    fetchUserInfo();
  }, [requests]);

  const fetchBorrowRequests = async () => {
    try {
      setLoading(true);
      const response = await borrowrequestApi.getAllBorrowRequests();
      if (response.isSuccess) {
        setRequests(response.data || []);
      } else {
        toast.error(response.message || "Failed to load borrow requests");
      }
    } catch (error) {
      console.error("Error fetching borrow requests:", error);
      toast.error("Failed to load borrow requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    console.log("Delete clicked for ID:", id);
    setDeletingRequestId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRequestId) {
      toast.error("Invalid request ID");
      return;
    }

    try {
      setLoading(true);
      console.log("Deleting request with ID:", deletingRequestId);

      const response = await borrowrequestApi.deleteBorrowRequest(
        deletingRequestId
      );

      if (response && response.isSuccess) {
        toast.success("Request deleted successfully");
        await fetchBorrowRequests();
      } else {
        toast.error(response?.message || "Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Error deleting request. Please try again.");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setDeletingRequestId(null);
    }
  };

  const handleEditClick = (request) => {
    setEditingRequest(request);
    setEditFormData({
      status: request.status || "Pending",
      rejectionReason: request.rejectionReason || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingRequest) return;

    try {
      const updateData = {
        status: editFormData.status,
        rejectionReason:
          editFormData.status === "Rejected"
            ? editFormData.rejectionReason
            : null,
      };

      const response = await borrowrequestApi.updateBorrowRequest(
        editingRequest.requestId,
        updateData
      );

      if (response.isSuccess) {
        toast.success("Request status updated successfully");
        await fetchBorrowRequests(); // Refresh borrow requests list
        setIsEditModalOpen(false);

        // Nếu status là Approved, refresh trang Contracts để hiển thị request mới
        if (editFormData.status === "Approved") {
          window.location.href = "/manager/borrow-requests";
        }
      } else {
        toast.error(response.message || "Failed to update request status");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Error updating request status");
    }
  };

  const filteredRequests = [...requests]
    .sort((a, b) => b.requestId - a.requestId)
    .filter((request) => {
      const matchesSearch =
        (request.userId &&
          request.userId
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (request.itemName &&
          request.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        filterStatus === "all" ||
        (request.status &&
          request.status.toLowerCase() === filterStatus.toLowerCase());
      return matchesSearch && matchesStatus;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Borrowing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Title and Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Borrow Requests
        </h1>
        <p className="text-gray-600">
          Manage and track all equipment borrow requests
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by user or item..."
              className="w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-10 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="all">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Borrowing">Borrowing</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-teal-500">
                  <th className="px-6 py-4 text-left text-sm font-medium text-white">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white">
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length > 0 ? (
                  currentItems.map((request) => (
                    <tr
                      key={request.requestId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                        {userInfoMap[request.userId]?.fullName || "Loading..."}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {userInfoMap[request.userId]?.email || "Loading..."}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                        {request.itemName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {request.startDate
                          ? format(new Date(request.startDate), "dd/MM/yyyy")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {request.endDate
                          ? format(new Date(request.endDate), "dd/MM/yyyy")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(
                            request.status
                          )}`}
                        >
                          {request.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {request.status === "Pending" && (
                            <button
                              onClick={() => handleEditClick(request)}
                              className="p-2 text-green-600 hover:text-white hover:bg-green-500 rounded-full transition-colors"
                              title="Edit Status"
                            >
                              <FaEdit />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(request.requestId)}
                            className="p-2 text-red-600 hover:text-white hover:bg-red-500 rounded-full transition-colors"
                            title="Delete Request"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        <p className="text-lg font-medium">
                          No borrow requests found
                        </p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredRequests.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredRequests.length)}
            </span>{" "}
            of <span className="font-medium">{filteredRequests.length}</span>{" "}
            entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg flex items-center justify-center text-gray-600 disabled:text-gray-300 hover:bg-gray-100 transition-colors"
              title="Previous Page"
            >
              <FaArrowLeft />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors
                    ${
                      currentPage === pageNumber
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg flex items-center justify-center text-gray-600 disabled:text-gray-300 hover:bg-gray-100 transition-colors"
              title="Next Page"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isEditModalOpen && editingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Update Request Status
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                    required
                  >
                    {/* Chỉ hiện "Pending" nếu nó đang được chọn, nhưng không render option cho chọn */}
                    {editFormData.status === "Pending" && (
                      <option value="Pending" hidden>
                        Pending
                      </option>
                    )}
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {editFormData.status === "Rejected" && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    name="rejectionReason"
                    value={editFormData.rejectionReason}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Please provide a reason for rejection..."
                    required={editFormData.status === "Rejected"}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Confirm Delete
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete this request? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BorrowRequest;
