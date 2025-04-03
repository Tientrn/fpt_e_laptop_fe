import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  FaSearch,
  FaFilter,
} from 'react-icons/fa';
import borrowrequestApi from "../../api/borrowRequestApi"; 
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
              setUserInfoMap(prev => ({
                ...prev,
                [request.userId]: response.data
              }));
            }
          } catch (error) {
            console.error(`Error fetching user info for ID ${request.userId}:`, error);
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

      const response = await borrowrequestApi.deleteBorrowRequest(deletingRequestId);
      
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
        rejectionReason: editFormData.status === "Rejected" ? editFormData.rejectionReason : null
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
          window.location.href = '/staff/contracts';
        }
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
    <div className="">
      {/* Header with Staff Role Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-black">Borrow Requests</h1>
          
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by user or item..."
              className="w-full pl-10 pr-4 py-2 text-base border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600" />
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-slate-600 text-sm" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-3 pr-8 py-2 text-base border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
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
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-600">Full Name</th>
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-600">Item Name</th>
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-600">Start Date</th>
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-600">End Date</th>
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((request) => (
                  <tr key={request.requestId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-md text-gray-800">
                      {request.requestId}
                    </td>
                    <td className="px-6 py-3 text-md text-gray-800">
                      {userInfoMap[request.userId]?.fullName || "Loading..."}
                    </td>
                    <td className="px-6 py-3 text-md text-gray-800">
                      {userInfoMap[request.userId]?.email || "Loading..."}
                    </td>
                    <td className="px-6 py-3 text-md text-gray-800">
                      {request.itemName}
                    </td>
                    <td className="px-6 py-3 text-md text-gray-800">
                      {request.startDate ? format(new Date(request.startDate), "dd/MM/yyyy") : "N/A"}
                    </td>
                    <td className="px-6 py-3 text-md text-gray-800">
                      {request.endDate ? format(new Date(request.endDate), "dd/MM/yyyy") : "N/A"}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 text-md font-medium rounded-full
                        ${request.status === "Pending" ? "bg-amber-100 text-amber-800" :
                          request.status === "Approved" ? "bg-green-100 text-green-800" :
                          request.status === "Rejected" ? "bg-red-100 text-red-800" :
                          request.status === "Borrowing" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"}`}
                      >
                        {request.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(request)}
                          className="px-3 py-1.5 text-md font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(request.requestId)}
                          className="px-3 py-1.5 text-md font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-6 text-center text-sm text-gray-500">
                    No borrow requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredRequests.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-300"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                  ${currentPage === page 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-amber-100'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-300"
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
