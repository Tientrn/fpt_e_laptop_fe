import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import borrowcontractApi from "../../api/borrowcontractApi";
import borrowRequestApi from "../../api/borrowRequestApi";
import userApi from "../../api/userApi";
import deposittransactionApi from "../../api/deposittransactionApi";

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [contractForm, setContractForm] = useState({
    requestId: 0,
    itemId: 0,
    terms: "",
    conditionBorrow: "",
    itemValue: 0,
    expectedReturnDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  });
  const [userInfoMap, setUserInfoMap] = useState({});
  const [deposits, setDeposits] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchContracts(),
        fetchApprovedRequests(),
        fetchDeposits()
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Contracts:", contracts);
    console.log("Approved Requests:", approvedRequests);
    console.log("User Info Map:", userInfoMap);
    console.log("Deposits:", deposits);
  }, [contracts, approvedRequests, userInfoMap, deposits]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await borrowcontractApi.getAllBorrowContracts();
      if (response.isSuccess) {
        setContracts(response.data || []);
        
        // Fetch user info for borrowers (students)
        const borrowerIds = [...new Set(response.data.map(contract => contract.userId))];
        await fetchUserInfoForIds(borrowerIds);
      } else {
        toast.error("Failed to load contracts");
      }
    } catch (error) {
      console.error("Error loading contracts:", error);
      toast.error("Error loading contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedRequests = async () => {
    try {
      const response = await borrowRequestApi.getAllBorrowRequests();
      if (response.isSuccess) {
        const approved = response.data.filter(request => request.status === "Approved");
        setApprovedRequests(approved);
        
        // Fetch user info for approved requests
        const userIds = [...new Set(approved.map(request => request.userId))];
        await fetchUserInfoForIds(userIds);
      }
    } catch (error) {
      console.error("Error fetching approved requests:", error);
      toast.error("Failed to load approved requests");
    }
  };

  const fetchUserInfoForIds = async (userIds) => {
    try {
      for (const userId of userIds) {
        if (!userInfoMap[userId]) {
          const response = await userApi.getUserById(userId);
          if (response.isSuccess) {
            setUserInfoMap(prev => ({
              ...prev,
              [userId]: response.data
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await deposittransactionApi.getAllDepositTransactions();
      if (response.isSuccess) {
        const depositMap = {};
        response.data.forEach(deposit => {
          depositMap[deposit.contractId] = deposit;
        });
        setDeposits(depositMap);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
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
      conditionBorrow: "good",
      expectedReturnDate: formattedDate,
      userId: request.userId
    });
    setIsModalOpen(true);
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      if (!contractForm.requestId || !contractForm.itemId || !contractForm.itemValue) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Format the date correctly
      const formattedDate = new Date(contractForm.expectedReturnDate)
        .toISOString();

      const contractData = {
        requestId: parseInt(contractForm.requestId),
        itemId: parseInt(contractForm.itemId),
        itemValue: parseInt(contractForm.itemValue),
        conditionBorrow: contractForm.conditionBorrow || "good",
        terms: contractForm.terms || "summer 2025",
        expectedReturnDate: formattedDate,
        userId: selectedRequest.userId
      };

      const response = await borrowcontractApi.createBorrowContract(contractData);
      if (response.isSuccess) {
        toast.success("Contract created successfully");
        setIsModalOpen(false);
        fetchContracts();
        setContractForm({
          requestId: 0,
          itemId: 0,
          terms: "",
          conditionBorrow: "",
          itemValue: 0,
          expectedReturnDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        });
      } else {
        toast.error(response.message || "Failed to create contract");
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      toast.error(error.response?.data?.message || "Error creating contract");
    }
  };

  const handleDeleteContract = async (contractId) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        const response = await borrowcontractApi.deleteBorrowContract(
          contractId
        );
        if (response.isSuccess) {
          toast.success("Contract deleted successfully");
          fetchContracts();
        } else {
          toast.error(response.message || "Failed to delete contract");
        }
      } catch (error) {
        console.error("Error deleting contract:", error);
        toast.error("Error deleting contract");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header with Staff Role Indicator */}
      <div className="mb-6">
        <h1 className="text-2xl text-center font-semibold text-black">
          Contract Management
        </h1>
        
      </div>

      {/* Approved Requests Section */}
      <div className="mb-8 bg-white border border-slate-200 rounded-md shadow-sm p-6">
        <h2 className="text-lg font-semibold text-black mb-4">
          Approved Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "ID",
                  "Full Name",
                  "Email",
                  "Item Name",
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
              {approvedRequests.map((request) => (
                <tr key={request.requestId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-black">
                    {request.requestId}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {userInfoMap[request.userId]?.fullName || "Loading..."}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {userInfoMap[request.userId]?.email || "Loading..."}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {request.itemName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleRequestSelect(request)}
                      className="px-3 py-1 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
                    >
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
      <div className="bg-white border border-slate-200 rounded-md shadow-sm p-6">
        <h2 className="text-lg font-semibold text-black mb-4">
          Existing Contracts
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Contract ID",
                    "Full Name",
                    "Email",
                    "Item Value",
                    "Expected Return",
                    "Status",
                    "Actions"
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
                {contracts.map((contract) => (
                  <tr key={contract.contractId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-black">
                      {contract.contractId}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {userInfoMap[contract.userId]?.fullName || "Loading..."}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {userInfoMap[contract.userId]?.email || "Loading..."}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      ${contract.itemValue}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {format(new Date(contract.expectedReturnDate), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {!deposits[contract.contractId] ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          deposits[contract.contractId].status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {deposits[contract.contractId].status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        {!deposits[contract.contractId] ? (
                          <button
                            onClick={() => window.location.href = `/staff/deposits/create/${contract.contractId}`}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Create Deposit
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteContract(contract.contractId)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete Deposit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-black mb-4">
              Create Contract for Request #{selectedRequest?.requestId}
            </h2>
            <form onSubmit={handleCreateContract} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Request ID
                </label>
                <input
                  type="number"
                  value={contractForm.requestId}
                  disabled
                  className="w-full p-2 border border-slate-300 rounded-md bg-slate-100 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Item ID
                </label>
                <input
                  type="number"
                  value={contractForm.itemId}
                  disabled
                  className="w-full p-2 border border-slate-300 rounded-md bg-slate-100 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Terms
                </label>
                <textarea
                  value={contractForm.terms}
                  onChange={(e) =>
                    setContractForm({ ...contractForm, terms: e.target.value })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Condition When Borrow
                </label>
                <textarea
                  value={contractForm.conditionBorrow}
                  onChange={(e) =>
                    setContractForm({
                      ...contractForm,
                      conditionBorrow: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Item Value
                </label>
                <input
                  type="number"
                  value={contractForm.itemValue}
                  onChange={(e) =>
                    setContractForm({
                      ...contractForm,
                      itemValue: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Expected Return Date
                </label>
                <input
                  type="datetime-local"
                  value={contractForm.expectedReturnDate.slice(0, 16)}
                  onChange={(e) =>
                    setContractForm({
                      ...contractForm,
                      expectedReturnDate: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
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
