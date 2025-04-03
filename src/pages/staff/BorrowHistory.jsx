import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  FaSearch,
} from 'react-icons/fa';
import borrowhistoryApi from '../../api/borrowhistoryApi';
import userApi from '../../api/userApi';
import borrowRequestApi from '../../api/borrowRequestApi';
import donateitemsApi from '../../api/donateitemsApi';

const BorrowHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [requestsMap, setRequestsMap] = useState({});

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  useEffect(() => {
    if (borrowHistory.length > 0) {
      fetchUserInfo();
      fetchBorrowRequests();
    }
  }, [borrowHistory]);

  useEffect(() => {
    if (borrowHistory.length > 0) {
      console.log('Current Borrow History:', borrowHistory);
      console.log('Item IDs to fetch:', borrowHistory.map(item => item.itemId));
    }
  }, [borrowHistory]);

  const fetchUserInfo = async () => {
    try {
      // Get unique user IDs from borrow history
      const userIds = [...new Set(borrowHistory.map(item => item.userId))];
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
      setUserInfoMap({});
      toast.error('Unable to load user information');
    }
  };

  const fetchBorrowHistory = async () => {
    try {
      const response = await borrowhistoryApi.getAllBorrowHistories();
      console.log('Borrow History Response:', response);
      
      if (response.isSuccess) {
        setBorrowHistory(response.data || []);
      } else {
        toast.error('Failed to load borrow history');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      toast.error('Failed to load borrow history');
      setLoading(false);
    }
  };

  const fetchBorrowRequests = async () => {
    try {
      // Get unique item IDs from borrow history
      const itemIds = [...new Set(borrowHistory.map(item => item.itemId))];
      const itemMap = {};
      
      // Fetch each item individually
      for (const itemId of itemIds) {
        if (itemId) {
          try {
            const response = await donateitemsApi.getDonateItemById(itemId);
            console.log(`Response for item ${itemId}:`, response); // Debug log
            
            if (response.isSuccess && response.data) {
              itemMap[itemId] = {
                itemName: response.data.name || response.data.itemName || 'Unnamed Item',
                status: response.data.status
              };
            } else {
              itemMap[itemId] = {
                itemName: 'Unknown Item',
                status: 'Unknown'
              };
            }
          } catch (error) {
            console.error(`Error fetching item ${itemId}:`, error);
            itemMap[itemId] = {
              itemName: 'Error Loading Item',
              status: 'Error'
            };
          }
        }
      }
      
      console.log('Final Item Map:', itemMap);
      setRequestsMap(itemMap);
    } catch (error) {
      console.error('Error in fetchBorrowRequests:', error);
      toast.error('Error loading item information');
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
    const userInfo = userInfoMap[item.userId] || {};
    const matchesSearch = 
      userInfo.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Since we don't have status in the history response, we'll just return all items
    return matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Borrow History
      </h1>

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Request ID</th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Borrow Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Return Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.borrowHistoryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.borrowHistoryId}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{item.requestId}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {userInfoMap[item.userId]?.fullName || 'Loading...'}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userInfoMap[item.userId]?.email || 'Loading...'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(() => {
                        if (!item.itemId) return 'No Item ID';
                        const itemInfo = requestsMap[item.itemId];
                        if (!itemInfo) return 'Loading...';
                        return itemInfo.itemName || 'Unknown Item';
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.borrowDate ? format(new Date(item.borrowDate), 'dd/MM/yyyy HH:mm:ss') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.returnDate ? format(new Date(item.returnDate), 'dd/MM/yyyy HH:mm:ss') : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No borrow history records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredHistory.length > 0 && (
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-lg 
                  ${currentPage === page ? 'bg-blue-500 text-white' : ''}`}
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
    </div>
  );
};

export default BorrowHistory; 