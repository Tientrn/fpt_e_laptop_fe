import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import borrowcontractApi from "../../api/borrowcontractApi";
import borrowRequestApi from "../../api/borrowRequestApi";
import userinfoApi from "../../api/userinfoApi";

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
        toast.error("Failed to load contracts");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error loading contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedRequests = async () => {
    try {
      const response = await borrowRequestApi.getAllBorrowRequests();
      if (response.isSuccess) {
        const approvedReqs = response.data.filter(
          (req) => req.status === "Approved"
        );
        setApprovedRequests(approvedReqs);
      }
    } catch (error) {
      console.error("Error fetching approved requests:", error);
      toast.error("Error loading approved requests");
    }
  };

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
    });
    setIsModalOpen(true);
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      if (
        !contractForm.requestId ||
        !contractForm.itemId ||
        !contractForm.itemValue
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const contractData = {
        ...contractForm,
        requestId: parseInt(contractForm.requestId),
        itemId: parseInt(contractForm.itemId),
        itemValue: parseInt(contractForm.itemValue),
        conditionBorrow: contractForm.conditionBorrow || "good",
        terms: contractForm.terms || "summer 2025",
      };

      const response = await borrowcontractApi.createBorrowContract(
        contractData
      );
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
          expectedReturnDate: format(
            new Date(),
            "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
          ),
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
        <h1 className="text-2xl font-semibold text-black">
          Contract Management
        </h1>
        <span className="text-sm text-amber-600 font-medium">
          Staff Dashboard
        </span>
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
                  "Request ID",
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
                    #{request.requestId}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {userInfoMap[request.userId]?.fullName || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {userInfoMap[request.userId]?.email || "N/A"}
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
                    "Request ID",
                    "Full Name",
                    "Email",
                    "Item Value",
                    "Expected Return",
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
                {contracts.map((contract) => (
                  <tr key={contract.contractId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-black">
                      #{contract.contractId}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      #{contract.requestId}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {userInfoMap[contract.userId]?.fullName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {userInfoMap[contract.userId]?.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      ${contract.itemValue}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {format(
                        new Date(contract.expectedReturnDate),
                        "dd/MM/yyyy"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/staff/deposits/create/${contract.contractId}`)
                          }
                          className="px-3 py-1 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
                        >
                          Create Deposit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteContract(contract.contractId)
                          }
                          className="px-3 py-1 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
                        >
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
