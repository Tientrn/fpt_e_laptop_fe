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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    rejectionReason: ''
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState(null);
  const [userInfoMap, setUserInfoMap] = useState({});

  useEffect(() => {
    fetchBorrowRequests();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Get unique user IDs from requests
        const userIds = [...new Set(requests.map(request => request.userId))];
        const userMap = {};
        
        // Fetch user info for each unique user ID
        for (const userId of userIds) {
          if (userId) {
            const response = await userApi.getUserById(userId);
            if (response.isSuccess) {
              userMap[userId] = {
                fullName: response.data.fullName,
                email: response.data.email
              };
            }
          }
        }
        
        setUserInfoMap(userMap);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (requests.length > 0) {
      fetchUserInfo();
    }
  }, [requests]);

  const fetchBorrowRequests = async () => {
    try {
      setLoading(true);
      const response = await borrowrequestApi.getAllBorrowRequests();
      console.log('API Response:', response);
      
      if (response.isSuccess) {
        setRequests(response.data || []);
      } else {
        toast.error(response.message || 'Failed to load borrow requests');
      }
    } catch (error) {
      console.error('Error fetching borrow requests:', error);
      toast.error('Failed to load borrow requests');
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
      const response = await borrowrequestApi.deleteBorrowRequest(deletingRequestId);
      
      if (response.isSuccess) {
        toast.success('Request deleted successfully');
        fetchBorrowRequests(); // Refresh data
      } else {
        toast.error(response.message || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Error deleting request');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingRequestId(null);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      try {
        const response = await borrowrequestApi.updateBorrowRequest(id, { status: 'Approved' });
        
        if (response.isSuccess) {
          toast.success('Request status changed to Approved successfully');
          fetchBorrowRequests();
          if (isModalOpen) {
            setIsModalOpen(false);
          }
        } else {
          toast.error(response.message || 'Failed to approve request');
        }
      } catch (error) {
        console.error('Error approving request:', error);
        toast.error('Error approving request');
      }
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason !== null) {
      try {
        const response = await borrowrequestApi.updateBorrowRequest(id, { 
          status: 'Rejected',
          rejectionReason: reason 
        });
        
        if (response.isSuccess) {
          toast.success('Request status changed to Rejected successfully');
          fetchBorrowRequests();
          if (isModalOpen) {
            setIsModalOpen(false);
          }
        } else {
          toast.error(response.message || 'Failed to reject request');
        }
      } catch (error) {
        console.error('Error rejecting request:', error);
        toast.error('Error rejecting request');
      }
    }
  };

  const handleEditClick = (request) => {
    setEditingRequest(request);
    setEditFormData({
      status: request.status || 'Pending',
      rejectionReason: request.rejectionReason || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingRequest) return;

    try {
      const updateData = {
        status: editFormData.status
      };

      // Thêm rejectionReason nếu status là rejected
      if (editFormData.status === 'Rejected' && editFormData.rejectionReason) {
        updateData.rejectionReason = editFormData.rejectionReason;
      }

      const response = await borrowrequestApi.updateBorrowRequest(editingRequest.requestId, updateData);
      
      if (response.isSuccess) {
        // Nếu status được cập nhật thành "Returned", tạo bản ghi history mới
        if (editFormData.status === 'Returned') {
          try {
            // Lấy thông tin item từ donate items API
            const itemResponse = await donateitemsApi.getDonateItemById(editingRequest.itemId);
            
            if (itemResponse.isSuccess) {
              // Tạo bản ghi history mới
              const historyData = {
                requestId: editingRequest.requestId,
                userId: editingRequest.userId,
                itemId: editingRequest.itemId,
                itemName: itemResponse.data.name, // Lưu tên item vào history
                borrowDate: editingRequest.startDate,
                returnDate: new Date().toISOString()
              };

              // Gọi API tạo history (bạn cần tạo API này)
              const historyResponse = await borrowhistoryApi.createBorrowHistory(historyData);
              
              if (historyResponse.isSuccess) {
                toast.success('Request completed and history created successfully');
              } else {
                toast.error('Failed to create borrow history');
              }
            }
          } catch (error) {
            console.error('Error creating borrow history:', error);
            toast.error('Error creating borrow history');
          }
        }

        toast.success('Request status updated successfully');
        fetchBorrowRequests(); // Refresh data
        setIsEditModalOpen(false);
      } else {
        toast.error(response.message || 'Failed to update request status');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Error updating request status');
    }
  };

  // Filter requests based on search term and status
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      (request.userId && request.userId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.itemName && request.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (request.status && request.status.toLowerCase() === filterStatus.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Borrow Requests</h1>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by user or laptop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laptop
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((request) => (
                    <tr key={request.requestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.requestId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {userInfoMap[request.userId]?.fullName || 'Loading...'}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {userInfoMap[request.userId]?.email || 'Loading...'}
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.itemName || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.startDate 
                            ? format(new Date(request.startDate), 'dd/MM/yyyy')
                            : 'N/A'}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.endDate 
                            ? format(new Date(request.endDate), 'dd/MM/yyyy')
                            : 'N/A'}
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            request.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 
                            request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            request.status === 'Borrowing' ? 'bg-green-100 text-green-800' :
                            request.status === 'Returned' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {request.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3 justify-start">
                          <button
                            onClick={() => handleEditClick(request)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md"
                            title="Edit Status"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(request.requestId)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                            title="Delete Request"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      No borrow requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredRequests.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === page ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for Request Details */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Request Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Request ID</h3>
                  <p>{selectedRequest.requestId || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                  <p>{selectedRequest.userId || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Item ID</h3>
                  <p>{selectedRequest.itemId || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Laptop</h3>
                  <p>{selectedRequest.itemName || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${selectedRequest.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      selectedRequest.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      selectedRequest.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'}`}>
                    {selectedRequest.status || 'Pending'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p>
                    {selectedRequest.startDate 
                      ? format(new Date(selectedRequest.startDate), 'dd/MM/yyyy')
                      : 'N/A'}
                  </p>
                </div>
                {/* <div>
                  <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                  <p>
                    {selectedRequest.endDate 
                      ? format(new Date(selectedRequest.endDate), 'dd/MM/yyyy')
                      : 'N/A'}
                  </p>
                </div> */}
              </div>
              
              {selectedRequest.status === 'Rejected' && selectedRequest.rejectionReason && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rejection Reason</h3>
                  <p className="text-red-600">{selectedRequest.rejectionReason}</p>
                </div>
              )}
              
              {/* Actions for pending requests */}
              {selectedRequest.status === 'Pending' && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleApprove(selectedRequest.requestId);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleReject(selectedRequest.requestId);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isEditModalOpen && editingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Request Status</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              
              {editFormData.status === 'Rejected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    name="rejectionReason"
                    value={editFormData.rejectionReason}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required={editFormData.status === 'Rejected'}
                  ></textarea>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this request? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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