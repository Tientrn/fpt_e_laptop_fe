import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaFileDownload,
  FaCheckCircle,
  FaCopy,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSpinner,
  FaExclamationCircle,
  FaTimes
} from "react-icons/fa";
import borrowcontractApi from "../../api/borrowcontractApi";
import borrowrequestApi from "../../api/borrowrequestApi";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
          <p className="mt-3 text-indigo-600 font-medium">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaCopy className="mr-3" /> My Contracts
            </h1>
            <p className="text-indigo-100 mt-1">Manage your laptop borrowing contracts</p>
          </div>

          {/* Search and Filter Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 md:flex md:items-center md:justify-between">
            <div className="relative flex-1 mb-3 md:mb-0 md:mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by laptop name or contract number..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2 border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <FaFilter className="text-gray-500 mr-2" />
              <select
                className="block rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2 border"
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
          <div className="px-6 py-4">
            {currentItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contract Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Period
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deposit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((contract) => (
                      <tr
                        key={contract.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{contract.contractNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaCalendarAlt className="text-indigo-400 mr-2" />
                            <span>
                              {format(new Date(contract.startDate), "dd/MM/yyyy")} - {format(new Date(contract.endDate), "dd/MM/yyyy")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <FaMoneyBillWave className="text-green-500 mr-2" />
                            {formatCurrency(contract.depositAmount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              contract.status === "active"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <span className={`h-2 w-2 rounded-full mr-1.5 ${
                              contract.status === "active" ? "bg-indigo-400" : "bg-gray-400"
                            }`}></span>
                            {contract.status === "active"
                              ? "Active"
                              : "Completed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewDetails(contract)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                              title="View Details"
                            >
                              <FaEye className="mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadContract(contract.id)
                              }
                              className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                              title="Download Contract"
                            >
                              <FaFileDownload className="mr-1" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                            {contract.status === "active" && (
                              <button
                                onClick={() => handleConfirmReturn(contract.id)}
                                className="text-green-600 hover:text-green-900 flex items-center text-sm"
                                title="Confirm Return"
                              >
                                <FaCheckCircle className="mr-1" />
                                <span className="hidden sm:inline">Return</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-indigo-400 mb-4">
                  <FaExclamationCircle className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Contracts Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || filterStatus !== "all" 
                    ? "No contracts match your current filters. Try adjusting your search criteria."
                    : "You don't have any active contracts yet."}
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredContracts.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredContracts.length)} of{" "}
                  {filteredContracts.length} contracts
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  {totalPages <= 5 ? (
                    // Show all pages if total pages are 5 or less
                    [...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border rounded-md text-sm font-medium ${
                          currentPage === i + 1
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-300 text-gray-700 hover:bg-indigo-50"
                        } transition-colors duration-200`}
                      >
                        {i + 1}
                      </button>
                    ))
                  ) : (
                    // Show limited pages with ellipsis for more than 5 pages
                    <>
                      {[...Array(Math.min(3, totalPages))].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === i + 1
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-gray-300 text-gray-700 hover:bg-indigo-50"
                          } transition-colors duration-200`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      {totalPages > 3 && currentPage < totalPages - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      
                      {totalPages > 3 && (
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === totalPages
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-gray-300 text-gray-700 hover:bg-indigo-50"
                          } transition-colors duration-200`}
                        >
                          {totalPages}
                        </button>
                      )}
                    </>
                  )}
                  
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {isModalOpen && selectedContract && borrowRequestDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Contract Details
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-indigo-100 focus:outline-none"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-xs text-indigo-600 font-medium mb-1">Contract Number</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {selectedContract.contractNumber}
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-xs text-indigo-600 font-medium mb-1">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedContract.status === "active"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full mr-1.5 ${
                          selectedContract.status === "active" ? "bg-indigo-400" : "bg-gray-400"
                        }`}></span>
                        {selectedContract.status === "active"
                          ? "Active"
                          : "Completed"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-xs text-indigo-600 font-medium mb-1">Laptop</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {borrowRequestDetails.itemName}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-xs text-indigo-600 font-medium mb-1">Borrow Period</p>
                      <p className="text-sm text-gray-900">
                        {format(
                          new Date(selectedContract.startDate),
                          "dd/MM/yyyy"
                        )}{" "}
                        -{" "}
                        {format(new Date(selectedContract.endDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-xs text-indigo-600 font-medium mb-1">Deposit</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatCurrency(selectedContract.depositAmount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-xs text-indigo-600 font-medium mb-1">
                      Laptop Condition Before Borrowing
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedContract.laptopCondition.beforeBorrow}
                    </p>
                  </div>

                  {/* Borrower Information */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Borrower Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Borrower Name</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {borrowRequestDetails.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {borrowRequestDetails.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {borrowRequestDetails.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => handleDownloadContract(selectedContract.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm flex items-center"
                  >
                    <FaFileDownload className="mr-2" />
                    Download Contract
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contractstudent;
