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
import deposittransactionApi from "../../api/deposittransactionApi";
import borrowcontractApi from "../../api/borrowcontractApi";
import { formatCurrency } from "../../utils/moneyValidationUtils";

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
  const [depositsMap, setDepositsMap] = useState({});
  const [contractsMap, setContractsMap] = useState({});

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
      fetchContracts();
    }
  }, [borrowHistoryMap]);
  
  useEffect(() => {
    if (Object.keys(contractsMap).length > 0) {
      fetchDeposits();
    }
  }, [contractsMap]);

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

  const fetchContracts = async () => {
    try {
      // Get unique request IDs from borrow histories
      const requestIds = [...new Set(
        Object.values(borrowHistoryMap)
          .map(history => history.requestId)
          .filter(id => id)
      )];
      
      if (requestIds.length > 0) {
        // Get all contracts at once
        const response = await borrowcontractApi.getAllBorrowContracts();
        
        if (response.isSuccess && Array.isArray(response.data)) {
          // Filter contracts by requestIds and create a map
          const contracts = {};
          
          // Log all contracts for debugging
          console.log("All contracts:", response.data);
          
          // First, create a map of contracts by requestId
          response.data.forEach(contract => {
            if (requestIds.includes(contract.requestId)) {
              contracts[contract.requestId] = contract;
            }
          });
          
          console.log("Filtered contracts by requestId:", contracts);
          console.log("Number of contracts mapped:", Object.keys(contracts).length);
          console.log("Request IDs that we needed:", requestIds);
          
          setContractsMap(contracts);
        } else {
          console.error("Failed to fetch contracts:", response.message);
        }
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const fetchDeposits = async () => {
    try {
      // Get the actual contract IDs from the contracts map
      const contractIds = [...new Set(
        Object.values(contractsMap)
          .map(contract => contract.contractId)
          .filter(id => id)
      )];
      
      console.log("Contracts map:", contractsMap);
      console.log("Fetching deposits for contract IDs:", contractIds);
      
      if (contractIds.length > 0) {
        const response = await deposittransactionApi.getAllDepositTransactions();
        
        if (response.isSuccess && Array.isArray(response.data)) {
          console.log("All deposit transactions:", response.data);
          
          // Create a map of deposits by contract ID
          const deposits = {};
          
          // Group deposit transactions by contractId to find the valid deposit for each contract
          const depositsByContract = {};
          
          response.data.forEach(deposit => {
            if (deposit.contractId) {
              // Initialize array if it doesn't exist
              if (!depositsByContract[deposit.contractId]) {
                depositsByContract[deposit.contractId] = [];
              }
              
              // Add this deposit to the contract's array
              depositsByContract[deposit.contractId].push(deposit);
            }
          });
          
          console.log("Grouped deposits by contract:", depositsByContract);
          
          // For each contract, find the valid deposit amount
          Object.keys(depositsByContract).forEach(contractId => {
            // Sort deposits by date (newest first) to get the most recent valid deposit
            const contractDeposits = depositsByContract[contractId].sort((a, b) => 
              new Date(b.depositDate || 0) - new Date(a.depositDate || 0)
            );
            
            // Use the most recent deposit
            if (contractDeposits.length > 0) {
              deposits[contractId] = contractDeposits[0];
              console.log(`Deposit for contract ${contractId}:`, deposits[contractId]);
            }
          });
          
          setDepositsMap(deposits);
          console.log("Final deposits map:", deposits);
        }
      } else {
        console.warn("No valid contract IDs found for fetching deposits");
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
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
    
    // Get the borrowHistory information
    const borrowHistory = borrowHistoryMap[report.borrowHistoryId] || {};
    const requestId = borrowHistory.requestId;
    
    // Get the contract information using requestId
    const contract = contractsMap[requestId] || {};
    const contractId = contract.contractId || 0; // Use actual contractId from contract
    
    // Get deposit information using the contractId
    const deposit = depositsMap[contractId] || { amount: 0 };
    
    // Get the damage fee
    const damageFee = report.damageFee || 0;
    
    // Default used deposit is the available deposit amount
    const depositAmount = deposit.amount || 0;
    
    // Check if this is a zero damage fee case
    if (damageFee === 0) {
      // If damage fee is 0, we'll just record the transaction with deposit amount
      // No extra payment needed and we'll return the full deposit to customer
      setCompensationData({
        reportId: report.reportId,
        amount: 0,
        paymentMethod: "Cash",
        notes: "No damage fee. Full deposit will be returned to customer.",
        usedDepositAmount: 0,
        extraPaymentRequired: 0
      });
      
      console.log("Zero damage fee case - recording compensation with no charges");
    } 
    // Check if damage fee is less than deposit
    else if (damageFee < depositAmount) {
      // Damage fee is less than deposit, so we'll use part of the deposit
      // No extra payment needed and we'll return the remaining deposit to customer
      setCompensationData({
        reportId: report.reportId,
        amount: damageFee,
        paymentMethod: "Cash",
        notes: `Damage fee (${formatCurrency(damageFee)}) is less than deposit (${formatCurrency(depositAmount)}). Partial deposit will be returned.`,
        usedDepositAmount: damageFee,
        extraPaymentRequired: 0
      });
      
      console.log("Partial deposit usage case - damage fee less than deposit");
    }
    else {
      // Normal case with damage fee
      // Calculate extra payment required if damage fee exceeds deposit
      const extraPayment = Math.max(0, damageFee - depositAmount);
      
      setCompensationData({
        reportId: report.reportId,
        amount: damageFee,
        paymentMethod: "Cash",
        notes: extraPayment > 0 ? `Damage fee (${formatCurrency(damageFee)}) exceeds deposit (${formatCurrency(depositAmount)}). Additional payment required.` : "",
        usedDepositAmount: depositAmount,
        extraPaymentRequired: extraPayment
      });
    }
    
    // Log detailed information for debugging
    console.log("Opening compensation modal with:");
    console.log("- Report:", report);
    console.log("- Borrow History:", borrowHistory);
    console.log("- Request ID:", requestId);
    console.log("- Contract:", contract);
    console.log("- Contract ID:", contractId);
    console.log("- Deposit object:", deposit);
    console.log("- Deposit amount:", depositAmount);
    console.log("- Damage fee:", damageFee);
    console.log("- Compensation data:", compensationData);
    
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
    
    // Get the damage fee and deposit amount for reference
    const damageFee = selectedReport?.damageFee || 0;
    const borrowHistory = borrowHistoryMap[selectedReport?.borrowHistoryId] || {};
    const requestId = borrowHistory.requestId;
    
    // Get the contract information using requestId
    const contract = contractsMap[requestId] || {};
    const contractId = contract.contractId || 0;
    
    // Get deposit information using the contractId
    const deposit = depositsMap[contractId] || { amount: 0 };
    const depositAmount = deposit.amount || 0;
    
    if (type === 'number') {
      if (name === 'amount') {
        // Validate the total compensation amount
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          // Cap the amount at the damage fee
          const validAmount = Math.min(numValue, damageFee);
          
          // Used deposit is always the deposit amount (or lower if total amount is lower)
          const usedDeposit = Math.min(depositAmount, validAmount);
          
          // Extra payment is what remains after using deposit
          const extraPayment = Math.max(0, validAmount - usedDeposit);
          
          setCompensationData(prev => ({
            ...prev,
            amount: validAmount,
            usedDepositAmount: usedDeposit,
            extraPaymentRequired: extraPayment
          }));
        }
      } 
      else if (name === 'usedDepositAmount') {
        // When adjusting deposit amount
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          // Limit to available deposit and total compensation amount
          const validDepositAmount = Math.min(
            numValue, 
            depositAmount, 
            compensationData.amount
          );
          
          setCompensationData(prev => ({
            ...prev,
            usedDepositAmount: validDepositAmount,
            extraPaymentRequired: Math.max(0, prev.amount - validDepositAmount)
          }));
        }
      }
      else if (name === 'extraPaymentRequired') {
        // When adjusting extra payment
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          const totalAmount = compensationData.amount;
          
          // Calculate used deposit based on extra payment
          // Cannot exceed available deposit
          const calculatedDepositUsage = Math.min(
            depositAmount,
            Math.max(0, totalAmount - numValue)
          );
          
          setCompensationData(prev => ({
            ...prev,
            extraPaymentRequired: numValue,
            usedDepositAmount: calculatedDepositUsage
          }));
        }
      }
      else {
        setCompensationData(prev => ({
          ...prev,
          [name]: value
        }));
      }
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
      const requestId = borrowHistory.requestId || 0;
      
      // Get the contract information using requestId
      const contract = contractsMap[requestId] || {};
      const contractId = contract.contractId || 0;
      
      // Check if this is a zero damage fee case
      const isZeroDamageFee = selectedReport.damageFee === 0;
      
      // Get deposit information
      const deposit = depositsMap[contractId] || { amount: 0 };
      
      let compensationTransactionData;
      
      if (isZeroDamageFee) {
        // Zero damage fee case - record a transaction showing full deposit return
        compensationTransactionData = {
          contractId: contractId,
          userId: parseInt(borrowHistory.userId) || 0, 
          reportDamageId: parseInt(selectedReport.reportId) || 0,
          depositTransactionId: deposit.depositTransactionId || 0,
          compensationAmount: 0, // No compensation amount
          usedDepositAmount: 0, // No deposit used
          extraPaymentRequired: 0, // No extra payment
          status: "done"
        };
        
        console.log("Zero damage fee compensation data:", compensationTransactionData);
      } else {
        // Regular damage fee case - validate the compensation values
        const totalAmount = parseFloat(compensationData.amount) || 0;
        const usedDeposit = parseFloat(compensationData.usedDepositAmount) || 0;
        const extraPayment = parseFloat(compensationData.extraPaymentRequired) || 0;
        
        // Ensure the sum matches
        if (Math.abs((usedDeposit + extraPayment) - totalAmount) > 0.01) {
          toast.error("The deposit amount and extra payment must add up to the total compensation amount");
          return;
        }
        
        compensationTransactionData = {
          contractId: contractId,
          userId: parseInt(borrowHistory.userId) || 0, 
          reportDamageId: parseInt(selectedReport.reportId) || 0,
          depositTransactionId: deposit.depositTransactionId || 0,
          compensationAmount: totalAmount,
          usedDepositAmount: usedDeposit,
          extraPaymentRequired: extraPayment,
          status: "done"
        };
      }
      
      // Log the contract and transaction data for debugging
      console.log("Submitting compensation with contract:", contract);
      console.log("Contract ID:", contractId);
      console.log("Sending transaction data:", compensationTransactionData);
      
      // Call the API to create a compensation transaction
      const transactionResponse = await compensationTransactionApi.createCompensationTransaction(compensationTransactionData);
      
      if (transactionResponse.isSuccess) {
        toast.success(isZeroDamageFee 
          ? "Deposit return recorded successfully" 
          : "Compensation transaction recorded successfully"
        );
        
        // Get the item ID from the selected report
        const itemId = selectedReport.itemId;
        
        // Update the item status to "Available"
        try {
          // First, get the current item data
          const itemResponse = await donateitemsApi.getDonateItemById(itemId);
          
          if (itemResponse.isSuccess && itemResponse.data) {
            const itemData = itemResponse.data;
            
            // Prepare the updated item data with status set to "Available"
            const updatedItemData = new FormData();
            
            // Add all the existing item properties
            updatedItemData.append("itemId", itemData.itemId);

            // Update the status to "Available"
            updatedItemData.append("status", "Available");
            
            // If there's an image, we need to handle it properly
            if (itemData.itemImage && !itemData.itemImage.startsWith('http')) {
              // This is a file path, not a File object, so we'll keep the existing image
              updatedItemData.append("itemImage", itemData.itemImage);
            }
            
            // Update the item
            const updateResponse = await donateitemsApi.updateDonateItem(itemId, updatedItemData);
            
            if (updateResponse.isSuccess) {
              toast.success("Item status updated to Available");
              
              // Also update the local item data in state
              setItemsMap(prev => ({
                ...prev,
                [itemId]: {
                  ...prev[itemId],
                  status: "Available"
                }
              }));
            } else {
              toast.warning(isZeroDamageFee
                ? "Deposit return recorded but failed to update item status"
                : "Compensation recorded but failed to update item status"
              );
              console.error("Failed to update item status:", updateResponse.message);
            }
          } else {
            toast.warning(isZeroDamageFee
              ? "Deposit return recorded but couldn't retrieve item data for status update"
              : "Compensation recorded but couldn't retrieve item data for status update"
            );
          }
        } catch (itemError) {
          console.error("Error updating item status:", itemError);
          toast.warning(isZeroDamageFee
            ? "Deposit return recorded but failed to update item status"
            : "Compensation recorded but failed to update item status"
          );
        }
        
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
        toast.error(isZeroDamageFee
          ? `Failed to record deposit return: ${transactionResponse.message || 'Unknown error'}`
          : `Failed to create compensation transaction: ${transactionResponse.message || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error("Error recording compensation:", error);
      toast.error(selectedReport.damageFee === 0
        ? "Failed to record deposit return"
        : "Failed to record compensation transaction"
      );
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
                          className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          onClick={() => toggleRowExpansion(report.reportId)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 mr-3 text-xs font-bold">
                                {report.reportId}
                              </span>
                              <div>
                                <span className="block text-sm"># {report.reportId}</span>
                                <span className="text-xs text-gray-500">BH-{report.borrowHistoryId}</span>
                              </div>
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
                                  ID: {userInfo.studentCode}
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
                              {formatCurrency(report.damageFee || 0)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(report.createdDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1.5 inline-flex items-center text-xs leading-4 font-medium rounded-full ${
                                reportStatus === "done" 
                                  ? report.damageFee === 0 && hasCompensation(report.reportId)
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                reportStatus === "done"
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                              }`}></span>
                              {reportStatus === "done" 
                                ? report.damageFee === 0 && hasCompensation(report.reportId)
                                  ? "Deposit Returned" 
                                  : "Compensated"
                                : "Pending"
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button 
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
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
                                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCompensationModal(report);
                                  }}
                                  title={report.damageFee === 0 ? "Record Deposit Return" : "Record Compensation"}
                                >
                                  <FaMoneyBillWave size={14} />
                                </button>
                              ) : (
                                <button 
                                  className="p-2 bg-gray-100 text-gray-400 rounded-full cursor-not-allowed"
                                  disabled
                                  title={report.damageFee === 0 ? "Deposit Already Returned" : "Already Compensated"}
                                >
                                  <FaMoneyBillWave size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {expandedRow === report.reportId && (
                          <tr className="bg-gray-50">
                            <td colSpan="7" className="px-6 py-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Report Details */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mr-2">
                                      <FaHistory className="w-3 h-3" />
                                    </span>
                                    DAMAGE REPORT DETAILS
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-xs">Report ID</p>
                                      <p className="font-medium mt-1 text-gray-900">#{report.reportId}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-xs">Borrow History ID</p>
                                      <p className="font-medium mt-1 text-gray-900">#{report.borrowHistoryId}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-xs">Reported On</p>
                                      <p className="font-medium mt-1 text-gray-900">{formatDate(report.createdDate)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-xs">Status</p>
                                      <p className="font-medium mt-1">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-xs ${
                                            reportStatus === "done" 
                                              ? "bg-green-100 text-green-800" 
                                              : "bg-amber-100 text-amber-800"
                                          }`}
                                        >
                                          {reportStatus === "done" ? "Compensated" : "Pending"}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col-span-2 p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-xs">Condition Before Borrow</p>
                                      <p className="font-medium mt-1 text-gray-900">{report.conditionBeforeBorrow || "N/A"}</p>
                                    </div>
                                    <div className="col-span-2 p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-xs">Condition After Return</p>
                                      <p className="font-medium mt-1 text-gray-900">{report.conditionAfterReturn || "N/A"}</p>
                                    </div>
                                    <div className="col-span-2 p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-xs">Notes</p>
                                      <p className="font-medium mt-1 text-gray-900">{report.note || "No additional notes"}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Financial Information */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-700 mr-2">
                                      <FaMoneyBillWave className="w-3 h-3" />
                                    </span>
                                    FINANCIAL INFORMATION
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-xs">Damage Fee</p>
                                      <p className="font-medium mt-1 text-amber-600">{formatCurrency(report.damageFee || 0)}</p>
                                    </div>
                                    
                                    {compensation && (
                                      <>
                                        {report.damageFee === 0 ? (
                                          // Zero damage fee case
                                          <div className="col-span-2">
                                            <div className="p-4 bg-green-50 rounded-md border border-green-100 mt-2">
                                              <div className="flex items-center text-green-700 mb-3">
                                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-200 text-green-700 mr-2">
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                  </svg>
                                                </span>
                                                <span className="font-medium">Full Deposit Returned</span>
                                              </div>
                                              
                                              <div className="space-y-2 pl-8">
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-700">Original Deposit:</span>
                                                  <span className="font-medium text-green-600">
                                                    {formatCurrency((() => {
                                                      const borrowHistory = borrowHistoryMap[report.borrowHistoryId] || {};
                                                      const requestId = borrowHistory.requestId;
                                                      const contract = contractsMap[requestId] || {};
                                                      const contractId = contract.contractId || 0;
                                                      const deposit = depositsMap[contractId];
                                                      return deposit?.amount || 0;
                                                    })())}
                                                  </span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center border-t border-green-100 pt-2 mt-2">
                                                  <span className="text-gray-700 font-medium">Returned to Customer:</span>
                                                  <span className="font-semibold text-green-600">
                                                    {formatCurrency((() => {
                                                      const borrowHistory = borrowHistoryMap[report.borrowHistoryId] || {};
                                                      const requestId = borrowHistory.requestId;
                                                      const contract = contractsMap[requestId] || {};
                                                      const contractId = contract.contractId || 0;
                                                      const deposit = depositsMap[contractId];
                                                      return deposit?.amount || 0;
                                                    })())}
                                                  </span>
                                                </div>
                                              </div>
                                              
                                              <div className="mt-3 pt-2 border-t border-green-100 flex items-center text-xs text-gray-500">
                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                {formatDate(report.compensationDate) || "No date recorded"}
                                              </div>
                                            </div>
                                          </div>
                                        ) : compensation.compensationAmount < (() => {
                                          const borrowHistory = borrowHistoryMap[report.borrowHistoryId] || {};
                                          const requestId = borrowHistory.requestId;
                                          const contract = contractsMap[requestId] || {};
                                          const contractId = contract.contractId || 0;
                                          const deposit = depositsMap[contractId];
                                          return deposit?.amount || 0;
                                        })() ? (
                                          // Partial deposit return case - damage fee less than deposit
                                          <div className="col-span-2">
                                            <div className="p-4 bg-green-50 rounded-md border border-green-100 mt-2">
                                              <div className="flex items-center text-green-700 mb-3">
                                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-200 text-green-700 mr-2">
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                  </svg>
                                                </span>
                                                <span className="font-medium">Partial Deposit Returned</span>
                                              </div>
                                              
                                              <div className="space-y-2 pl-8">
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-700">Original Deposit:</span>
                                                  <span className="font-medium text-green-600">
                                                    {formatCurrency((() => {
                                                      const borrowHistory = borrowHistoryMap[report.borrowHistoryId] || {};
                                                      const requestId = borrowHistory.requestId;
                                                      const contract = contractsMap[requestId] || {};
                                                      const contractId = contract.contractId || 0;
                                                      const deposit = depositsMap[contractId];
                                                      return deposit?.amount || 0;
                                                    })())}
                                                  </span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-700">Damage Fee:</span>
                                                  <span className="font-medium text-amber-600">
                                                    {formatCurrency(compensation.compensationAmount || 0)}
                                                  </span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-700">Used from Deposit:</span>
                                                  <span className="font-medium text-amber-600">
                                                    {formatCurrency(compensation.usedDepositAmount || 0)}
                                                  </span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center border-t border-green-100 pt-2 mt-2">
                                                  <span className="text-gray-700 font-medium">Returned to Customer:</span>
                                                  <span className="font-semibold text-green-600">
                                                    {formatCurrency((() => {
                                                      const borrowHistory = borrowHistoryMap[report.borrowHistoryId] || {};
                                                      const requestId = borrowHistory.requestId;
                                                      const contract = contractsMap[requestId] || {};
                                                      const contractId = contract.contractId || 0;
                                                      const deposit = depositsMap[contractId];
                                                      return Math.max(0, (deposit?.amount || 0) - (compensation.usedDepositAmount || 0));
                                                    })())}
                                                  </span>
                                                </div>
                                              </div>
                                              
                                              <div className="mt-3 pt-2 border-t border-green-100 flex items-center text-xs text-gray-500">
                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                {formatDate(report.compensationDate) || "No date recorded"}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          // Regular damage fee case - exceeds deposit
                                          <div className="col-span-2">
                                            <div className="p-4 bg-amber-50 rounded-md border border-amber-100 mt-2">
                                              <div className="flex items-center text-amber-700 mb-3">
                                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-200 text-amber-700 mr-2">
                                                  <FaMoneyBillWave className="w-3 h-3" />
                                                </span>
                                                <span className="font-medium">Damage Compensation</span>
                                              </div>
                                              
                                              <div className="space-y-2 pl-8">
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-700">Total Damage Fee:</span>
                                                  <span className="font-medium text-amber-600">
                                                    {formatCurrency(compensation.compensationAmount || 0)}
                                                  </span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-700">Used Deposit:</span>
                                                  <span className="font-medium text-blue-600">
                                                    {formatCurrency(compensation.usedDepositAmount || 0)}
                                                  </span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-700">Extra Payment:</span>
                                                  <span className="font-medium text-red-600">
                                                    {formatCurrency(compensation.extraPaymentRequired || 0)}
                                                  </span>
                                                </div>
                                                
                                                {compensation.extraPaymentRequired > 0 && (
                                                  <div className="mt-2 bg-red-50 p-2 rounded border border-red-100">
                                                    <p className="text-xs text-red-700">Customer paid additional charges beyond deposit amount</p>
                                                  </div>
                                                )}
                                                
                                                {report.compensationNotes && (
                                                  <div className="mt-2 pt-2 border-t border-amber-100">
                                                    <p className="text-xs text-gray-500">Notes: {report.compensationNotes}</p>
                                                  </div>
                                                )}
                                              </div>
                                              
                                              <div className="mt-3 pt-2 border-t border-amber-100 flex items-center text-xs text-gray-500">
                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                {formatDate(report.compensationDate) || "No date recorded"}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    
                                    {!hasCompensation(report.reportId) ? (
                                      <div className="col-span-2 mt-4">
                                        <button
                                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md hover:from-green-700 hover:to-green-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openCompensationModal(report);
                                          }}
                                        >
                                          <FaMoneyBillWave />
                                          {report.damageFee === 0 
                                            ? "Record Deposit Return" 
                                            : "Record Compensation"
                                          }
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="col-span-2 mt-4">
                                        <div className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-md flex items-center justify-center gap-2">
                                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          {report.damageFee === 0 
                                            ? "Deposit Already Returned" 
                                            : "Compensation Recorded"
                                          }
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Damage Image */}
                                {report.imageUrlReport && (
                                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-red-700 mr-2">
                                        <svg 
                                          className="w-3 h-3" 
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
                                      </span>
                                      DAMAGE EVIDENCE
                                    </h3>
                                    <div className="relative overflow-hidden rounded-lg border border-gray-200">
                                      <img
                                        src={report.imageUrlReport}
                                        alt="Damage Evidence"
                                        className="w-full h-auto object-contain max-h-60"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                    </div>
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
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-16 h-16 text-gray-300 mb-4"
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
                        <h3 className="text-lg font-medium text-gray-700 mb-1">
                          No damage reports found
                        </h3>
                        <p className="text-sm text-gray-500">
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
          <div className="flex flex-col md:flex-row justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Showing{" "}
              <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium text-gray-900">
                {Math.min(indexOfLastItem, filteredReports.length)}
              </span>{" "}
              of <span className="font-medium text-gray-900">{filteredReports.length}</span>{" "}
              entries
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition-colors shadow-sm"
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
                    className={`px-3 py-1.5 rounded-md shadow-sm ${
                      currentPage === pageNumber
                        ? "bg-amber-600 text-white border border-amber-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition-colors shadow-sm"
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
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-800 to-amber-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FaMoneyBillWave className="w-5 h-5 mr-2" />
                  {selectedReport.damageFee === 0 
                    ? "Record Deposit Return" 
                    : "Record Compensation"}
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
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
                {/* Summary information card */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">Damage Report Details</h4>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">
                      #{selectedReport.reportId}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{itemsMap[selectedReport.itemId]?.itemName || "Unknown Device"}</p>
                      <p className="text-xs text-gray-500">Report #{selectedReport.reportId}</p>
                    </div>
                  </div>
                  
                  {/* Damage fee and deposit summary */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-white rounded border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Damage Fee:</p>
                      <p className="font-medium text-amber-600">
                        {formatCurrency(selectedReport.damageFee || 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Customer Deposit:</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(
                          (() => {
                            const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
                            const requestId = borrowHistory.requestId;
                            const contract = contractsMap[requestId] || {};
                            const contractId = contract.contractId || 0;
                            const deposit = depositsMap[contractId];
                            return deposit?.amount || 0;
                          })()
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedReport.damageFee === 0 ? (
                  // Zero damage fee case - simplified UI
                  <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                    <div className="flex items-center text-green-700 mb-3">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-200 text-green-700 mr-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </span>
                      <h4 className="font-medium">No Damage Fee</h4>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4 pl-8">
                      There is no damage fee for this report. The full deposit will be returned to the customer.
                    </p>
                    
                    <div className="p-4 bg-white rounded-lg border border-green-100 text-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Original Deposit:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency((() => {
                            const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
                            const requestId = borrowHistory.requestId;
                            const contract = contractsMap[requestId] || {};
                            const contractId = contract.contractId || 0;
                            const deposit = depositsMap[contractId];
                            return deposit?.amount || 0;
                          })())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Used for Compensation:</span>
                        <span className="font-medium text-amber-600">
                          {formatCurrency(0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-green-100">
                        <span className="font-medium text-gray-700">Amount to Return:</span>
                        <span className="font-bold text-green-700">
                          {formatCurrency((() => {
                            const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
                            const requestId = borrowHistory.requestId;
                            const contract = contractsMap[requestId] || {};
                            const contractId = contract.contractId || 0;
                            const deposit = depositsMap[contractId];
                            return deposit?.amount || 0;
                          })())}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular damage fee case with compensation UI
                  <>
                    {/* Amount field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Compensation Amount
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₫</span>
                        <input
                          type="number"
                          name="amount"
                          value={compensationData.amount}
                          onChange={handleInputChange}
                          className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                          placeholder="0"
                          min="0"
                          max={selectedReport.damageFee || 0}
                          required
                        />
                        <p className="mt-1.5 text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Maximum: {formatCurrency(selectedReport.damageFee || 0)} (Damage Fee)
                        </p>
                      </div>
                    </div>
                    
                    {/* Compensation breakdown */}
                    <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
                      <h4 className="font-medium text-amber-800 mb-4 pb-2 border-b border-amber-100 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        Compensation Breakdown
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Deposit Usage */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              From Customer Deposit
                            </label>
                            <span className="text-xs text-green-600 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Available: {formatCurrency((() => {
                                const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
                                const requestId = borrowHistory.requestId;
                                const contract = contractsMap[requestId] || {};
                                const contractId = contract.contractId || 0;
                                const deposit = depositsMap[contractId];
                                return deposit?.amount || 0;
                              })())}
                            </span>
                          </div>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₫</span>
                            <input
                              type="number"
                              name="usedDepositAmount"
                              value={compensationData.usedDepositAmount}
                              onChange={handleInputChange}
                              className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                              placeholder="0"
                              min="0"
                              max={(() => {
                                const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
                                const requestId = borrowHistory.requestId;
                                const contract = contractsMap[requestId] || {};
                                const contractId = contract.contractId || 0;
                                const deposit = depositsMap[contractId];
                                return Math.min(
                                  deposit?.amount || 0,
                                  compensationData.amount
                                );
                              })()}
                            />
                          </div>
                          {compensationData.amount < (() => {
                            const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
                            const requestId = borrowHistory.requestId;
                            const contract = contractsMap[requestId] || {};
                            const contractId = contract.contractId || 0;
                            const deposit = depositsMap[contractId];
                            return deposit?.amount || 0;
                          })() && (
                            <div className="mt-2 flex items-start">
                              <svg className="w-4 h-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <p className="text-xs text-green-600">
                                Damage fee is less than deposit - partial deposit will be returned
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Extra Payment */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Additional Payment Required
                            </label>
                            <span className="text-xs flex items-center font-medium px-2 py-0.5 rounded-full"
                              className={`text-xs flex items-center font-medium px-2 py-0.5 rounded-full ${
                                compensationData.extraPaymentRequired > 0 
                                  ? "bg-red-100 text-red-700" 
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full mr-1 ${
                                compensationData.extraPaymentRequired > 0 
                                  ? "bg-red-500" 
                                  : "bg-green-500"
                              }`}></span>
                              {compensationData.extraPaymentRequired > 0 
                                ? "Payment needed" 
                                : "No additional payment needed"}
                            </span>
                          </div>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₫</span>
                            <input
                              type="number"
                              name="extraPaymentRequired"
                              value={compensationData.extraPaymentRequired}
                              onChange={handleInputChange}
                              className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>
                        
                        {/* Total Verification */}
                        <div className="pt-3 border-t border-amber-200 flex justify-between items-center">
                          <span className="font-medium text-gray-700">Total:</span>
                          <div className="text-right">
                            <span className="font-bold text-amber-700 block">
                              {formatCurrency(
                                parseFloat(compensationData.usedDepositAmount || 0) + 
                                parseFloat(compensationData.extraPaymentRequired || 0)
                              )}
                            </span>
                          </div>
                        </div>
                        
                        {/* Deposit Return Notice */}
                        {compensationData.amount < (() => {
                          const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
                          const requestId = borrowHistory.requestId;
                          const contract = contractsMap[requestId] || {};
                          const contractId = contract.contractId || 0;
                          const deposit = depositsMap[contractId];
                          return deposit?.amount || 0;
                        })() && (
                          <div className="p-3 mt-3 bg-green-50 rounded-md border border-green-100">
                            <div className="flex items-center text-green-700 mb-1">
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span className="font-medium text-sm">Partial Deposit Return</span>
                            </div>
                            <div className="flex justify-between items-center ml-6 mt-1">
                              <span className="text-xs text-gray-600">Amount to return to customer:</span>
                              <span className="font-medium text-sm text-green-700">
                                {formatCurrency((() => {
                                  const borrowHistory = borrowHistoryMap[selectedReport.borrowHistoryId] || {};
                                  const requestId = borrowHistory.requestId;
                                  const contract = contractsMap[requestId] || {};
                                  const contractId = contract.contractId || 0;
                                  const deposit = depositsMap[contractId];
                                  return Math.max(0, (deposit?.amount || 0) - (compensationData.usedDepositAmount || 0));
                                })())}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method {selectedReport.damageFee === 0 ? "(for returning deposit)" : "(for additional payment)"}
                  </label>
                  <select
                    name="paymentMethod"
                    value={compensationData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm appearance-none bg-white"
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={compensationData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    rows="3"
                    placeholder="Add any additional notes about the compensation"
                  ></textarea>
                </div>
              </div>
              
              {/* Footer with Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCompensationModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg hover:from-amber-700 hover:to-amber-600 transition-colors shadow-sm"
                >
                  {selectedReport.damageFee === 0 
                    ? "Confirm Deposit Return" 
                    : "Complete Compensation"}
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