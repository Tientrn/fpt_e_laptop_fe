import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter
} from 'react-icons/fa';

const BorrowHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  const fetchBorrowHistory = async () => {
    try {
      const response = await fetch('api/borrow-histories');
      const data = await response.json();
      setBorrowHistory(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      toast.error('Failed to load borrow history');
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    // Implement view details logic
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`api/borrow-histories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchBorrowHistory();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`api/borrow-histories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Record deleted successfully');
          fetchBorrowHistory();
        } else {
          throw new Error('Failed to delete record');
        }
      } catch (error) {
        toast.error('Error deleting record');
      }
    }
  };

  // Filter and search logic
  const filteredHistory = borrowHistory.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.laptopName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Borrow History</h1>

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
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
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
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Date
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
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.laptopName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(item.borrowDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.returnDate ? format(new Date(item.returnDate), 'dd/MM/yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.status === 'borrowed' ? 'bg-green-100 text-green-800' : 
                          item.status === 'returned' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewDetails(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(item.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredHistory.length)} of {filteredHistory.length} entries
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

export default BorrowHistory; 