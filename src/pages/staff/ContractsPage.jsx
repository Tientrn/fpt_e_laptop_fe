import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import borrowcontractApi from '../../api/borrowcontractApi';
import borrowRequestApi from '../../api/borrowRequestApi';
import userinfoApi from '../../api/userinfoApi';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [contractForm, setContractForm] = useState({
    requestId: 0,
    itemId: 0,
    terms: '',
    conditionBorrow: '',
    itemValue: 0,
    expectedReturnDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
  });
  const [userInfoMap, setUserInfoMap] = useState({});

  useEffect(() => {
    fetchContracts();
    fetchApprovedRequests();
    fetchUserInfo();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await borrowcontractApi.getAllBorrowContracts();
      if (response.isSuccess) {
        setContracts(response.data || []);
      } else {
        toast.error('Failed to load contracts');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error loading contracts');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedRequests = async () => {
    try {
      const response = await borrowRequestApi.getAllBorrowRequests();
      if (response.isSuccess) {
        const approvedReqs = response.data.filter(req => req.status === 'Approved');
        setApprovedRequests(approvedReqs);
      }
    } catch (error) {
      console.error('Error fetching approved requests:', error);
      toast.error('Error loading approved requests');
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await userinfoApi.getUserInfo();
      if (response.isSuccess) {
        const userMap = {};
        response.data.forEach(user => {
          userMap[user.userId] = {
            fullName: user.fullName,
            email: user.email
          };
        });
        setUserInfoMap(userMap);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleRequestSelect = (request) => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    setSelectedRequest(request);
    setContractForm({
      ...contractForm,
      requestId: request.requestId,
      itemId: request.itemId,
      itemValue: 0,
      terms: `Contract for ${request.itemName}`,
      conditionBorrow: 'good',
      expectedReturnDate: formattedDate
    });
    setIsModalOpen(true);
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!contractForm.requestId || !contractForm.itemId || !contractForm.itemValue) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Log data trước khi gửi
      const contractData = {
        ...contractForm,
        requestId: parseInt(contractForm.requestId),
        itemId: parseInt(contractForm.itemId),
        itemValue: parseInt(contractForm.itemValue),
        conditionBorrow: contractForm.conditionBorrow || "good",
        terms: contractForm.terms || "summer 2025"
      };
      console.log('Contract Data:', contractData);

      const response = await borrowcontractApi.createBorrowContract(contractData);
      console.log('API Response:', response); // Log response

      if (response.isSuccess) {
        toast.success('Contract created successfully');
        setIsModalOpen(false);
        fetchContracts();
        setContractForm({
          requestId: 0,
          itemId: 0,
          terms: '',
          conditionBorrow: '',
          itemValue: 0,
          expectedReturnDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
        });
      } else {
        toast.error(response.message || 'Failed to create contract');
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      // Log chi tiết error
      if (error.response) {
        console.log('Error Response:', error.response.data);
        console.log('Error Status:', error.response.status);
        console.log('Error Headers:', error.response.headers);
      }
      toast.error(error.response?.data?.message || 'Error creating contract');
    }
  };

  const handleDeleteContract = async (contractId) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        const response = await borrowcontractApi.deleteBorrowContract(contractId);
        if (response.isSuccess) {
          toast.success('Contract deleted successfully');
          fetchContracts(); // Refresh the contracts list
        } else {
          toast.error(response.message || 'Failed to delete contract');
        }
      } catch (error) {
        console.error('Error deleting contract:', error);
        toast.error('Error deleting contract');
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Contract Management System
      </h1>

      {/* Approved Requests Section */}
      <div className="mb-12 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Approved Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvedRequests.map((request) => (
                <tr key={request.requestId} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{request.requestId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {userInfoMap[request.userId]?.fullName || 'Loading...'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userInfoMap[request.userId]?.email || 'Loading...'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleRequestSelect(request)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Create Contract
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Existing Contracts Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Existing Contracts
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contract ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Value</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expected Return</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.contractId} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{contract.contractId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#{contract.requestId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {userInfoMap[contract.userId]?.fullName || 'Loading...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userInfoMap[contract.userId]?.email || 'Loading...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${contract.itemValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {format(new Date(contract.expectedReturnDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.location.href = `/staff/deposits/create/${contract.contractId}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create Deposit
                        </button>
                        
                        <button
                          onClick={() => handleDeleteContract(contract.contractId)}
                          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Create Contract for Request #{selectedRequest?.requestId}
            </h2>
            <form onSubmit={handleCreateContract} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request ID
                </label>
                <input
                  type="number"
                  value={contractForm.requestId}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item ID
                </label>
                <input
                  type="number"
                  value={contractForm.itemId}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terms
                </label>
                <textarea
                  value={contractForm.terms}
                  onChange={(e) => setContractForm({...contractForm, terms: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition When Borrow
                </label>
                <textarea
                  value={contractForm.conditionBorrow}
                  onChange={(e) => setContractForm({...contractForm, conditionBorrow: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Value
                </label>
                <input
                  type="number"
                  value={contractForm.itemValue}
                  onChange={(e) => setContractForm({...contractForm, itemValue: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Return Date
                </label>
                <input
                  type="datetime-local"
                  value={contractForm.expectedReturnDate.slice(0, 16)}
                  onChange={(e) => setContractForm({...contractForm, expectedReturnDate: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage; 