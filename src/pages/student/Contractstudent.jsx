import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaFileDownload,
  FaCheckCircle,
} from "react-icons/fa";
import borrowcontractApi from "../../api/borrowcontractApi";
import borrowrequestApi from "../../api/borrowrequestApi";

// Đảm bảo đã import jwt-decode

const Contractstudent = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowRequestDetails, setBorrowRequestDetails] = useState(null);
  const [userId, setUserId] = useState(null);

  // Lấy userId từ token khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        const userIdFromToken = decodedToken.userId;
        console.log("Decoded userId:", userIdFromToken);
        setUserId(Number(userIdFromToken));
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Error decoding token");
      }
    }
  }, []);

  // Gọi fetchContracts khi userId thay đổi
  useEffect(() => {
    if (userId !== null) {
      // Chỉ gọi khi userId đã được set
      fetchContracts();
    }
  }, [userId]);

  const fetchBorrowRequestDetails = async (id) => {
    try {
      const response = await borrowrequestApi.getBorrowRequestById(id);
      if (response.isSuccess) {
        setBorrowRequestDetails(response.data);
      } else {
        throw new Error("Failed to fetch borrow request details");
      }
    } catch (error) {
      console.error("Error fetching borrow request details:", error);
      toast.error(error.message || "Error fetching details");
    }
  };

  const fetchContracts = async () => {
    try {
      setLoading(true);
      console.log("Bắt đầu gọi API");
      const response = await borrowcontractApi.getAllBorrowContracts();
      console.log("Phản hồi từ API:", response);

      if (!response || !response.data) {
        throw new Error("No data received from server");
      }

      if (response.isSuccess) {
        console.log("Dữ liệu thô:", response.data);
        const transformedContracts = response.data
          .map((contract) => {
            console.log("Đang ánh xạ contract:", contract);
            return {
              id: contract.contractId,
              requestId: contract.requestId,
              userId: contract.userId, // Thêm userId vào đối tượng
              contractNumber: `CTR-${contract.contractId}`,
              laptopName: contract.terms.split("Contract for ")[1] || "Unknown",
              startDate: contract.contractDate,
              endDate: contract.expectedReturnDate,
              status:
                contract.status.toLowerCase() === "pending"
                  ? "active"
                  : "completed",
              depositAmount: contract.itemValue * 0.1,
              returnDate: null,
              laptopCondition: {
                beforeBorrow: contract.conditionBorrow,
                afterReturn: null,
              },
            };
          })
          .filter((contract) => contract.userId === userId); // Lọc theo userId
        console.log("Dữ liệu sau ánh xạ và lọc:", transformedContracts);
        setContracts(transformedContracts);
      } else {
        throw new Error(response.data.message || "Failed to fetch contract data");
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error(error.message || "Unable to load contract list");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    console.log("Fetching details for request ID:", contract.requestId);
    fetchBorrowRequestDetails(contract.requestId);
    setIsModalOpen(true);
  };

  const handleDownloadContract = (id) => {
    toast.info(`Downloading contract #${id}...`);
    setTimeout(() => {
      toast.success("Contract downloaded successfully");
    }, 1500);
  };

  const handleConfirmReturn = async (id) => {
    if (
      window.confirm("Are you sure you want to confirm returning this laptop?")
    ) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setContracts(
          contracts.map((contract) =>
            contract.id === id
              ? {
                  ...contract,
                  status: "completed",
                  returnDate: new Date().toISOString(),
                  laptopCondition: {
                    ...contract.laptopCondition,
                    afterReturn: "Trả lại trong tình trạng tốt",
                  },
                }
              : contract
          )
        );
        toast.success("Return confirmed successfully");
      } catch (error) {
        console.error("Error confirming return:", error);
        toast.error("Unable to confirm return");
      }
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.laptopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || contract.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContracts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-6">My Contracts</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by laptop name or contract number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              className="p-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
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
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Contract Number
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Time Period
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Deposit
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((contract) => (
                      <tr
                        key={contract.id}
                        className="border-t border-gray-200 hover:bg-amber-50"
                      >
                        <td className="px-4 py-3 text-sm text-black">
                          {contract.contractNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {format(new Date(contract.startDate), "dd/MM/yyyy")} -{" "}
                          {format(new Date(contract.endDate), "dd/MM/yyyy")}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {formatCurrency(contract.depositAmount)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              contract.status === "active"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {contract.status === "active"
                              ? "Active"
                              : "Completed"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleViewDetails(contract)}
                              className="text-gray-500 hover:text-amber-600"
                              title="View Details"
                            >
                              <FaEye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadContract(contract.id)
                              }
                              className="text-gray-500 hover:text-amber-600"
                              title="Download Contract"
                            >
                              <FaFileDownload className="w-5 h-5" />
                            </button>
                            {contract.status === "active" && (
                              <button
                                onClick={() => handleConfirmReturn(contract.id)}
                                className="text-gray-500 hover:text-amber-600"
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
                      <td
                        colSpan="5" // Sửa colSpan thành 5 vì đã bỏ cột Laptop
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No contracts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredContracts.length > 0 && (
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div>
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredContracts.length)} of{" "}
                  {filteredContracts.length} contracts
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-200 rounded hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border border-gray-200 rounded ${
                        currentPage === i + 1
                          ? "bg-amber-600 text-white"
                          : "hover:bg-amber-50"
                      } transition-colors duration-200`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-200 rounded hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Details Modal */}
        {isModalOpen && selectedContract && borrowRequestDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Contract Details
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-amber-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Contract Number</p>
                    <p className="text-sm text-black font-medium">
                      {selectedContract.contractNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedContract.status === "active"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedContract.status === "active"
                        ? "Active"
                        : "Completed"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Laptop</p>
                  <p className="text-sm text-black font-medium">
                    {borrowRequestDetails.itemName}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Borrow Period</p>
                    <p className="text-sm text-black">
                      {format(
                        new Date(selectedContract.startDate),
                        "dd/MM/yyyy"
                      )}{" "}
                      -{" "}
                      {format(new Date(selectedContract.endDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deposit</p>
                    <p className="text-sm text-black font-medium">
                      {formatCurrency(selectedContract.depositAmount)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Laptop Condition Before Borrowing
                  </p>
                  <p className="text-sm text-black">
                    {selectedContract.laptopCondition.beforeBorrow}
                  </p>
                </div>

                {/* Display additional borrow request details */}
                {borrowRequestDetails && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Borrower Name</p>
                      <p className="text-sm text-black font-medium">
                        {borrowRequestDetails.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-black font-medium">
                        {borrowRequestDetails.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-sm text-black font-medium">
                        {borrowRequestDetails.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Borrowed Laptop</p>
                      <p className="text-sm text-black font-medium">
                        {borrowRequestDetails.itemName}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleDownloadContract(selectedContract.id)}
                  className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors duration-200 text-sm flex items-center"
                >
                  <FaFileDownload className="mr-2" />
                  Download Contract
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded text-black hover:bg-amber-50 transition-colors duration-200 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contractstudent;
