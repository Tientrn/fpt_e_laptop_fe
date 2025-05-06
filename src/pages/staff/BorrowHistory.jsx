import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import borrowhistoryApi from "../../api/borrowhistoryApi";
import donateitemsApi from "../../api/donateitemsApi";
import borrowcontractApi from "../../api/borrowcontractApi";
import userApi from "../../api/userApi";
import reportdamagesApi from "../../api/reportdamagesApi";
import compensationTransactionApi from "../../api/compensationTransactionApi";
import deposittransactionApi from "../../api/deposittransactionApi";
import { formatCurrency } from "../../utils/moneyValidationUtils";

const BorrowHistory = () => {
  const navigate = useNavigate();
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [itemsMap, setItemsMap] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [contractsMap, setContractsMap] = useState({});
  const [reportedDamageItems, setReportedDamageItems] = useState({});
  const [compensationMap, setCompensationMap] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "borrowHistoryId",
    direction: "desc",
  });
  const [reportData, setReportData] = useState({
    file: null,
    ItemId: "",
    BorrowHistoryId: "",
    Note: "",
    ConditionBeforeBorrow: "",
    ConditionAfterReturn: "",
    DamageFee: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositTransactionsMap, setDepositTransactionsMap] = useState({});
  // Add new state variables for security
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(() => {
    // Read from localStorage on initial render
    const saved = localStorage.getItem("showSensitiveInfo");
    return saved === "true";
  });
  const [securityPassword, setSecurityPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Add security functions
  const maskSensitiveInfo = (text) => {
    if (!text) return "";
    if (!showSensitiveInfo) {
      return "•".repeat(text.length);
    }
    return text;
  };

  const maskEmail = (email) => {
    if (!email) return "";
    if (!showSensitiveInfo) {
      const [username, domain] = email.split("@");
      const maskedUsername =
        username.charAt(0) +
        "•".repeat(username.length - 2) +
        username.charAt(username.length - 1);
      return `${maskedUsername}@${domain}`;
    }
    return email;
  };

  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    if (!showSensitiveInfo) {
      return phone.replace(/.(?=.{4})/g, "•");
    }
    return phone;
  };

  const maskValue = (value) => {
    if (!value) return "";
    if (!showSensitiveInfo) {
      return "••••••••";
    }
    return value;
  };

  const handleShowSensitiveInfo = () => {
    if (showSensitiveInfo) {
      setShowSensitiveInfo(false);
      localStorage.setItem("showSensitiveInfo", "false");
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (securityPassword === "admin123") {
      setShowSensitiveInfo(true);
      localStorage.setItem("showSensitiveInfo", "true");
      setIsPasswordModalOpen(false);
      setSecurityPassword("");
    } else {
      toast.error("Incorrect password");
    }
  };

  useEffect(() => {
    fetchBorrowHistory();
    fetchReportDamages();
    fetchCompensationTransactions();
    fetchDepositTransactions();
  }, []);

  useEffect(() => {
    if (borrowHistory.length > 0) {
      fetchUserInfo();
      fetchItemsInfo();
      fetchContracts();
    }
  }, [borrowHistory]);

  const fetchContracts = async () => {
    try {
      const response = await borrowcontractApi.getAllBorrowContracts();
      if (response.isSuccess) {
        // Create a map by requestId for easier lookup
        const contracts = {};
        response.data.forEach((contract) => {
          contracts[contract.requestId] = contract;
        });
        setContractsMap(contracts);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  // Function to check if a contract is expiring soon (within 7 days)
  const isExpiringSoon = (date) => {
    const returnDate = new Date(date);
    const today = new Date();
    const diffTime = returnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const fetchUserInfo = async () => {
    try {
      // Get unique user IDs from borrow history
      const userIds = [...new Set(borrowHistory.map((item) => item.userId))];

      // Fetch user info for each unique userId
      for (const userId of userIds) {
        try {
          const userResponse = await userApi.getUserById(userId);
          if (userResponse.isSuccess && userResponse.data) {
            setUserInfoMap((prev) => ({
              ...prev,
              [userId]: userResponse.data,
            }));
          }
        } catch (error) {
          console.error(`Error fetching user info for user ${userId}:`, error);
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Unable to load user information");
    }
  };

  const fetchBorrowHistory = async () => {
    try {
      const response = await borrowhistoryApi.getAllBorrowHistories();
      if (response.isSuccess) {
        setBorrowHistory(response.data || []);
      } else {
        toast.error("Failed to load borrow history");
      }
    } catch (error) {
      console.error("Error fetching borrow history:", error);
      toast.error("Failed to load borrow history");
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsInfo = async () => {
    try {
      // Get unique item IDs from borrow history
      const itemIds = [...new Set(borrowHistory.map((item) => item.itemId))];

      // Fetch details for each item
      const itemPromises = itemIds.map((id) =>
        donateitemsApi.getDonateItemById(id)
      );
      const itemResponses = await Promise.all(itemPromises);

      // Create a map of item details
      const items = {};
      itemResponses.forEach((response) => {
        if (response.isSuccess && response.data) {
          items[response.data.itemId] = response.data;
        }
      });

      setItemsMap(items);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  // Fetch existing damage reports
  const fetchReportDamages = async () => {
    try {
      const response = await reportdamagesApi.getAllReportDamages();
      if (response.isSuccess) {
        // Create a map of reported items by borrow history ID
        const reportedItems = {};
        response.data.forEach((report) => {
          reportedItems[report.borrowHistoryId] = true;
        });
        setReportedDamageItems(reportedItems);
      }
    } catch (error) {
      console.error("Error fetching damage reports:", error);
    }
  };

  // Fetch compensation transactions
  const fetchCompensationTransactions = async () => {
    try {
      const response =
        await compensationTransactionApi.getAllCompensationTransactions();

      if (response.isSuccess) {
        // Create a map of compensation records by reportDamageId
        const compensationMapByReport = {};

        if (response.data && Array.isArray(response.data)) {
          response.data.forEach((transaction) => {
            if (transaction.reportDamageId) {
              compensationMapByReport[transaction.reportDamageId] = transaction;
            }
          });
        }

        setCompensationMap(compensationMapByReport);
        console.log(
          "Compensation transactions loaded:",
          compensationMapByReport
        );
      } else {
        console.error(
          "Failed to load compensation transactions:",
          response.message
        );
      }
    } catch (error) {
      console.error("Error fetching compensation transactions:", error);
    }
  };

  // Fetch deposit transactions
  const fetchDepositTransactions = async () => {
    try {
      const response = await deposittransactionApi.getAllDepositTransactions();
      if (response.isSuccess && Array.isArray(response.data)) {
        // Map by contractId for quick lookup
        const map = {};
        response.data.forEach((tx) => {
          if (tx.contractId) {
            // Only keep the latest transaction per contractId
            if (
              !map[tx.contractId] ||
              new Date(tx.depositDate) >
                new Date(map[tx.contractId].depositDate)
            ) {
              map[tx.contractId] = tx;
            }
          }
        });
        setDepositTransactionsMap(map);
      }
    } catch (error) {
      console.error("Error fetching deposit transactions:", error);
    }
  };

  // Check if an item should be marked as returned based on compensation
  const isItemReturned = (item) => {
    // First check if the item is already marked as returned
    if (item.status === "Returned") {
      return true;
    }

    // Check if there's a reported damage for this item
    if (!reportedDamageItems[item.borrowHistoryId]) {
      return false;
    }

    // Find the report ID for this borrow history
    const reportId = Object.keys(compensationMap).find((reportId) => {
      // Assuming compensationMap has a reference to borrowHistoryId or we need to get it from reports
      const transaction = compensationMap[reportId];
      const reportDamageId = transaction?.reportDamageId;

      // Now check if there's a damage report for this borrow history that has a compensation
      return (
        reportDamageId &&
        reportedDamageItems[item.borrowHistoryId] &&
        transaction.status === "done"
      );
    });

    return reportId !== undefined;
  };

  const filteredHistory = borrowHistory.filter((item) => {
    const userInfo = userInfoMap[item.userId] || {};
    const itemInfo = itemsMap[item.itemId] || {};

    // Check if any of these fields match the search term
    const matchesSearch = searchTerm
      ? (userInfo.fullName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (userInfo.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (userInfo.studentCode || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (itemInfo.itemName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(item.borrowHistoryId).includes(searchTerm) ||
        String(item.requestId).includes(searchTerm)
      : true;

    // Use correct status naming: 'Borrowing' instead of 'Borrwing'
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "returned" &&
        (item.status === "Returned" || isItemReturned(item))) ||
      (filterStatus === "borrowed" &&
        item.status === "Borrowing" &&
        !isItemReturned(item));

    return matchesSearch && matchesFilter;
  });

  // Sort function
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Apply sorting to filteredHistory
  const sortedFilteredHistory = useMemo(() => {
    let sortableItems = [...filteredHistory];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle nested properties for user and item info
        let aValue, bValue;

        if (sortConfig.key === "userName") {
          aValue = userInfoMap[a.userId]?.fullName || "";
          bValue = userInfoMap[b.userId]?.fullName || "";
        } else if (sortConfig.key === "itemName") {
          aValue = itemsMap[a.itemId]?.itemName || "";
          bValue = itemsMap[b.itemId]?.itemName || "";
        } else if (
          sortConfig.key === "borrowDate" ||
          sortConfig.key === "returnDate"
        ) {
          aValue = new Date(a[sortConfig.key] || 0);
          bValue = new Date(b[sortConfig.key] || 0);
        } else if (sortConfig.key === "expectedReturnDate") {
          aValue = new Date(contractsMap[a.requestId]?.expectedReturnDate || 0);
          bValue = new Date(contractsMap[b.requestId]?.expectedReturnDate || 0);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [filteredHistory, sortConfig, userInfoMap, itemsMap, contractsMap]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFilteredHistory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const toggleRowExpansion = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const handleReportDamage = (item) => {
    setSelectedItem(item);
    setReportData({
      file: null,
      ItemId: item.itemId.toString(),
      BorrowHistoryId: item.borrowHistoryId.toString(),
      Note: "",
      ConditionBeforeBorrow:
        contractsMap[item.requestId]?.conditionBorrow || "",
      ConditionAfterReturn: "",
      DamageFee: 0,
    });
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedItem(null);
    setReportData({
      file: null,
      ItemId: "",
      BorrowHistoryId: "",
      Note: "",
      ConditionBeforeBorrow: "",
      ConditionAfterReturn: "",
      DamageFee: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files && files.length > 0) {
      setReportData({
        ...reportData,
        file: files[0],
      });
    } else if (name === "DamageFee") {
      // Handle empty input
      if (value === "") {
        setReportData({
          ...reportData,
          [name]: "",
        });
        return;
      }

      // Simple numeric validation - just ensure it's a number
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setReportData({
          ...reportData,
          [name]: numericValue,
        });
      }
    } else {
      setReportData({
        ...reportData,
        [name]: value,
      });
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();

    if (
      !reportData.ItemId ||
      !reportData.BorrowHistoryId ||
      !reportData.ConditionAfterReturn
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      if (reportData.file) {
        formData.append("file", reportData.file);
      }
      formData.append("ItemId", reportData.ItemId);
      formData.append("BorrowHistoryId", reportData.BorrowHistoryId);
      formData.append("Note", reportData.Note);
      formData.append(
        "ConditionBeforeBorrow",
        reportData.ConditionBeforeBorrow
      );
      formData.append("ConditionAfterReturn", reportData.ConditionAfterReturn);

      // Set damage fee to 0 if empty string
      formData.append(
        "DamageFee",
        (reportData.DamageFee === "" ? "0" : reportData.DamageFee).toString()
      );

      const response = await reportdamagesApi.createReportDamage(formData);

      if (response.isSuccess) {
        toast.success("Damage report submitted successfully");

        setReportedDamageItems((prev) => ({
          ...prev,
          [reportData.BorrowHistoryId]: true,
        }));

        closeReportModal();

        fetchReportDamages();
      } else {
        toast.error(response.message || "Failed to submit damage report");
      }
    } catch (error) {
      console.error("Error submitting damage report:", error);
      toast.error("Failed to submit damage report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      {/* Enhanced Header with subtle animation */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-amber-100 rounded-full p-3 mb-4 shadow-md transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-10 h-10 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 relative">
            Borrow History
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </h1>
          <p className="text-gray-600 text-center max-w-2xl">
            Manage and track all device borrowing activities
          </p>
        </div>
      </div>

      {/* Add Security Toggle Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleShowSensitiveInfo}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
            showSensitiveInfo
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                showSensitiveInfo
                  ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              }
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                showSensitiveInfo
                  ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  : "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              }
            />
          </svg>
          {showSensitiveInfo ? "Hide Information" : "Show Information"}
        </button>
      </div>

      {/* Add Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Enter Security Password
            </h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={securityPassword}
                onChange={(e) => setSecurityPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter password"
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setSecurityPassword("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Search and Filter Controls with improved visuals */}
      <div className="mb-8 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  filterStatus === "all"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transform"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  ></path>
                </svg>
                All History
              </button>
              <button
                onClick={() => handleFilterChange("returned")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  filterStatus === "returned"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transform"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Returned / Compensated
              </button>
              <button
                onClick={() => handleFilterChange("borrowed")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  filterStatus === "borrowed"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transform"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
                Currently Borrowing
              </button>
            </div>

            <div className="relative w-full md:w-64 group">
              <input
                type="text"
                placeholder="Search by name, email, item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-10 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all group-hover:shadow-md"
              />
              <div className="absolute left-3 top-2.5 text-gray-400 group-hover:text-amber-500 transition-colors">
                <FaSearch />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Improved Manage Damage Reports button */}
      <div className="mb-4 flex justify-end animate-fadeIn">
        <button
          onClick={() => navigate("/staff/report-damages")}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Manage Damage Reports
        </button>
      </div>

      {/* Enhanced Table Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-amber-50">
          <h2 className="text-xl font-bold text-gray-800">
            Borrowing Records
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredHistory.length} items)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-700 to-amber-700 text-white">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-amber-600 transition-colors"
                    onClick={() => handleSort("userName")}
                  >
                    <div className="flex items-center">
                      User
                      {sortConfig.key === "userName" && (
                        <span className="ml-2 bg-white bg-opacity-20 rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                          {sortConfig.direction === "asc" ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 15l7-7 7 7"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-amber-600 transition-colors"
                    onClick={() => handleSort("itemName")}
                  >
                    <div className="flex items-center">
                      Device
                      {sortConfig.key === "itemName" && (
                        <span className="ml-2 bg-white bg-opacity-20 rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                          {sortConfig.direction === "asc" ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 15l7-7 7 7"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-amber-600 transition-colors"
                    onClick={() => handleSort("borrowDate")}
                  >
                    <div className="flex items-center">
                      Dates
                      {sortConfig.key === "borrowDate" && (
                        <span className="ml-2 bg-white bg-opacity-20 rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                          {sortConfig.direction === "asc" ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 15l7-7 7 7"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-amber-600 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "status" && (
                        <span className="ml-2 bg-white bg-opacity-20 rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                          {sortConfig.direction === "asc" ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 15l7-7 7 7"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <>
                      <tr
                        key={item.borrowHistoryId}
                        className={`hover:bg-amber-50 transition-all duration-200 ${
                          item.status === "Borrowing" &&
                          contractsMap[item.requestId] &&
                          isExpiringSoon(
                            contractsMap[item.requestId].expectedReturnDate
                          )
                            ? "bg-yellow-50 hover:bg-yellow-100"
                            : ""
                        } cursor-pointer group`}
                        onClick={() => toggleRowExpansion(item.borrowHistoryId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mr-3 shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-300">
                              <span className="text-amber-600 font-medium text-sm">
                                {userInfoMap[item.userId]?.fullName
                                  ? userInfoMap[item.userId].fullName
                                      .substring(0, 2)
                                      .toUpperCase()
                                  : "U"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900 group-hover:text-amber-700 transition-colors">
                                  {maskSensitiveInfo(
                                    userInfoMap[item.userId]?.fullName
                                  ) || "Unknown User"}
                                </span>
                                {userInfoMap[item.userId]?.roleName && (
                                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-md shadow-sm">
                                    {userInfoMap[item.userId].roleName}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 mt-0.5">
                                {maskEmail(userInfoMap[item.userId]?.email) ||
                                  "No email available"}
                              </span>
                              {userInfoMap[item.userId]?.studentCode && (
                                <span className="text-xs text-amber-600 mt-0.5 flex items-center">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                    ></path>
                                  </svg>
                                  {maskSensitiveInfo(
                                    userInfoMap[item.userId].studentCode
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {itemsMap[item.itemId]?.itemImage ? (
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img
                                  src={itemsMap[item.itemId].itemImage}
                                  alt={itemsMap[item.itemId].itemName}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-md flex items-center justify-center mr-3">
                                <svg
                                  className="w-6 h-6 text-blue-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  ></path>
                                </svg>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {itemsMap[item.itemId]?.itemName ||
                                  "Unknown Device"}
                              </span>
                              {itemsMap[item.itemId] && (
                                <div className="flex items-center mt-0.5">
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <svg
                                      className="w-3 h-3 mr-1 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                      ></path>
                                    </svg>
                                    {itemsMap[item.itemId].cpu || "N/A"}
                                  </span>
                                  <span className="mx-1.5 text-gray-300">
                                    |
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <svg
                                      className="w-3 h-3 mr-1 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                      ></path>
                                    </svg>
                                    {itemsMap[item.itemId].ram || "N/A"}
                                  </span>

                                  <span className="text-xs text-gray-500 mt-0.5 flex items-center">
                                    <svg
                                      className="w-3 h-3 mr-1 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Serial:{" "}
                                    {maskSensitiveInfo(
                                      itemsMap[item.itemId].serialNumber
                                    )}
                                  </span>
                                </div>
                              )}
                              {contractsMap[item.requestId] && (
                                <div className="flex items-center mt-0.5">
                                  <span className="text-xs text-blue-600 font-medium flex items-center">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      ></path>
                                    </svg>
                                    {maskValue(
                                      contractsMap[item.requestId]?.itemValue
                                        ? formatCurrency(
                                            contractsMap[item.requestId]
                                              .itemValue
                                          )
                                        : "N/A"
                                    )}
                                  </span>
                                  {isExpiringSoon(
                                    contractsMap[item.requestId]
                                      .expectedReturnDate
                                  ) && (
                                    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-sm flex items-center">
                                      <svg
                                        className="w-3 h-3 mr-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                      </svg>
                                      Due Soon
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center px-2 py-1 bg-blue-50 rounded-md">
                              <svg
                                className="w-4 h-4 text-blue-500 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                              <span className="text-sm text-gray-700">
                                From:{" "}
                                <span className="font-medium">
                                  {format(
                                    new Date(item.borrowDate),
                                    "dd MMM yyyy"
                                  )}
                                </span>
                              </span>
                            </div>

                            <div
                              className={`flex items-center px-2 py-1 rounded-md ${
                                item.status === "Returned" ||
                                isItemReturned(item)
                                  ? "bg-green-50"
                                  : item.status === "Borrowing" &&
                                    contractsMap[item.requestId] &&
                                    isExpiringSoon(
                                      contractsMap[item.requestId]
                                        .expectedReturnDate
                                    )
                                  ? "bg-red-50"
                                  : "bg-amber-50"
                              }`}
                            >
                              <svg
                                className={`w-4 h-4 mr-1.5 ${
                                  item.status === "Returned" ||
                                  isItemReturned(item)
                                    ? "text-green-500"
                                    : item.status === "Borrowing" &&
                                      contractsMap[item.requestId] &&
                                      isExpiringSoon(
                                        contractsMap[item.requestId]
                                          .expectedReturnDate
                                      )
                                    ? "text-red-500"
                                    : "text-amber-500"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                              <span className="text-sm text-gray-700">
                                To:{" "}
                                <span className="font-medium">
                                  {item.status === "Returned" ||
                                  isItemReturned(item)
                                    ? item.returnDate
                                      ? format(
                                          new Date(item.returnDate),
                                          "dd MMM yyyy"
                                        )
                                      : "Returned"
                                    : contractsMap[item.requestId]
                                        ?.expectedReturnDate
                                    ? format(
                                        new Date(
                                          contractsMap[
                                            item.requestId
                                          ].expectedReturnDate
                                        ),
                                        "dd MMM yyyy"
                                      )
                                    : "Not returned"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.status === "Returned" || isItemReturned(item)
                                ? "bg-green-100 text-green-800"
                                : item.status === "Borrowing" &&
                                  contractsMap[item.requestId] &&
                                  isExpiringSoon(
                                    contractsMap[item.requestId]
                                      .expectedReturnDate
                                  )
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.status === "Returned" ||
                            isItemReturned(item) ? (
                              <>
                                <svg
                                  className="w-3.5 h-3.5 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                                Returned
                              </>
                            ) : item.status === "Borrowing" &&
                              contractsMap[item.requestId] &&
                              isExpiringSoon(
                                contractsMap[item.requestId].expectedReturnDate
                              ) ? (
                              <>
                                <svg
                                  className="w-3.5 h-3.5 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  ></path>
                                </svg>
                                Due Soon
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-3.5 h-3.5 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  ></path>
                                </svg>
                                Borrowing
                              </>
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <button
                              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                                expandedRow === item.borrowHistoryId
                                  ? "bg-amber-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(item.borrowHistoryId);
                              }}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                {expandedRow === item.borrowHistoryId ? (
                                  <path
                                    fillRule="evenodd"
                                    d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  />
                                ) : (
                                  <path
                                    fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                )}
                              </svg>
                              <span>
                                {expandedRow === item.borrowHistoryId
                                  ? "Hide"
                                  : "Details"}
                              </span>
                            </button>

                            {!reportedDamageItems[item.borrowHistoryId] && (
                              <button
                                className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReportDamage(item);
                                }}
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Report</span>
                              </button>
                            )}

                            {item.status === "Borrowing" &&
                              reportedDamageItems[item.borrowHistoryId] && (
                                <span className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-md bg-gray-100 text-gray-500">
                                  <svg
                                    className="w-3.5 h-3.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>Reported</span>
                                </span>
                              )}
                          </div>
                        </td>
                      </tr>

                      {expandedRow === item.borrowHistoryId && (
                        <tr className="bg-gradient-to-r from-amber-50 to-amber-100">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="animate-fadeIn">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                  <svg
                                    className="w-5 h-5 mr-2 text-amber-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                  </svg>
                                  Borrow Detail #{item.borrowHistoryId}
                                </h3>
                                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-md">
                                  Borrowed on{" "}
                                  {format(
                                    new Date(item.borrowDate),
                                    "dd MMM yyyy"
                                  )}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User Information Card - Enhanced */}
                                <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-amber-500 transform transition-all duration-300 hover:shadow-lg">
                                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                                    <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                                      <svg
                                        className="w-4 h-4 mr-2 text-amber-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                      </svg>
                                      USER INFORMATION
                                    </h3>
                                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                      {userInfoMap[item.userId]?.roleName ||
                                        "Student"}
                                    </span>
                                  </div>

                                  {userInfoMap[item.userId] ? (
                                    <div className="space-y-4">
                                      <div className="flex justify-center mb-2">
                                        <div className="relative w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl font-bold border-2 border-amber-200">
                                          {userInfoMap[item.userId].fullName
                                            ? userInfoMap[item.userId].fullName
                                                .charAt(0)
                                                .toUpperCase()
                                            : "U"}
                                        </div>
                                      </div>

                                      <div className="text-center mb-3">
                                        <h4 className="text-md font-semibold text-gray-800">
                                          {userInfoMap[item.userId].fullName ||
                                            "N/A"}
                                        </h4>
                                        <p className="text-sm text-amber-600">
                                          {userInfoMap[item.userId]
                                            .studentCode || "No ID Available"}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                                          <svg
                                            className="w-4 h-4 text-gray-500 mr-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            ></path>
                                          </svg>
                                          <div className="ml-1">
                                            <p className="text-xs text-gray-500">
                                              Email
                                            </p>
                                            <p className="text-sm font-medium break-all">
                                              {userInfoMap[item.userId].email ||
                                                "N/A"}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                                          <svg
                                            className="w-4 h-4 text-gray-500 mr-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            ></path>
                                          </svg>
                                          <div className="ml-1">
                                            <p className="text-xs text-gray-500">
                                              Phone
                                            </p>
                                            <p className="text-sm font-medium">
                                              {maskPhoneNumber(
                                                userInfoMap[item.userId]
                                                  ?.phoneNumber
                                              ) || "N/A"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md">
                                      <div className="text-center">
                                        <svg
                                          className="w-8 h-8 text-gray-300 mx-auto mb-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                          ></path>
                                        </svg>
                                        <p className="text-sm text-gray-500">
                                          User details not available
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Device Details Card - Enhanced */}
                                <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 transform transition-all duration-300 hover:shadow-lg">
                                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                                    <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                                      <svg
                                        className="w-4 h-4 mr-2 text-blue-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <rect
                                          x="2"
                                          y="3"
                                          width="20"
                                          height="14"
                                          rx="2"
                                          ry="2"
                                        ></rect>
                                        <line
                                          x1="2"
                                          y1="20"
                                          x2="22"
                                          y2="20"
                                        ></line>
                                      </svg>
                                      DEVICE DETAILS
                                    </h3>
                                    {itemsMap[item.itemId] && (
                                      <span
                                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                                          itemsMap[item.itemId].status ===
                                          "Available"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                      >
                                        {itemsMap[item.itemId].status ||
                                          "Unknown"}
                                      </span>
                                    )}
                                  </div>

                                  {itemsMap[item.itemId] ? (
                                    <div className="space-y-4">
                                      <div className="flex justify-center mb-3">
                                        {itemsMap[item.itemId]?.itemImage ? (
                                          <img
                                            src={
                                              itemsMap[item.itemId].itemImage
                                            }
                                            alt={itemsMap[item.itemId].itemName}
                                            className="h-24 w-auto object-contain rounded-md shadow-sm"
                                          />
                                        ) : (
                                          <div className="w-24 h-24 rounded-md bg-blue-50 flex items-center justify-center text-blue-500">
                                            <svg
                                              className="w-12 h-12"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                              ></path>
                                            </svg>
                                          </div>
                                        )}
                                      </div>

                                      <h4 className="text-center text-md font-semibold text-gray-800 mb-3">
                                        {itemsMap[item.itemId].itemName ||
                                          "Unknown Device"}
                                      </h4>

                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                                          <p className="text-xs text-gray-500">
                                            CPU
                                          </p>
                                          <p className="text-sm font-medium">
                                            {itemsMap[item.itemId].cpu || "N/A"}
                                          </p>
                                        </div>

                                        <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                                          <p className="text-xs text-gray-500">
                                            RAM
                                          </p>
                                          <p className="text-sm font-medium">
                                            {itemsMap[item.itemId].ram || "N/A"}
                                          </p>
                                        </div>

                                        <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                                          <p className="text-xs text-gray-500">
                                            Storage
                                          </p>
                                          <p className="text-sm font-medium">
                                            {itemsMap[item.itemId].storage ||
                                              "N/A"}
                                          </p>
                                        </div>

                                        <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                                          <p className="text-xs text-gray-500">
                                            Screen Size
                                          </p>
                                          <p className="text-sm font-medium">
                                            {itemsMap[item.itemId].screenSize ||
                                              "N/A"}
                                          </p>
                                        </div>

                                        <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                                          <p className="text-xs text-gray-500">
                                            Serial Number
                                          </p>
                                          <p className="text-sm font-medium">
                                            {maskSensitiveInfo(
                                              itemsMap[item.itemId].serialNumber
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md">
                                      <div className="text-center">
                                        <svg
                                          className="w-8 h-8 text-gray-300 mx-auto mb-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                          ></path>
                                        </svg>
                                        <p className="text-sm text-gray-500">
                                          Device details not available
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Contract Details Card - Enhanced */}
                                {contractsMap[item.requestId] && (
                                  <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500 transform transition-all duration-300 hover:shadow-lg md:col-span-2">
                                    <div className="flex items-center justify-between mb-4 pb-2 border-b">
                                      <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                                        <svg
                                          className="w-4 h-4 mr-2 text-green-600"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path>
                                          <path d="M14 3v5h5M18 21v-6M15 18h6"></path>
                                        </svg>
                                        CONTRACT INFORMATION
                                      </h3>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                                            item.status === "Returned" ||
                                            isItemReturned(item)
                                              ? "bg-green-100 text-green-700"
                                              : item.status === "Borrowing" &&
                                                contractsMap[item.requestId] &&
                                                isExpiringSoon(
                                                  contractsMap[item.requestId]
                                                    .expectedReturnDate
                                                )
                                              ? "bg-red-100 text-red-700"
                                              : "bg-blue-100 text-blue-700"
                                          }`}
                                        >
                                          {item.status === "Returned" ||
                                          isItemReturned(item) ? (
                                            <>
                                              <svg
                                                className="w-3 h-3 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M5 13l4 4L19 7"
                                                ></path>
                                              </svg>
                                              Returned
                                            </>
                                          ) : item.status === "Borrowing" &&
                                            contractsMap[item.requestId] &&
                                            isExpiringSoon(
                                              contractsMap[item.requestId]
                                                .expectedReturnDate
                                            ) ? (
                                            <>
                                              <svg
                                                className="w-3 h-3 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                              </svg>
                                              Due Soon
                                            </>
                                          ) : (
                                            <>
                                              <svg
                                                className="w-3 h-3 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                ></path>
                                              </svg>
                                              Borrowing
                                            </>
                                          )}
                                        </span>

                                        {reportedDamageItems[
                                          item.borrowHistoryId
                                        ] && (
                                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center">
                                            <svg
                                              className="w-3 h-3 mr-1"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                              ></path>
                                            </svg>
                                            Damage Reported
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                          <div className="flex flex-col p-3 bg-gray-50 rounded-md">
                                            <p className="text-xs text-gray-500">
                                              Item Value
                                            </p>
                                            <p className="text-sm font-medium text-green-600">
                                              {maskValue(
                                                contractsMap[item.requestId]
                                                  ?.itemValue
                                                  ? formatCurrency(
                                                      contractsMap[
                                                        item.requestId
                                                      ].itemValue
                                                    )
                                                  : "N/A"
                                              )}
                                            </p>
                                          </div>

                                          <div className="flex flex-col p-3 bg-gray-50 rounded-md">
                                            <p className="text-xs text-gray-500">
                                              Expected Return
                                            </p>
                                            <p
                                              className={`text-sm font-medium ${
                                                item.status === "Borrowing" &&
                                                contractsMap[item.requestId] &&
                                                isExpiringSoon(
                                                  contractsMap[item.requestId]
                                                    .expectedReturnDate
                                                )
                                                  ? "text-red-600"
                                                  : "text-gray-800"
                                              }`}
                                            >
                                              {contractsMap[item.requestId]
                                                .expectedReturnDate
                                                ? format(
                                                    new Date(
                                                      contractsMap[
                                                        item.requestId
                                                      ].expectedReturnDate
                                                    ),
                                                    "dd MMM yyyy"
                                                  )
                                                : "N/A"}
                                            </p>
                                          </div>

                                          <div className="flex flex-col p-3 bg-gray-50 rounded-md">
                                            <p className="text-xs text-gray-500">
                                              Condition
                                            </p>
                                            <p className="text-sm font-medium">
                                              {contractsMap[item.requestId]
                                                .conditionBorrow || "N/A"}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex flex-col p-3 bg-gray-50 rounded-md">
                                          <p className="text-xs text-gray-500 mb-1">
                                            Terms
                                          </p>
                                          <p className="text-sm font-medium break-words">
                                            {contractsMap[item.requestId]
                                              .terms || "N/A"}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Contract Images Section - Enhanced */}
                                      {contractsMap[item.requestId] &&
                                        contractsMap[item.requestId]
                                          .contractImages &&
                                        contractsMap[item.requestId]
                                          .contractImages.length > 0 && (
                                          <div className="space-y-2">
                                            <h4 className="text-xs font-medium text-gray-700 mb-2">
                                              Contract Images
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                              {contractsMap[
                                                item.requestId
                                              ].contractImages.map(
                                                (image, index) => (
                                                  <div
                                                    key={index}
                                                    className="group relative block rounded-md overflow-hidden h-32 bg-gray-100"
                                                  >
                                                    {showSensitiveInfo ? (
                                                      <a
                                                        href={image}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block h-full"
                                                      >
                                                        <img
                                                          src={image}
                                                          alt={`Contract ${
                                                            contractsMap[
                                                              item.requestId
                                                            ].contractId
                                                          } image ${index + 1}`}
                                                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                                                          <div className="p-2 text-white text-xs font-medium">
                                                            View Page{" "}
                                                            {index + 1}
                                                          </div>
                                                        </div>
                                                      </a>
                                                    ) : (
                                                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <div className="text-center p-4">
                                                          <svg
                                                            className="w-12 h-12 mx-auto text-gray-400 mb-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                          >
                                                            <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                            />
                                                          </svg>
                                                          <p className="text-sm text-gray-500">
                                                            Image Hidden
                                                          </p>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                )}

                                {/* Deposit Transaction Amount */}
                                {contractsMap[item.requestId] && (
                                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-500 mt-4 md:col-span-2">
                                    <div className="flex items-center gap-3">
                                      <svg
                                        className="w-5 h-5 text-amber-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      <span className="font-semibold text-amber-700">
                                        Deposit Transaction Amount:
                                      </span>
                                      <span className="ml-2 text-base font-bold text-amber-600">
                                        {showSensitiveInfo
                                          ? depositTransactionsMap[
                                              contractsMap[item.requestId]
                                                ?.contractId
                                            ]?.amount
                                            ? formatCurrency(
                                                depositTransactionsMap[
                                                  contractsMap[item.requestId]
                                                    ?.contractId
                                                ].amount
                                              )
                                            : "N/A"
                                          : "••••••••"}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Actions Card - New */}
                                <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500 transform transition-all duration-300 hover:shadow-lg">
                                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                                    <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                                      <svg
                                        className="w-4 h-4 mr-2 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        ></path>
                                      </svg>
                                      ACTIONS
                                    </h3>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex justify-center gap-3">
                                      {!reportedDamageItems[
                                        item.borrowHistoryId
                                      ] && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleReportDamage(item);
                                          }}
                                          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
                                        >
                                          <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            ></path>
                                          </svg>
                                          Report Damage
                                        </button>
                                      )}

                                      <button
                                        onClick={() =>
                                          navigate("/staff/report-damages")
                                        }
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-md transition-colors"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                          ></path>
                                        </svg>
                                        Manage Reports
                                      </button>
                                    </div>

                                    {reportedDamageItems[
                                      item.borrowHistoryId
                                    ] && (
                                      <div className="flex items-center p-3 bg-gray-50 rounded-md">
                                        <svg
                                          className="w-5 h-5 text-green-500 mr-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          ></path>
                                        </svg>
                                        <p className="text-sm text-gray-700">
                                          Damage report has been submitted for
                                          this item.
                                        </p>
                                      </div>
                                    )}

                                    {item.status === "Borrowing" &&
                                      contractsMap[item.requestId] &&
                                      isExpiringSoon(
                                        contractsMap[item.requestId]
                                          .expectedReturnDate
                                      ) && (
                                        <div className="flex items-center p-3 bg-red-50 rounded-md">
                                          <svg
                                            className="w-5 h-5 text-red-500 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                          </svg>
                                          <p className="text-sm text-red-700">
                                            This item&apos;s return is due soon.
                                            Please notify the user.
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center p-8">
                        <svg
                          className="w-16 h-16 text-gray-300 mb-4 animate-pulse"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg font-medium text-gray-600">
                          No history records found
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "No Borrowing history available"}
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setFilterStatus("all");
                          }}
                          className="mt-4 px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors duration-300"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Enhanced Pagination */}
        {!loading && filteredHistory.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-amber-50">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Showing{" "}
              <span className="font-medium text-amber-700">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-amber-700">
                {Math.min(indexOfLastItem, filteredHistory.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-amber-700">
                {filteredHistory.length}
              </span>{" "}
              entries
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-md disabled:bg-gray-50 disabled:text-gray-400 hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm disabled:shadow-none flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
                Previous
              </button>

              {totalPages <= 7 ? (
                // Show all pages if 7 or fewer
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md border border-amber-400"
                        : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 shadow-sm"
                    } transition-all duration-300 transform ${
                      currentPage === i + 1 ? "scale-110" : "hover:scale-105"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                // Show limited pages with ellipsis
                <>
                  {[1, 2].map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md border border-amber-400"
                          : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 shadow-sm"
                      } transition-all duration-300 transform ${
                        currentPage === pageNum
                          ? "scale-110"
                          : "hover:scale-105"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {currentPage > 3 && (
                    <span className="px-2 py-1 text-gray-500 flex items-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        ></path>
                      </svg>
                    </span>
                  )}

                  {currentPage > 2 && currentPage < totalPages - 1 && (
                    <button className="px-3 py-1 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md border border-amber-400 transform scale-110">
                      {currentPage}
                    </button>
                  )}

                  {currentPage < totalPages - 2 && (
                    <span className="px-2 py-1 text-gray-500 flex items-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        ></path>
                      </svg>
                    </span>
                  )}

                  {[totalPages - 1, totalPages].map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md border border-amber-400"
                          : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 shadow-sm"
                      } transition-all duration-300 transform ${
                        currentPage === pageNum
                          ? "scale-110"
                          : "hover:scale-105"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </>
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-md disabled:bg-gray-50 disabled:text-gray-400 hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm disabled:shadow-none flex items-center gap-1"
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl mx-4 relative transform transition-all duration-300 scale-100 opacity-100">
            {/* Modal Header with gradient */}
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Report Damage for Device
              </h3>
              <button
                onClick={closeReportModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:rotate-90 transform"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Modal Body with improved styling */}
            <div className="p-6">
              <form onSubmit={handleSubmitReport}>
                {selectedItem && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg shadow-sm border border-amber-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center mr-2">
                        <svg
                          className="w-4 h-4 text-amber-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-amber-800">
                        Device Information
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500">Device</p>
                        <p className="text-sm font-medium text-gray-800">
                          {itemsMap[selectedItem.itemId]?.itemName ||
                            "Unknown Device"}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500">User</p>
                        <p className="text-sm font-medium text-gray-800">
                          {userInfoMap[selectedItem.userId]?.fullName ||
                            "Unknown User"}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500">Borrow Date</p>
                        <p className="text-sm font-medium text-gray-800">
                          {format(
                            new Date(selectedItem.borrowDate),
                            "dd/MM/yyyy"
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500">ID</p>
                        <p className="text-sm font-medium text-gray-800">
                          #{selectedItem.borrowHistoryId}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Input fields with improved styling */}
                <div className="mb-4 group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-amber-600 transition-colors">
                    Damage Photo (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a clear image of the damage
                  </p>
                </div>

                <div className="mb-4 group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-amber-600 transition-colors">
                    Condition Before Borrowing
                  </label>
                  <input
                    type="text"
                    name="ConditionBeforeBorrow"
                    value={reportData.ConditionBeforeBorrow}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="E.g. Good condition, no scratches"
                    required
                  />
                </div>

                <div className="mb-4 group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-amber-600 transition-colors">
                    Current Condition <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ConditionAfterReturn"
                    value={reportData.ConditionAfterReturn}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="E.g. Screen damaged, keyboard not working"
                    required
                  />
                </div>

                <div className="mb-4 group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-amber-600 transition-colors">
                    Damage Fee (₫)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₫</span>
                    </div>
                    <input
                      type="text"
                      name="DamageFee"
                      value={reportData.DamageFee}
                      onChange={handleInputChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors bg-gray-50 focus:bg-white"
                      placeholder="Enter amount in VND"
                    />
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      Enter the amount in Vietnamese Dong (VND)
                    </p>
                  </div>
                </div>

                <div className="mb-4 group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-amber-600 transition-colors">
                    Additional Notes
                  </label>
                  <textarea
                    name="Note"
                    value={reportData.Note}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Any additional information about the damage"
                  ></textarea>
                </div>

                {/* Action buttons with improved styling */}
                <div className="flex justify-end mt-6 gap-3">
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-md hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md transition-all duration-200 ${
                      isSubmitting
                        ? "opacity-75 cursor-not-allowed"
                        : "transform hover:translate-y-[-2px]"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Submit Report
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowHistory;
