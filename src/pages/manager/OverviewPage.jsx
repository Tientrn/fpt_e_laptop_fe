import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaWallet,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaUsers,
  FaLaptop,
  FaChartPie,
  FaChartLine,
} from "react-icons/fa";
import { getWalletByUserId } from "../../utils/getWalletByUserId";
import { formatCurrency } from "../../utils/moneyValidationUtils";
import statisticSponerUserApi from "../../api/statisticSponerUser";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, parseISO } from "date-fns";

const OverviewPage = () => {
  const [walletInfo, setWalletInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [topSponsors, setTopSponsors] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#EC7063",
  ];
  const encodeId = (id) => `TX-${id.toString(36).toUpperCase()}`;

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          walletData,
          transactionsResponse,
          sponsorsResponse,
          donorsResponse,
        ] = await Promise.all([
          getWalletByUserId(),
          statisticSponerUserApi.getTransactionHistory(),
          statisticSponerUserApi.getTopSponsor(),
          statisticSponerUserApi.getTopDonor(),
        ]);

        if (walletData) {
          setWalletInfo(walletData);
        }

        if (transactionsResponse?.isSuccess) {
          setTransactions(transactionsResponse.data || []);
        }

        if (sponsorsResponse?.isSuccess) {
          setTopSponsors(sponsorsResponse.data || []);
        }

        if (donorsResponse?.isSuccess) {
          setTopDonors(donorsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading dashboard data");
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Group transactions by type
  const transactionsByType = transactions.reduce((acc, transaction) => {
    const type = transaction.transactionType;
    if (!acc[type]) {
      acc[type] = { type, count: 0, totalAmount: 0, inflow: 0, outflow: 0 };
    }
    acc[type].count += 1;
    acc[type].totalAmount += transaction.amount;

    // Calculate inflow and outflow
    if (type === "Deposit") {
      // Deposits are always inflow
      acc[type].inflow += transaction.amount;
    } else if (type === "Compensation") {
      // Compensation logic based on the scenarios
      if (transaction.extraPaymentRequired > 0) {
        // Case: deposit < damage, extra payment required (money coming in)
        acc[type].inflow += transaction.extraPaymentRequired;
      }

      if (transaction.usedDepositAmount < transaction.amount) {
        // Case: deposit > damage, remainder refunded (money going out)
        acc[type].outflow += transaction.amount - transaction.usedDepositAmount;
      }
    } else if (type === "Refund") {
      // Refunds are outflow
      acc[type].outflow += transaction.amount;
    }

    return acc;
  }, {});

  const transactionTypeChartData = Object.values(transactionsByType);

  // Calculate overall system balance from transactions
  const systemBalance = transactions.reduce((total, transaction) => {
    if (transaction.transactionType === "Deposit") {
      return total + transaction.amount;
    } else if (transaction.transactionType === "Compensation") {
      if (transaction.extraPaymentRequired > 0) {
        // Extra payment is inflow
        return total + transaction.extraPaymentRequired;
      }
      if (transaction.usedDepositAmount < transaction.amount) {
        // Refund is outflow
        return total - (transaction.amount - transaction.usedDepositAmount);
      }
      return total;
    } else if (transaction.transactionType === "Refund") {
      return total - transaction.amount;
    }
    return total;
  }, 0);

  // Create financial flow data
  const financialFlowData = [
    {
      name: "Inflow",
      value: transactionTypeChartData.reduce(
        (sum, type) => sum + type.inflow,
        0
      ),
    },
    {
      name: "Outflow",
      value: transactionTypeChartData.reduce(
        (sum, type) => sum + type.outflow,
        0
      ),
    },
  ];

  // Group transactions by month
  const transactionsByMonth = transactions.reduce((acc, transaction) => {
    const date = parseISO(transaction.createdDate);
    const monthYear = format(date, "MMM yyyy");

    if (!acc[monthYear]) {
      acc[monthYear] = {
        monthYear,
        totalAmount: 0,
        Deposit: 0,
        Compensation: 0,
        Refund: 0,
      };
    }

    acc[monthYear].totalAmount += transaction.amount;
    acc[monthYear][transaction.transactionType] =
      (acc[monthYear][transaction.transactionType] || 0) + transaction.amount;

    return acc;
  }, {});

  const monthlyTransactionData = Object.values(transactionsByMonth).sort(
    (a, b) => {
      return new Date(a.monthYear) - new Date(b.monthYear);
    }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-amber-600">
        Manager Dashboard
      </h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 mb-8">
        <button
          className={`mr-2 py-2 px-4 text-sm font-medium rounded-t-lg ${
            activeTab === "overview"
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-amber-100"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`mr-2 py-2 px-4 text-sm font-medium rounded-t-lg ${
            activeTab === "transactions"
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-amber-100"
          }`}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </button>
        <button
          className={`mr-2 py-2 px-4 text-sm font-medium rounded-t-lg ${
            activeTab === "sponsors"
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-amber-100"
          }`}
          onClick={() => setActiveTab("sponsors")}
        >
          Sponsors
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
            activeTab === "donors"
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-amber-100"
          }`}
          onClick={() => setActiveTab("donors")}
        >
          Donors
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          {/* Overview Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Wallet Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center mb-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaWallet className="text-white text-xl" />
                  </div>
                  <h2 className="ml-3 text-lg font-medium text-white">
                    Balance
                  </h2>
                </div>
                <div className="mt-4">
                  <p className="text-white/70 text-xs">Current Balance</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(walletInfo?.balance || 0)}
                    </span>
                    <span className="text-white/70 ml-1 text-xs">VND</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Count Card */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center mb-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaExchangeAlt className="text-white text-xl" />
                  </div>
                  <h2 className="ml-3 text-lg font-medium text-white">
                    Transactions
                  </h2>
                </div>
                <div className="mt-4">
                  <p className="text-white/70 text-xs">Total Transactions</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-white">
                      {transactions.length}
                    </span>
                    <span className="text-white/70 ml-1 text-xs">records</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Sponsors Card */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center mb-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <h2 className="ml-3 text-lg font-medium text-white">
                    Sponsors
                  </h2>
                </div>
                <div className="mt-4">
                  <p className="text-white/70 text-xs">Total Sponsors</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-white">
                      {topSponsors.length}
                    </span>
                    <span className="text-white/70 ml-1 text-xs">people</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Donors Card */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center mb-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaLaptop className="text-white text-xl" />
                  </div>
                  <h2 className="ml-3 text-lg font-medium text-white">
                    Donors
                  </h2>
                </div>
                <div className="mt-4">
                  <p className="text-white/70 text-xs">Total Donors</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-white">
                      {topDonors.length}
                    </span>
                    <span className="text-white/70 ml-1 text-xs">people</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Transaction Type Distribution - Modified to show inflow/outflow */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center mb-4">
                <FaChartPie className="text-amber-500 text-xl mr-2" />
                <h2 className="text-lg font-medium text-gray-800">
                  Transaction Distribution
                </h2>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="totalAmount"
                      nameKey="type"
                      label={({ type, percent }) =>
                        `${type}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {transactionTypeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cash Flow Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center mb-4">
                <FaMoneyBillWave className="text-amber-500 text-xl mr-2" />
                <h2 className="text-lg font-medium text-gray-800">
                  Cash Flow Summary
                </h2>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialFlowData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill="#4ade80" /> {/* Green for inflow */}
                      <Cell fill="#f87171" /> {/* Red for outflow */}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Transaction Trend */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center mb-4">
                <FaChartLine className="text-amber-500 text-xl mr-2" />
                <h2 className="text-lg font-medium text-gray-800">
                  Transaction Trends
                </h2>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTransactionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthYear" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalAmount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Total"
                    />
                    <Line type="monotone" dataKey="Deposit" stroke="#82ca9d" />
                    <Line
                      type="monotone"
                      dataKey="Compensation"
                      stroke="#ff7300"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FaExchangeAlt className="text-amber-500 text-xl mr-2" />
                <h2 className="text-lg font-medium text-gray-800">
                  Recent Transactions
                </h2>
              </div>
              <button
                className="px-3 py-1 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600"
                onClick={() => setActiveTab("transactions")}
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
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
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions
                    .sort((a, b) => b.transactionId - a.transactionId)
                    .slice(0, 5)
                    .map((transaction) => (
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
                              ? "bg-red-100 text-red-800"
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
                            new Date(transaction.createdDate),
                            "dd/MM/yyyy"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "transactions" && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center mb-6">
            <FaExchangeAlt className="text-amber-500 text-xl mr-2" />
            <h2 className="text-xl font-medium text-gray-800">
              Transaction History
            </h2>
          </div>

          {/* Transaction Line Chart */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Monthly Transaction Volume
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyTransactionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthYear" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar
                    dataKey="Deposit"
                    stackId="a"
                    fill="#82ca9d"
                    name="Deposit"
                  />
                  <Bar
                    dataKey="Compensation"
                    stackId="a"
                    fill="#ff7300"
                    name="Compensation"
                  />
                  <Bar
                    dataKey="Refund"
                    stackId="a"
                    fill="#8884d8"
                    name="Refund"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction Type Distribution - Updated to show inflow/outflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-4">
                Transaction Type Distribution
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ type, percent }) =>
                        `${type}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {transactionTypeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-4">
                Cash Flow Analysis
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transactionTypeChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar
                      dataKey="inflow"
                      name="Money Coming In"
                      fill="#4ade80"
                    />
                    <Bar
                      dataKey="outflow"
                      name="Money Going Out"
                      fill="#f87171"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Financial Flow Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  System Balance
                </h4>
                <p className="text-xl font-bold text-amber-600">
                  {formatCurrency(systemBalance)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on transaction history
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Total Money In
                </h4>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(financialFlowData[0].value)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Deposits and compensation payments
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Total Money Out
                </h4>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(financialFlowData[1].value)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Refunds and compensation returns
                </p>
              </div>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialFlowData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" name="Amount">
                    <Cell fill="#4ade80" /> {/* Green for inflow */}
                    <Cell fill="#f87171" /> {/* Red for outflow */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Transactions Table with detailed flow */}
          <div className="overflow-x-auto">
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
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Used Deposit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Extra Required
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cash Flow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
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
                      transaction.usedDepositAmount < transaction.amount
                    ) {
                      cashFlow =
                        transaction.amount - transaction.usedDepositAmount;
                      flowType = "out";
                    }
                  } else if (transaction.transactionType === "Refund") {
                    cashFlow = transaction.amount;
                    flowType = "out";
                  }

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
                        {transaction.usedDepositAmount !== null
                          ? formatCurrency(transaction.usedDepositAmount)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.extraPaymentRequired !== null
                          ? formatCurrency(transaction.extraPaymentRequired)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {flowType && (
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
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(
                          new Date(transaction.createdDate),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {transaction.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "sponsors" && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center mb-6">
            <FaUsers className="text-amber-500 text-xl mr-2" />
            <h2 className="text-xl font-medium text-gray-800">Top Sponsors</h2>
          </div>

          {/* Sponsors Chart */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Sponsor Contribution Distribution
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topSponsors}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="sponsorName" width={100} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar
                    dataKey="totalAmount"
                    name="Total Donation"
                    fill="#8884d8"
                  >
                    {topSponsors.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sponsors Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Contribution
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topSponsors.map((sponsor, index) => (
                  <tr key={sponsor.sponsorId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${
                          index === 0
                            ? "bg-amber-100 text-amber-800"
                            : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sponsor.sponsorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(sponsor.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "donors" && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center mb-6">
            <FaLaptop className="text-amber-500 text-xl mr-2" />
            <h2 className="text-xl font-medium text-gray-800">Top Donors</h2>
          </div>

          {/* Donors Chart */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Laptop Donation Distribution
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topDonors}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="donorName" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="totalLaptops"
                    name="Total Laptops Donated"
                    fill="#82ca9d"
                  >
                    {topDonors.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart for Percentage Contribution */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Donation Share
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topDonors}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="totalLaptops"
                    nameKey="donorName"
                    label={({ donorName, percent }) =>
                      `${donorName}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {topDonors.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donors Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Laptops
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topDonors.map((donor, index) => (
                  <tr key={donor.donorId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${
                          index === 0
                            ? "bg-amber-100 text-amber-800"
                            : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {donor.donorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donor.totalLaptops}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;
