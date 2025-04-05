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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchContracts(),
        fetchApprovedRequests(),
        fetchDeposits(),
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      for (const contract of contracts) {
        if (contract.userId && !userInfoMap[contract.userId]) {
          try {
            console.log(`Fetching user info for contract ${contract.contractId}, userId: ${contract.userId}`);
            const response = await userApi.getUserById(contract.userId);
            if (response.isSuccess) {
              console.log(`User info received:`, response.data);
              setUserInfoMap(prev => ({
                ...prev,
                [contract.userId]: response.data
              }));
            }
          } catch (error) {
            console.error(`Error fetching user info for contract ${contract.contractId}:`, error);
          }
        }
      }
    };

    if (contracts.length > 0) {
      fetchUserInfo();
    }
  }, [contracts]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await borrowcontractApi.getAllBorrowContracts();
      if (response.isSuccess) {
        setContracts(response.data || []);

        // Fetch user info for borrowers (students)
        const borrowerIds = [
          ...new Set(response.data.map((contract) => contract.userId)),
        ];
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
      const [requestResponse, contractResponse] = await Promise.all([
        borrowRequestApi.getAllBorrowRequests(),
        borrowcontractApi.getAllBorrowContracts(),
      ]);

      if (requestResponse.isSuccess && contractResponse.isSuccess) {
        const existingContractRequestIds = contractResponse.data.map(
          (contract) => contract.requestId
        );

        // Lọc ra các request có status "Approved" và chưa có contract
        const approved = requestResponse.data.filter(
          (request) =>
            request.status === "Approved" &&
            !existingContractRequestIds.includes(request.requestId)
        );

        setApprovedRequests(approved);

        // Fetch user info cho các approved requests
        const userIds = [...new Set(approved.map((request) => request.userId))];
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
            setUserInfoMap((prev) => ({
              ...prev,
              [userId]: response.data,
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
        const depositsMap = response.data.reduce((acc, deposit) => {
          acc[deposit.contractId] = {
            ...deposit,
            status: deposit.status || "Completed"  // <- Đây là vấn đề
          };
          return acc;
        }, {});
        setDeposits(depositsMap);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
      toast.error("Failed to load deposits");
    }
  };

  const handleRequestSelect = (request) => {
    console.log("Selected Request:", request);
  
    // Reset form và set giá trị mới
    setContractForm({
      requestId: request.requestId,
      itemId: request.itemId,
      itemValue: 0,
      terms: `Contract for ${request.itemName}`,
      conditionBorrow: "good",
      expectedReturnDate: format(new Date(), "yyyy-MM-dd"),
      userId: request.userId
    });
  
    // Set selected request
    setSelectedRequest(request);
    
    // Đảm bảo mở modal
    setIsModalOpen(true);
    
    console.log("Modal should open:", true);
    console.log("New Contract Form:", contractForm);
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

      const formattedDate = new Date(
        contractForm.expectedReturnDate
      ).toISOString();

      const contractData = {
        requestId: parseInt(contractForm.requestId),
        itemId: parseInt(contractForm.itemId),
        itemValue: parseInt(contractForm.itemValue),
        conditionBorrow: contractForm.conditionBorrow || "good",
        terms: contractForm.terms || "summer 2025",
        expectedReturnDate: formattedDate,
        userId: selectedRequest.userId,
      };

      const response = await borrowcontractApi.createBorrowContract(
        contractData
      );
      if (response.isSuccess) {
        toast.success("Contract created successfully");
        setIsModalOpen(false);

        // Cập nhật lại state contracts và approvedRequests
        setContracts((prevContracts) => [...prevContracts, response.data]);
        setApprovedRequests((prevRequests) =>
          prevRequests.filter(
            (request) => request.requestId !== contractForm.requestId
          )
        );

        // Refresh data
        await Promise.all([
          fetchContracts(),
          fetchApprovedRequests(),
          fetchDeposits(),
        ]);

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

  const handleDeleteContract = async (contract) => {
    try {
      // Xóa deposit trước nếu có
      if (deposits[contract.contractId]) {
        const deleteDepositResponse = await deposittransactionApi.deleteDepositTransaction(
          deposits[contract.contractId].depositId
        );
        if (!deleteDepositResponse.isSuccess) {
          toast.error("Failed to delete associated deposit");
          return;
        }
      }

      // Sau đó xóa contract
      const response = await borrowcontractApi.deleteBorrowContract(contract.contractId);
      if (response.isSuccess) {
        toast.success("Contract and associated deposit deleted successfully");
        await Promise.all([fetchContracts(), fetchDeposits()]);
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Failed to delete contract");
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast.error("Error deleting contract");
    }
  };

  const handleDetailClick = async (contract) => {
    try {
      // Lấy thông tin request tương ứng với contract
      const response = await borrowRequestApi.getBorrowRequestById(
        contract.requestId
      );
      if (response.isSuccess) {
        setSelectedContract({
          ...contract,
          requestDetails: response.data,
        });
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
      toast.error("Failed to load request details");
    }
  };

  const handleDepositCreated = async () => {
    try {
      await Promise.all([
        fetchContracts(),
        fetchDeposits()
      ]);

      // Cập nhật status của contract thành Borrowing
      const updatedContracts = contracts.map(contract => {
        if (deposits[contract.contractId]) {
          return {
            ...contract,
            status: "Borrowing"
          };
        }
        return contract;
      });
      setContracts(updatedContracts);
      
    } catch (error) {
      console.error("Error updating after deposit creation:", error);
      toast.error("Failed to update contract status");
    }
  };

  const handleCreateDeposit = async (contractId) => {
    try {
      // Tạo deposit transaction
      const createResponse = await deposittransactionApi.createDepositTransaction({
        contractId: contractId,
        amount: selectedContract.itemValue,
        status: "Pending",
        depositDate: new Date().toISOString()
      });

      if (createResponse.isSuccess) {
        // Cập nhật status của deposit thành Completed
        const updateResponse = await deposittransactionApi.updateDepositTransaction(
          createResponse.data.depositId,
          {
            ...createResponse.data,
            status: "Completed"
          }
        );

        if (updateResponse.isSuccess) {
          toast.success("Deposit created and completed successfully");
          await fetchDeposits(); // Refresh deposits data
        }
      }
    } catch (error) {
      console.error("Error creating/updating deposit:", error);
      toast.error("Failed to process deposit");
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
                      onClick={() => {
                        console.log("Create Contract button clicked");
                        handleRequestSelect(request);
                      }}
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
                      {contract.contractId}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {userInfoMap[contract.userId]?.fullName || "Loading..."}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {userInfoMap[contract.userId]?.email || "Loading..."}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {contract.itemValue}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {format(
                        new Date(contract.expectedReturnDate),
                        "dd/MM/yyyy"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
    deposits[contract.contractId] 
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800"
  }`}>
    {deposits[contract.contractId] ? "Completed" : "Pending"}
  </span>
</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDetailClick(contract)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Detail
                        </button>
                        {!deposits[contract.contractId] ? (
                          <button
                            onClick={() =>
                              (window.location.href = `/staff/deposits/create/${contract.contractId}`)
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Create Deposit
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setContractToDelete(contract);
                              setIsDeleteModalOpen(true);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete Contract
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
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Contract</h2>
            
            <form onSubmit={handleCreateContract}>
              <div className="space-y-4">
                {/* Item Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Item Value
                  </label>
                  <input
                    type="number"
                    value={contractForm.itemValue}
                    onChange={(e) => setContractForm({
                      ...contractForm,
                      itemValue: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>

                {/* Terms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Terms
                  </label>
                  <input
                    type="text"
                    value={contractForm.terms}
                    onChange={(e) => setContractForm({
                      ...contractForm,
                      terms: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                {/* Expected Return Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expected Return Date
                  </label>
                  <input
                    type="date"
                    value={contractForm.expectedReturnDate.split('T')[0]}
                    onChange={(e) => setContractForm({
                      ...contractForm,
                      expectedReturnDate: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {isDetailModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Contract Details #{selectedContract.contractId}
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contract Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-amber-500">
                  Contract Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">
                      Contract ID:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.contractId}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Item Value:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.itemValue}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Expected Return:{" "}
                    </span>
                    <span className="text-gray-600">
                      {format(
                        new Date(selectedContract.expectedReturnDate),
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Condition:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.conditionBorrow}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Terms: </span>
                    <span className="text-gray-600">
                      {selectedContract.terms}
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Information */}
              {/* Request Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-amber-500">
                  Request Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">
                      Full Name:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Email: </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.email}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Phone Number:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.phoneNumber}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Item Name:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.itemName}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Start Date:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.startDate
                        ? format(
                            new Date(selectedContract.requestDetails.startDate),
                            "dd/MM/yyyy"
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      End Date:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.endDate
                        ? format(
                            new Date(selectedContract.requestDetails.endDate),
                            "dd/MM/yyyy"
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Status:{" "}
                    </span>
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded-full
        ${
          selectedContract.requestDetails?.status === "Approved"
            ? "bg-green-100 text-green-800"
            : selectedContract.requestDetails?.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}
                    >
                      {selectedContract.requestDetails?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this contract? This will also delete any associated deposits.
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (contractToDelete) {
                    handleDeleteContract(contractToDelete);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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

export default ContractsPage;
