import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import borrowhistoryApi from "../../api/borrowhistoryApi";
import userinfoApi from "../../api/userinfoApi";
import donateitemsApi from "../../api/donateitemsApi";
import borrowcontractApi from "../../api/borrowcontractApi";
import userApi from "../../api/userApi";
import reportdamagesApi from "../../api/reportdamagesApi";

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
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [selectedBorrowHistory, setSelectedBorrowHistory] = useState(null);
  const [damageReport, setDamageReport] = useState({
    ItemId: "",
    BorrowHistoryId: "",
    Note: "",
    ConditionBeforeBorrow: "",
    ConditionAfterReturn: "",
    DamageFee: 0,
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportedDamageItems, setReportedDamageItems] = useState({});

  useEffect(() => {
    fetchBorrowHistory();
    fetchReportDamages();
  }, []);

  useEffect(() => {
    if (borrowHistory.length > 0) {
      fetchUserInfo();
      fetchItemsInfo();
      fetchContracts();
      fetchMissingUserInfo();
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
      const response = await userinfoApi.getUserInfo();

      // Handle response that might be a single user object or an array
      if (response.isSuccess) {
        let userMap = {};

        if (Array.isArray(response.data)) {
          // Handle array response
          userMap = response.data.reduce(
            (map, user) => ({
              ...map,
              [user.userId]: user,
            }),
            {}
          );
        } else if (response.data && response.data.userId) {
          // Handle single user object response
          userMap = {
            [response.data.userId]: response.data,
          };
        } else {
          console.warn("User data format is unexpected:", response.data);
        }

        setUserInfoMap(userMap);
      } else {
        toast.error("Failed to load user information");
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

  // Fetch missing user information for each history item
  const fetchMissingUserInfo = async () => {
    try {
      const userIds = [...new Set(borrowHistory.map((item) => item.userId))];

      for (const userId of userIds) {
        if (!userInfoMap[userId]) {
          try {
            const response = await userApi.getUserById(userId);
            if (response.isSuccess && response.data) {
              setUserInfoMap((prev) => ({
                ...prev,
                [userId]: response.data,
              }));
            }

      
          } catch (error) {
            console.error(`Failed to fetch info for user ${userId}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching missing user info:", error);
    }
  };

  // Fetch existing damage reports
  const fetchReportDamages = async () => {
    try {
      const response = await reportdamagesApi.getAllReportDamages();
      if (response.isSuccess) {
        // Create a map of reported items by borrow history ID
        const reportedItems = {};
        response.data.forEach(report => {
          reportedItems[report.borrowHistoryId] = true;
        });
        setReportedDamageItems(reportedItems);
      }
    } catch (error) {
      console.error("Error fetching damage reports:", error);
    }
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

    // Use status from API without checking returnDate
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "returned" && item.status === "Returned") ||
      (filterStatus === "borrowed" && item.status === "Borrowed");

    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
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

  const handleReportDamage = (borrowHistoryItem) => {
    // Instead of opening modal, navigate to the report-damage page
    navigate('/staff/report-damage');
  };

  const handleCloseModal = () => {
    setShowDamageModal(false);
    setSelectedBorrowHistory(null);
    setDamageReport({
      ItemId: "",
      BorrowHistoryId: "",
      Note: "",
      ConditionBeforeBorrow: "",
      ConditionAfterReturn: "",
      DamageFee: 0,
      file: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      setDamageReport(prev => ({
        ...prev,
        file: e.target.files[0]
      }));
    } else if (name === 'DamageFee') {
      // Handle numeric input for damage fee
      setDamageReport(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setDamageReport(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitDamageReport = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData object for the multipart/form-data request
      const formData = new FormData();

      // Append all fields to the form data with exact fieldnames matching the API expectations
      // Use toString() to ensure proper data type conversion for API
      formData.append('ItemId', damageReport.ItemId.toString());
      formData.append('BorrowHistoryId', damageReport.BorrowHistoryId.toString());
      formData.append('Note', damageReport.Note);
      formData.append('ConditionBeforeBorrow', damageReport.ConditionBeforeBorrow);
      formData.append('ConditionAfterReturn', damageReport.ConditionAfterReturn);
      formData.append('DamageFee', damageReport.DamageFee.toString());
      
      // Only append file if it exists - explicitly provide filename as third parameter
      if (damageReport.file instanceof File) {
        formData.append('file', damageReport.file, damageReport.file.name);
      }
      
      // Debug FormData properly
      console.log("FormData content:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name}, size: ${value.size}` : value}`);
      }
      
      // Use the reportdamagesApi to create a new damage report
      const response = await reportdamagesApi.createReportDamage(formData);
      
      if (response.isSuccess) {
        toast.success("Damage report submitted successfully");
        handleCloseModal();
        
        // Mark this item as having a damage report
        setReportedDamageItems(prev => ({
          ...prev,
          [damageReport.BorrowHistoryId]: true
        }));
        
        // Refresh the borrow history data
        fetchBorrowHistory();
      } else {
        toast.error(`Failed to submit damage report: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting damage report:", error);
      toast.error("Failed to submit damage report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-center font-bold text-gray-800">
          Borrow History
        </h1>
        <p className="text-center text-gray-500 mt-2">
          View and manage device borrowing history
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "all"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All History
            </button>
            <button
              onClick={() => handleFilterChange("returned")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "returned"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Returned
            </button>
            <button
              onClick={() => handleFilterChange("borrowed")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "borrowed"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Borrowed
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name, email, item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2 border-0 bg-gray-100 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <FaSearch />
            </div>
          </div>
        </div>
      </div>

      {/* Add Report Damage link/button at the top */}
      <div className="mb-4 flex justify-end">
        <button 
          onClick={() => navigate('/staff/report-damage')}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Manage Damage Reports
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
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
                <tr className="bg-gradient-to-r from-gray-600 to-amber-600 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
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
                        className={`hover:bg-opacity-75 ${
                          item.status === "Borrowed" && 
                          contractsMap[item.requestId] && 
                          isExpiringSoon(contractsMap[item.requestId].expectedReturnDate)
                            ? "bg-yellow-50 hover:bg-yellow-100"
                            : ""
                        }`}
                        onClick={() => toggleRowExpansion(item.borrowHistoryId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{item.borrowHistoryId}
                          <div className="text-xs text-gray-500">
                            Request #{item.requestId}
                            {contractsMap[item.requestId] && (
                              <span className="ml-1 text-blue-600">
                                (Contract #
                                {contractsMap[item.requestId].contractId})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {userInfoMap[item.userId]?.fullName || "N/A"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {userInfoMap[item.userId]?.email || "N/A"}
                            </span>
                            {userInfoMap[item.userId]?.studentCode && (
                              <span className="text-xs text-gray-500">
                                Student ID:{" "}
                                {userInfoMap[item.userId].studentCode}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {itemsMap[item.itemId]?.itemName || "N/A"}
                            </span>
                            {itemsMap[item.itemId] && (
                              <span className="text-xs text-gray-500">
                                {itemsMap[item.itemId].cpu},{" "}
                                {itemsMap[item.itemId].ram}
                              </span>
                            )}
                            {contractsMap[item.requestId] && (
                              <span className="text-xs text-blue-600 font-medium">
                                Value:{" "}
                                {contractsMap[
                                  item.requestId
                                ].itemValue?.toLocaleString()}
                                {isExpiringSoon(
                                  contractsMap[item.requestId]
                                    .expectedReturnDate
                                ) && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                    Due Soon
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <span className="text-xs font-medium bg-blue-100 text-blue-800 rounded px-2 py-0.5 mr-2">
                                From
                              </span>
                              <span className="text-sm text-gray-900">
                                {format(
                                  new Date(item.borrowDate),
                                  "dd/MM/yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-xs font-medium bg-green-100 text-green-800 rounded px-2 py-0.5 mr-2">
                                To
                              </span>
                              <span className="text-sm text-gray-900">
                                {item.status === "Returned"
                                  ? item.returnDate 
                                    ? format(new Date(item.returnDate), "dd/MM/yyyy")
                                    : "Returned"
                                  : contractsMap[item.requestId]?.expectedReturnDate
                                    ? format(
                                        new Date(contractsMap[item.requestId].expectedReturnDate),
                                        "dd/MM/yyyy"
                                      ) + (item.status === "Borrowed" && 
                                          contractsMap[item.requestId] && 
                                          isExpiringSoon(contractsMap[item.requestId].expectedReturnDate)
                                          ? " (Due Soon)" 
                                          : "")
                                    : "Not returned"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === "Returned"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Borrowed" && contractsMap[item.requestId] && 
                                  isExpiringSoon(contractsMap[item.requestId].expectedReturnDate)
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.status === "Returned" 
                              ? "Returned" 
                              : item.status === "Borrowed" && contractsMap[item.requestId] && 
                                isExpiringSoon(contractsMap[item.requestId].expectedReturnDate)
                                ? "Due Soon"
                                : "Borrowed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <button
                              className={`flex items-center justify-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
                                expandedRow === item.borrowHistoryId
                                  ? "bg-amber-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(item.borrowHistoryId);
                              }}
                            >
                              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                {expandedRow === item.borrowHistoryId ? (
                                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                ) : (
                                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                )}
                              </svg>
                              <span>{expandedRow === item.borrowHistoryId ? "Hide" : "View"}</span>
                            </button>
                            
                            {/* Add Report Damage button for borrowed items that are due soon */}
                            {
                              item.status === "Borrowed" && 
                              contractsMap[item.requestId] && 
                              isExpiringSoon(contractsMap[item.requestId].expectedReturnDate) && 
                              !reportedDamageItems[item.borrowHistoryId] && (
                              <button
                                className="flex items-center justify-center gap-1 px-2.5 py-1 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReportDamage(item);
                                }}
                              >
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Report</span>
                              </button>
                            )}
                            
                            {/* Show Reported label when damage has been reported */}
                            {
                              item.status === "Borrowed" &&
                              reportedDamageItems[item.borrowHistoryId] && (
                              <span className="flex items-center justify-center gap-1 px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-500">
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Reported</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {expandedRow === item.borrowHistoryId && (
                        <tr className="bg-amber-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* User Information */}
                              <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
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
                                {userInfoMap[item.userId] ? (
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500 text-xs">Full Name</p>
                                      <p className="font-medium mt-1">
                                        {userInfoMap[item.userId].fullName ||
                                          "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Email</p>
                                      <p className="font-medium mt-1 break-words">
                                        {userInfoMap[item.userId].email ||
                                          "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">
                                        Student ID
                                      </p>
                                      <p className="font-medium mt-1">
                                        {userInfoMap[item.userId].studentCode ||
                                          "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Phone</p>
                                      <p className="font-medium mt-1">
                                        {userInfoMap[item.userId].phoneNumber ||
                                          "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Role</p>
                                      <p className="font-medium mt-1">
                                        {userInfoMap[item.userId].roleName ||
                                          "Student"}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    User details not available
                                  </p>
                                )}
                              </div>

                              {/* Device Details */}
                              <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
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
                                    <rect
                                      x="2"
                                      y="3"
                                      width="20"
                                      height="14"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                    <line x1="2" y1="20" x2="22" y2="20"></line>
                                  </svg>
                                  DEVICE DETAILS
                                </h3>
                                {itemsMap[item.itemId] ? (
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500 text-xs">
                                        Device Name
                                      </p>
                                      <p className="font-medium mt-1">
                                        {itemsMap[item.itemId].itemName ||
                                          "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">CPU</p>
                                      <p className="font-medium mt-1">
                                        {itemsMap[item.itemId].cpu || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">RAM</p>
                                      <p className="font-medium mt-1">
                                        {itemsMap[item.itemId].ram || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Storage</p>
                                      <p className="font-medium mt-1">
                                        {itemsMap[item.itemId].storage || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">
                                        Screen Size
                                      </p>
                                      <p className="font-medium mt-1">
                                        {itemsMap[item.itemId].screenSize ||
                                          "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Status</p>
                                      <p className="font-medium mt-1">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-xs ${
                                            itemsMap[item.itemId].status ===
                                            "Available"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {itemsMap[item.itemId].status ||
                                            "N/A"}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    Device details not available
                                  </p>
                                )}
                              </div>

                              {/* Contract Details */}
                              {contractsMap[item.requestId] && (
                                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
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
                                      <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path>
                                      <path d="M14 3v5h5M18 21v-6M15 18h6"></path>
                                    </svg>
                                    CONTRACT INFORMATION
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500 text-xs">
                                        Contract ID
                                      </p>
                                      <p className="font-medium mt-1">
                                        #
                                        {
                                          contractsMap[item.requestId]
                                            .contractId
                                        }
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">
                                        Item Value
                                      </p>
                                      <p className="font-medium mt-1">
                                        {contractsMap[
                                          item.requestId
                                        ].itemValue?.toLocaleString() || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">
                                        Expected Return
                                      </p>
                                      <p className="font-medium mt-1">
                                        {contractsMap[item.requestId]
                                          .expectedReturnDate
                                          ? format(
                                              new Date(
                                                contractsMap[
                                                  item.requestId
                                                ].expectedReturnDate
                                              ),
                                              "dd/MM/yyyy"
                                            )
                                          : "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Condition</p>
                                      <p className="font-medium mt-1">
                                        {contractsMap[item.requestId]
                                          .conditionBorrow || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Terms</p>
                                      <p className="font-medium mt-1 break-words">
                                        {contractsMap[item.requestId].terms ||
                                          "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">
                                        Due Status
                                      </p>
                                      <p className="font-medium mt-1 flex items-center">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-xs ${
                                            item.status === "Returned"
                                              ? "bg-green-100 text-green-800"
                                              : item.status === "Borrowed" && contractsMap[item.requestId] && 
                                                isExpiringSoon(contractsMap[item.requestId].expectedReturnDate)
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                          }`}
                                        >
                                          {item.status === "Returned"
                                            ? "Returned"
                                            : item.status === "Borrowed" && contractsMap[item.requestId] && 
                                              isExpiringSoon(contractsMap[item.requestId].expectedReturnDate)
                                              ? "Due Soon"
                                              : "Borrowed"}
                                        </span>
                                        
                                        {reportedDamageItems[item.borrowHistoryId] && (
                                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 flex items-center">
                                            <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Damage Reported
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Display device image if available */}
                              {itemsMap[item.itemId]?.itemImage && (
                                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
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
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                      <circle cx="8.5" cy="8.5" r="1.5"/>
                                      <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                    DEVICE IMAGE
                                  </h3>
                                  <img
                                    src={itemsMap[item.itemId].itemImage}
                                    alt={itemsMap[item.itemId].itemName}
                                    className="w-full h-auto rounded-lg shadow-sm object-contain max-h-60"
                                  />
                                </div>
                              )}
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
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mb-4"
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
                        <p className="text-lg font-medium">
                          No history records found
                        </p>
                        <p className="text-sm">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "No borrowing history available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredHistory.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredHistory.length)}
              </span>{" "}
              of <span className="font-medium">{filteredHistory.length}</span>{" "}
              entries
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-200 transition-colors"
              >
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
                        ? "bg-amber-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors`}
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
                          ? "bg-amber-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {currentPage > 3 && (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  )}

                  {currentPage > 2 && currentPage < totalPages - 1 && (
                    <button className="px-3 py-1 rounded-md bg-amber-600 text-white">
                      {currentPage}
                    </button>
                  )}

                  {currentPage < totalPages - 2 && (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  )}

                  {[totalPages - 1, totalPages].map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-amber-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
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
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-200 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowHistory;
