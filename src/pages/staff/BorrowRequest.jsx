import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  FaSearch,
  FaFilter,
} from 'react-icons/fa';
import borrowrequestApi from "../../api/borrowRequestApi"; 
import userApi from "../../api/userApi";
import borrowhistoryApi from "../../api/borrowhistoryApi";
import donateitemsApi from "../../api/donateitemsApi";

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
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await userinfoApi.getUserInfo();
      if (response.isSuccess) {
        const userMap = response.data.reduce(
          (map, user) => ({
            ...map,
            [user.userId]: { fullName: user.fullName, email: user.email },
          }),
          {}
        );
        setUserInfoMap(userMap);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Unable to load user information");
    }
  };

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
    setDeletingRequestId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await borrowrequestApi.deleteBorrowRequest(
        deletingRequestId
      );
      if (response.isSuccess) {
        toast.success("Request deleted successfully");
        fetchBorrowRequests();
      } else {
        toast.error(response.message || "Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Error deleting request");
    } finally {
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
      const updateData = { status: editFormData.status };
      if (editFormData.status === "Rejected" && editFormData.rejectionReason) {
        updateData.rejectionReason = editFormData.rejectionReason;
      }

      const response = await borrowrequestApi.updateBorrowRequest(
        editingRequest.requestId,
        updateData
      );
      if (response.isSuccess) {
        toast.success("Request status updated successfully");
        fetchBorrowRequests();
        setIsEditModalOpen(false);
      } else {
        toast.error(response.message || "Failed to update request status");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Error updating request status");
    }
  };

  const filteredRequests = requests.filter((request) => {
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

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header with Staff Role Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-black">Borrow Requests</h1>
          <span className="text-sm text-amber-600 font-medium">
            Staff Dashboard
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by user or item..."
              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-600" />
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-slate-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-3 pr-8 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Borrowing">Borrowing</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Request ID",
                  "Full Name",
                  "Email",
                  "Item Name",
                  "Start Date",
                  "End Date",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentItems.length > 0 ? (
                currentItems.map((request) => (
                  <tr key={request.requestId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-black">
                      #{request.requestId}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {userInfoMap[request.userId]?.fullName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {userInfoMap[request.userId]?.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {request.itemName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {request.startDate
                        ? format(new Date(request.startDate), "dd/MM/yyyy")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {request.endDate
                        ? format(new Date(request.endDate), "dd/MM/yyyy")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : request.status === "Borrowing"
                            ? "bg-blue-100 text-blue-800"
                            : request.status === "Returned"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(request)}
                          className="px-3 py-1 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(request.requestId)}
                          className="px-3 py-1 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-center text-black">
                    No borrow requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredRequests.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4 text-sm text-black">
          <span>
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredRequests.length)} of{" "}
            {filteredRequests.length} entries
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-600 text-white rounded-md disabled:bg-slate-300 hover:bg-amber-600 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-amber-600 text-white"
                    : "bg-slate-600 text-white hover:bg-amber-600"
                } transition-colors`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-600 text-white rounded-md disabled:bg-slate-300 hover:bg-amber-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isEditModalOpen && editingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-black mb-4">
              Edit Request Status
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                >
                  {editingRequest.status === 'Pending' && (
                    <option value="Pending">Pending</option>
                  )}
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Borrowing">Borrowing</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              {editFormData.status === "Rejected" && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    name="rejectionReason"
                    value={editFormData.rejectionReason}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                    rows="3"
                    required={editFormData.status === "Rejected"}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold text-black mb-4">
              Confirm Delete
            </h2>
            <p className="text-black mb-6">
              Are you sure you want to delete this request? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
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

export default BorrowRequest;
