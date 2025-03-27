import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaEye,
  FaFilter
} from 'react-icons/fa';

const BorrowRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchBorrowRequests();
  }, []);

  const fetchBorrowRequests = async () => {
    try {
      const response = await fetch('/api/BorrowRequest/get-all');
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching borrow requests:', error);
      toast.error('Failed to load borrow requests');
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`/api/BorrowRequest/get/${id}`);
      const data = await response.json();
      // Implement view details modal/page with data
      console.log('Request details:', data);
    } catch (error) {
      toast.error('Error fetching request details');
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/BorrowRequest/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        toast.success('Request approved successfully');
        fetchBorrowRequests();
      } else {
        throw new Error('Failed to approve request');
      }
    } catch (error) {
      toast.error('Error approving request');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        const response = await fetch(`/api/BorrowRequest/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'rejected' }),
        });

        if (response.ok) {
          toast.success('Request rejected successfully');
          fetchBorrowRequests();
        } else {
          throw new Error('Failed to reject request');
        }
      } catch (error) {
        toast.error('Error rejecting request');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        const response = await fetch(`/api/BorrowRequest/delete/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Request deleted successfully');
          fetchBorrowRequests();
        } else {
          throw new Error('Failed to delete request');
        }
      } catch (error) {
        toast.error('Error deleting request');
      }
    }
  };

  // Filter and search logic
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      (request.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (request.laptopName?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Borrow Requests</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by student or laptop..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="min-w-[200px]">
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laptop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.laptopName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(request.requestDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewDetails(request.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye className="w-5 h-5" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <FaCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <FaTimes className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded-lg 
                    ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
                >
                  {i + 1}
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
        </>
      )}
    </div>
  );
};

export default BorrowRequest; 