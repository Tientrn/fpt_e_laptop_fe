import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FaSearch, FaEye, FaHistory, FaMoneyBillWave } from "react-icons/fa";
import reportdamagesApi from "../../api/reportdamagesApi";
import donateitemsApi from "../../api/donateitemsApi";
import userinfoApi from "../../api/userinfoApi";
import borrowhistoryApi from "../../api/borrowhistoryApi";
import userApi from "../../api/userApi";
import compensationTransactionApi from "../../api/compensationTransactionApi";

const ReportDamage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [itemsMap, setItemsMap] = useState({});
  const [borrowHistoryMap, setBorrowHistoryMap] = useState({});
  const [compensationMap, setCompensationMap] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [showCompensationModal, setShowCompensationModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [compensationData, setCompensationData] = useState({
    reportId: "",
    amount: 0,
    paymentMethod: "Cash",
    notes: "",
    usedDepositAmount: 0,
    extraPaymentRequired: 0
  });

  useEffect(() => {
    fetchReports();
    fetchCompensationTransactions();
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      fetchBorrowHistories();
    }
  }, [reports]);

  useEffect(() => {
    if (Object.keys(borrowHistoryMap).length > 0) {
      fetchUserInfo();
      fetchItemsInfo();
      fetchMissingUserInfo();
    }
  }, [borrowHistoryMap]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportdamagesApi.getAllReportDamages();
      
      if (response.isSuccess) {
        setReports(response.data || []);
      } else {
        toast.error("Failed to load damage reports");
      }
    } catch (error) {
      console.error("Error fetching damage reports:", error);
      toast.error("Failed to load damage reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompensationTransactions = async () => {
    try {
      const response = await compensationTransactionApi.getAllCompensationTransactions();
      
      if (response.isSuccess) {
        // Create a map of compensation records by reportDamageId
        const compensationMapByReport = {};
        
        if (response.data && Array.isArray(response.data)) {
          response.data.forEach(transaction => {
            if (transaction.reportDamageId) {
              compensationMapByReport[transaction.reportDamageId] = transaction;
            }
          });
        }
        
        setCompensationMap(compensationMapByReport);
        console.log("Compensation transactions loaded:", compensationMapByReport);
      } else {
        console.error("Failed to load compensation transactions:", response.message);
      }
    } catch (error) {
      console.error("Error fetching compensation transactions:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      // Get unique user IDs from borrowHistories
      const userIds = [...new Set(
        Object.values(borrowHistoryMap)
          .map(history => history.userId)
          .filter(id => id)
      )];

      if (userIds.length > 0) {
        const response = await userinfoApi.getUserInfo();
        
        if (response.isSuccess) {
          let userMap = {};
          
          if (Array.isArray(response.data)) {
            userMap = response.data.reduce(
              (map, user) => ({
                ...map,
                [user.userId]: user,
              }),
              {}
            );
          } else if (response.data && response.data.userId) {
            userMap = {
              [response.data.userId]: response.data,
            };
          }
          
          setUserInfoMap(userMap);
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Fetch missing user information for each history item's user
  const fetchMissingUserInfo = async () => {
    try {
      const userIds = [...new Set(
        Object.values(borrowHistoryMap)
          .map(history => history.userId)
          .filter(id => id)
      )];

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

  const fetchItemsInfo = async () => {
    try {
      // Get unique item IDs from reports
      const itemIds = [...new Set(reports.map(report => report.itemId))];
      
      if (itemIds.length > 0) {
        // Fetch details for each item
        const itemPromises = itemIds.map(id => donateitemsApi.getDonateItemById(id));
        const itemResponses = await Promise.all(itemPromises);
        
        // Create a map of item details
        const items = {};
        itemResponses.forEach(response => {
          if (response.isSuccess && response.data) {
            items[response.data.itemId] = response.data;
          }
        });
        
        setItemsMap(items);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const fetchBorrowHistories = async () => {
    try {
      // Get unique borrow history IDs
      const borrowHistoryIds = [...new Set(reports.map(report => report.borrowHistoryId))];
      
      if (borrowHistoryIds.length > 0) {
        const response = await borrowhistoryApi.getAllBorrowHistories();
        
        if (response.isSuccess) {
          // Create a map of borrow histories
          const histories = {};
          response.data.forEach(history => {
            histories[history.borrowHistoryId] = history;
          });
          
          setBorrowHistoryMap(histories);
        }
      }
    } catch (error) {
      console.error("Error fetching borrow histories:", error);
    }
  };

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

  const openCompensationModal = (report) => {
    setSelectedReport(report);
    setCompensationData({
      reportId: report.reportId,
      amount: report.damageFee || 0,
      paymentMethod: "Cash",
      notes: "",
      usedDepositAmount: 0,
      extraPaymentRequired: 0
    });
    setShowCompensationModal(true);
  };

  const closeCompensationModal = () => {
    setShowCompensationModal(false);
    setSelectedReport(null);
    setCompensationData({
      reportId: "",
      amount: 0,
      paymentMethod: "Cash",
      notes: "",
      usedDepositAmount: 0,
      extraPaymentRequired: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number' && name === 'amount') {
      setCompensationData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setCompensationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitCompensation = async (e) => {
    e.preventDefault();
    
    try {
      const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
      
      // Create compensation transaction data in the format expected by API
      const compensationTransactionData = {
        contractId: parseInt(borrowHistory.requestId) || 0, // Using requestId as contractId if available, ensure it's a number
        userId: parseInt(borrowHistory.userId) || 0, // Ensure it's a number
        reportDamageId: parseInt(selectedReport.reportId) || 0, // Ensure it's a number
        depositTransactionId: 0, // This would need to be fetched from another source if required
        compensationAmount: parseFloat(compensationData.amount) || 0, // Ensure it's a number
        usedDepositAmount: parseFloat(compensationData.usedDepositAmount) || 0, // Ensure it's a number
        extraPaymentRequired: parseFloat(compensationData.extraPaymentRequired) || 0, // Ensure it's a number
        status: "done"
      };
      
      console.log("Sending transaction data:", compensationTransactionData);
      
      // Call the API to create a compensation transaction
      const transactionResponse = await compensationTransactionApi.createCompensationTransaction(compensationTransactionData);
      
      if (transactionResponse.isSuccess) {
        // If compensation transaction is successful, just show success and refresh data
        toast.success("Compensation transaction recorded successfully");
        closeCompensationModal();
        
        // Update local compensation map
        const newTransaction = transactionResponse.data || compensationTransactionData;
        setCompensationMap(prev => ({
          ...prev,
          [selectedReport.reportId]: newTransaction
        }));
        
        // Refresh both reports and compensation transactions data
        fetchReports();
        fetchCompensationTransactions();
      } else {
        console.error("Transaction response error:", transactionResponse);
        toast.error(`Failed to create compensation transaction: ${transactionResponse.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error recording compensation:", error);
      toast.error("Failed to record compensation transaction");
    }
  };

  // Helper function to check if a report has compensation transaction
  const hasCompensation = (reportId) => {
    return compensationMap[reportId] !== undefined;
  };

  // Helper function to get report status - uses compensation status if available
  const getReportStatus = (report) => {
    const compensation = compensationMap[report.reportId];
    
    if (compensation) {
      return compensation.status === "done" ? "done" : "pending"; 
    }
    
    return report.status || "pending";
  };

  // Filter reports based on search term and status filter
  const filteredReports = reports.filter(report => {
    const borrowHistory = borrowHistoryMap[report.borrowHistoryId] || {};
    const userInfo = userInfoMap[borrowHistory.userId] || {};
    const itemInfo = itemsMap[report.itemId] || {};
    const reportStatus = getReportStatus(report);
    
    // Check if any of these fields match the search term
    const matchesSearch = searchTerm
      ? (userInfo.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (userInfo.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (userInfo.studentCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (itemInfo.itemName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(report.reportId).includes(searchTerm) ||
        String(report.borrowHistoryId).includes(searchTerm)
      : true;
    
    // Filter by status
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "pending" && reportStatus !== "done") ||
      (filterStatus === "done" && reportStatus === "done");
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-center font-bold text-gray-800">
          Damage Reports
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Manage device damage reports and compensation transactions
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
              All Reports
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "pending"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange("done")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "done"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Done
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name, device, ID..."
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

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Damage Reports
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredReports.length} reports)
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
                    Report ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Damage Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Report Date
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
                  currentItems.map((report) => {
                    const borrowHistory = borrowHistoryMap[report.borrowHistoryId] || {};
                    const userInfo = userInfoMap[borrowHistory.userId] || {};
                    const itemInfo = itemsMap[report.itemId] || {};
                    const reportStatus = getReportStatus(report);
                    const compensation = compensationMap[report.reportId];
                    
                    return (
                      <>
                        <tr
                          key={report.reportId}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleRowExpansion(report.reportId)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{report.reportId}
                            <div className="text-xs text-gray-500">
                              BorrowHistory #{report.borrowHistoryId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {userInfo.fullName || "N/A"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {userInfo.email || "N/A"}
                              </span>
                              {userInfo.studentCode && (
                                <span className="text-xs text-gray-500">
                                  Student ID: {userInfo.studentCode}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {itemInfo.itemName || "N/A"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {itemInfo.cpu || "N/A"}, {itemInfo.ram || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-amber-600">
                              ₫{(report.damageFee || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(report.createdDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                reportStatus === "done" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {reportStatus === "done" ? "Compensated" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button 
                                className="p-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowExpansion(report.reportId);
                                }}
                                title="View Details"
                              >
                                <FaEye size={14} />
                              </button>
                              
                              {!hasCompensation(report.reportId) ? (
                                <button 
                                  className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCompensationModal(report);
                                  }}
                                  title="Record Compensation"
                                >
                                  <FaMoneyBillWave size={14} />
                                </button>
                              ) : (
                                <button 
                                  className="p-1.5 bg-gray-100 text-gray-400 rounded-full cursor-not-allowed"
                                  disabled
                                  title="Already Compensated"
                                >
                                  <FaMoneyBillWave size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {expandedRow === report.reportId && (
                          <tr className="bg-amber-50">
                            <td colSpan="7" className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Report Details */}
                                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                                    <FaHistory className="w-4 h-4 mr-2 text-amber-600" />
                                    DAMAGE REPORT DETAILS
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500 text-xs">Report ID</p>
                                      <p className="font-medium mt-1">#{report.reportId}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Borrow History ID</p>
                                      <p className="font-medium mt-1">#{report.borrowHistoryId}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Reported On</p>
                                      <p className="font-medium mt-1">{formatDate(report.createdDate)}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs">Status</p>
                                      <p className="font-medium mt-1">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-xs ${
                                            reportStatus === "done" 
                                              ? "bg-green-100 text-green-800" 
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {reportStatus === "done" ? "Compensated" : "Pending"}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-gray-500 text-xs">Condition Before Borrow</p>
                                      <p className="font-medium mt-1">{report.conditionBeforeBorrow || "N/A"}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-gray-500 text-xs">Condition After Return</p>
                                      <p className="font-medium mt-1">{report.conditionAfterReturn || "N/A"}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-gray-500 text-xs">Notes</p>
                                      <p className="font-medium mt-1">{report.note || "No additional notes"}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Financial Information */}
                                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                                    <FaMoneyBillWave className="w-4 h-4 mr-2 text-amber-600" />
                                    FINANCIAL INFORMATION
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500 text-xs">Damage Fee</p>
                                      <p className="font-medium mt-1 text-amber-600">₫{(report.damageFee || 0).toLocaleString()}</p>
                                    </div>
                                    
                                    {compensation && (
                                      <>
                                        <div>
                                          <p className="text-gray-500 text-xs">Compensation Amount</p>
                                          <p className="font-medium mt-1 text-green-600">₫{(compensation.compensationAmount || 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs">Used Deposit</p>
                                          <p className="font-medium mt-1 text-blue-600">₫{(compensation.usedDepositAmount || 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs">Extra Payment</p>
                                          <p className="font-medium mt-1 text-red-600">₫{(compensation.extraPaymentRequired || 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs">Compensation Date</p>
                                          <p className="font-medium mt-1">{formatDate(report.compensationDate) || "N/A"}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs">Compensation Notes</p>
                                          <p className="font-medium mt-1">{report.compensationNotes || "No additional notes"}</p>
                                        </div>
                                      </>
                                    )}
                                    
                                    {!hasCompensation(report.reportId) ? (
                                      <div className="col-span-2 mt-4">
                                        <button
                                          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openCompensationModal(report);
                                          }}
                                        >
                                          <FaMoneyBillWave />
                                          Record Compensation
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="col-span-2 mt-4">
                                        <div className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-md flex items-center justify-center gap-2">
                                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          Compensation Recorded
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Damage Image */}
                                {report.imageUrlReport && (
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
                                      DAMAGE IMAGES
                                    </h3>
                                    <img
                                      src={report.imageUrlReport}
                                      alt="Damage Evidence"
                                      className="w-full h-auto rounded-lg shadow-sm object-contain max-h-60"
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
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
                          No damage reports found
                        </p>
                        <p className="text-sm">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : filterStatus !== "all" 
                              ? `No ${filterStatus} damage reports available` 
                              : "No damage reports available"}
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
        {!loading && filteredReports.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredReports.length)}
              </span>{" "}
              of <span className="font-medium">{filteredReports.length}</span>{" "}
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

              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNumber;
                
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else {
                  if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNumber
                        ? "bg-amber-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

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

      {/* Compensation Modal */}
      {showCompensationModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-700 to-amber-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FaMoneyBillWave className="w-4 h-4 mr-2" />
                  Record Compensation
                </h3>
                <button 
                  onClick={closeCompensationModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitCompensation}>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Damage Report Information</h4>
                  <p className="text-sm">Report #{selectedReport.reportId} for {itemsMap[selectedReport.itemId]?.itemName || "N/A"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Original Damage Fee: ₫{(selectedReport.damageFee || 0).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compensation Amount
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₫</span>
                    <input
                      type="number"
                      name="amount"
                      value={compensationData.amount}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Used Deposit Amount
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₫</span>
                    <input
                      type="number"
                      name="usedDepositAmount"
                      value={compensationData.usedDepositAmount}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extra Payment Required
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₫</span>
                    <input
                      type="number"
                      name="extraPaymentRequired"
                      value={compensationData.extraPaymentRequired}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={compensationData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={compensationData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows="2"
                    placeholder="Add any additional notes about the compensation"
                  ></textarea>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCompensationModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors"
                >
                  Complete Compensation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDamage;
