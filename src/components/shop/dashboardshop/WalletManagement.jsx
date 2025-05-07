import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaWallet,
  FaExchangeAlt,
  FaFilter,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaMoneyBillWave,
} from "react-icons/fa";
import { format, parseISO } from "date-fns";
import walletApi from "../../../api/walletApi";
import { getWalletByUserId } from "../../../utils/getWalletByUserId";

const WalletManagement = () => {
  const [walletInfo, setWalletInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    type: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Generate a transaction ID
  const encodeId = (id) => `TX-${id.toString(36).toUpperCase()}`;

  // Fetch wallet and transaction data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [walletData, transactionsResponse] = await Promise.all([
          getWalletByUserId(),
          walletApi.getTransactions(),
        ]);

        if (walletData) {
          setWalletInfo(walletData);
        }

        if (transactionsResponse?.isSuccess) {
          const sortedTransactions = transactionsResponse.data.sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          );
          setTransactions(sortedTransactions || []);
          setFilteredTransactions(sortedTransactions || []);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast.error("Error loading wallet data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...transactions];

    // Filter by type
    if (filters.type !== "all") {
      result = result.filter(
        (transaction) => transaction.transactionType === filters.type
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(
        (transaction) => new Date(transaction.createdDate) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(
        (transaction) => new Date(transaction.createdDate) <= toDate
      );
    }

    // Filter by search term (in transaction ID or note)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (transaction) =>
          encodeId(transaction.transactionId)
            .toLowerCase()
            .includes(searchTerm) ||
          (transaction.note &&
            transaction.note.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredTransactions(result);
  }, [filters, transactions]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "all",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
  };

  // Handle withdraw money
  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawAmount) > walletInfo?.balance) {
      toast.error("Withdrawal amount exceeds your balance");
      return;
    }

    try {
      setIsWithdrawing(true);
      const response = await walletApi.withdrawMoney(
        parseFloat(withdrawAmount)
      );

      if (response && (response.isSuccess || response.status === 200)) {
        toast.success("Money withdrawal successful!");

        // Update wallet balance
        const updatedWallet = await getWalletByUserId();
        setWalletInfo(updatedWallet);

        // Refresh transactions
        const transactionsResponse = await walletApi.getTransactions();
        if (transactionsResponse?.isSuccess) {
          const sortedTransactions = transactionsResponse.data.sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          );
          setTransactions(sortedTransactions || []);
          setFilteredTransactions(sortedTransactions || []);
        }

        // Reset form
        setWithdrawAmount("");
        setWithdrawNote("");
        setShowWithdrawModal(false);
      } else {
        toast.error(
          response?.message || "Withdrawal failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error withdrawing money:", error);
      const errorMessage = error?.message || "Error processing withdrawal";
      toast.error(errorMessage);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Handle transaction flow display
  const getTransactionFlow = (transaction) => {
    // Calculate the cash flow
    let cashFlow = 0;
    let flowType = "";

    if (transaction.transactionType === "Deposit") {
      cashFlow = transaction.amount;
      flowType = "in";
    } else if (transaction.transactionType === "Compensation") {
      if (transaction.extraPaymentRequired > 0) {
        cashFlow = transaction.extraPaymentRequired;
        flowType = "in";
      } else if (
        transaction.refundAmount !== null &&
        transaction.refundAmount > 0
      ) {
        cashFlow = transaction.refundAmount;
        flowType = "out";
      } else if (transaction.usedDepositAmount < transaction.amount) {
        cashFlow = transaction.amount - transaction.usedDepositAmount;
        flowType = "out";
      }
    } else if (
      transaction.transactionType === "Refund" ||
      transaction.transactionType === "Withdraw"
    ) {
      cashFlow = transaction.amount;
      flowType = "out";
    }

    return {
      cashFlow,
      flowType,
      display: (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            flowType === "in"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {flowType === "in" ? "+" : "-"}
          {formatCurrency(cashFlow)}
        </span>
      ),
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Wallet Management</h1>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <FaMoneyBillWave className="mr-2" />
          Withdraw Money
        </button>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-white/10 backdrop-blur-sm p-6">
          <div className="flex items-center mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FaWallet className="text-white text-xl" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-white">
              Wallet Balance
            </h2>
          </div>
          <div className="mt-4">
            <p className="text-white/70 text-xs">Current Balance</p>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-bold text-white">
                {formatCurrency(walletInfo?.balance || 0)}
              </span>
              <span className="text-white/70 ml-1 text-xs">VND</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex items-center mb-4">
          <FaFilter className="text-amber-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">
            Filter Transactions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Transaction Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Transactions</option>
              <option value="Deposit">Deposits</option>
              <option value="Compensation">Compensations</option>
              <option value="Refund">Refunds</option>
              <option value="Withdraw">Withdrawals</option>
            </select>
          </div>

          {/* Date From Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Date To Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by ID or note"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Reset Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <FaExchangeAlt className="text-amber-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">
              Transaction History
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No transactions found with the selected filters.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions
                  .filter((transaction) =>
                    ["TransferIn", "Payment"].includes(
                      transaction.transactionType
                    )
                  )
                  .map((transaction) => {
                    return (
                      <tr
                        key={transaction.transactionId}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {encodeId(transaction.transactionId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full 
                            ${
                              transaction.transactionType === "Deposit"
                                ? "bg-green-100 text-green-800"
                                : transaction.transactionType === "Compensation"
                                ? "bg-amber-100 text-amber-800"
                                : transaction.transactionType === "Withdraw"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {transaction.transactionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(
                            parseISO(transaction.createdDate),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {transaction.note || "-"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Withdraw Money Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-4 w-full border border-amber-100 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <FaMoneyBillWave className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Withdraw Money
            </h2>
            <p className="text-gray-600 text-center text-sm mb-6">
              Current Balance: {formatCurrency(walletInfo?.balance || 0)}
            </p>

            <form onSubmit={handleWithdraw}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Withdraw (VND)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="10000"
                  max={walletInfo?.balance}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Minimum withdrawal: 10,000 VND
                </p>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isWithdrawing ||
                    !withdrawAmount ||
                    parseFloat(withdrawAmount) <= 0
                  }
                  className={`flex-1 py-2 px-4 rounded-md text-white flex items-center justify-center
                    ${
                      isWithdrawing ||
                      !withdrawAmount ||
                      parseFloat(withdrawAmount) <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-amber-600 hover:bg-amber-700"
                    } transition-colors`}
                >
                  {isWithdrawing ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                      Processing...
                    </>
                  ) : (
                    "Withdraw"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default WalletManagement;
