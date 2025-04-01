import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaSearch, FaFilter, FaEye, FaFileDownload, FaCheckCircle } from 'react-icons/fa';

const Contractstudent = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await contractApi.getMyContracts();
      
      // Simulated data
      const mockContracts = [
        {
          id: 1,
          contractNumber: 'CTR-2023-001',
          laptopName: 'Dell XPS 13',
          startDate: '2023-06-20T00:00:00',
          endDate: '2023-07-20T00:00:00',
          status: 'active',
          depositAmount: 500000,
          returnDate: null,
          laptopCondition: {
            beforeBorrow: 'Excellent condition, no scratches',
            afterReturn: null
          }
        },
        {
          id: 2,
          contractNumber: 'CTR-2023-002',
          laptopName: 'MacBook Pro',
          startDate: '2023-05-15T00:00:00',
          endDate: '2023-08-15T00:00:00',
          status: 'active',
          depositAmount: 800000,
          returnDate: null,
          laptopCondition: {
            beforeBorrow: 'Good condition, minor scratches on bottom',
            afterReturn: null
          }
        },
        {
          id: 3,
          contractNumber: 'CTR-2023-003',
          laptopName: 'Lenovo ThinkPad',
          startDate: '2023-02-10T00:00:00',
          endDate: '2023-03-10T00:00:00',
          status: 'completed',
          depositAmount: 400000,
          returnDate: '2023-03-09T14:30:00',
          laptopCondition: {
            beforeBorrow: 'Good condition, some wear on keyboard',
            afterReturn: 'Returned in same condition as borrowed'
          }
        }
      ];
      
      setContracts(mockContracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to load your contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleDownloadContract = (id) => {
    // Simulate contract download
    toast.info(`Downloading contract #${id}...`);
    setTimeout(() => {
      toast.success('Contract downloaded successfully');
    }, 1500);
  };

  const handleConfirmReturn = async (id) => {
    if (window.confirm('Are you sure you want to confirm the return of this laptop?')) {
      try {
        // Replace with actual API call
        // await contractApi.confirmReturn(id);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update local state
        setContracts(contracts.map(contract => 
          contract.id === id ? {
            ...contract, 
            status: 'completed',
            returnDate: new Date().toISOString(),
            laptopCondition: {
              ...contract.laptopCondition,
              afterReturn: 'Returned in good condition'
            }
          } : contract
        ));
        
        toast.success('Return confirmed successfully');
      } catch (error) {
        console.error('Error confirming return:', error);
        toast.error('Failed to confirm return');
      }
    }
  };

  // Filter and search logic
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.laptopName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContracts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">My Contracts</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by laptop name or contract number..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laptop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deposit
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
                {currentItems.length > 0 ? (
                  currentItems.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contract.contractNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contract.laptopName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(contract.startDate), 'dd/MM/yyyy')} - {format(new Date(contract.endDate), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(contract.depositAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${contract.status === 'active' ? 'bg-green-100 text-green-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewDetails(contract)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadContract(contract.id)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Download Contract"
                          >
                            <FaFileDownload className="w-5 h-5" />
                          </button>
                          {contract.status === 'active' && (
                            <button
                              onClick={() => handleConfirmReturn(contract.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Confirm Return"
                            >
                              <FaCheckCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      No contracts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredContracts.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredContracts.length)} of {filteredContracts.length} entries
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
                      ${currentPage === i + 1 ? 'bg-purple-500 text-white' : ''}`}
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
          )}
        </>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Contract Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contract Number</h3>
                  <p className="text-lg">{selectedContract.contractNumber}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${selectedContract.status === 'active' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Laptop</h3>
                <p className="text-lg">{selectedContract.laptopName}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Borrow Period</h3>
                  <p>{format(new Date(selectedContract.startDate), 'dd/MM/yyyy')} - {format(new Date(selectedContract.endDate), 'dd/MM/yyyy')}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Deposit Amount</h3>
                  <p className="font-semibold">{formatCurrency(selectedContract.depositAmount)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Laptop Condition Before Borrowing</h3>
                <p>{selectedContract.laptopCondition.beforeBorrow}</p>
              </div>
              
              {selectedContract.status === 'completed' && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Return Date</h3>
                    <p>{format(new Date(selectedContract.returnDate), 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Laptop Condition After Return</h3>
                    <p>{selectedContract.laptopCondition.afterReturn}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleDownloadContract(selectedContract.id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <FaFileDownload className="mr-2" />
                Download Contract
              </button>
              
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
    </div>
  );
};

export default Contractstudent; 