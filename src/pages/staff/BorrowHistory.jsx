import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FaSearch, FaEye, FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import borrowhistoryApi from "../../api/borrowhistoryApi";
import userinfoApi from "../../api/userinfoApi";
import borrowRequestApi from "../../api/borrowRequestApi";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  FaSearch,
} from 'react-icons/fa';
import borrowhistoryApi from '../../api/borrowhistoryApi';
import userApi from '../../api/userApi';
import borrowRequestApi from '../../api/borrowRequestApi';
import donateitemsApi from '../../api/donateitemsApi';

const BorrowHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [requestsMap, setRequestsMap] = useState({});

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  useEffect(() => {
    if (borrowHistory.length > 0) {
      fetchUserInfo();
      fetchBorrowRequests();
    }
  }, [borrowHistory]);

  useEffect(() => {
    if (borrowHistory.length > 0) {
      console.log('Current Borrow History:', borrowHistory);
      console.log('Item IDs to fetch:', borrowHistory.map(item => item.itemId));
    }
  }, [borrowHistory]);

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
      } else {
        toast.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Unable to load user information");
    }
  };

  const fetchBorrowHistory = async () => {
    try {
      const response = await borrowhistoryApi.getAllBorrowHistories();
      console.log('Borrow History Response:', response);
      
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

  const fetchBorrowRequests = async () => {
    try {
      const response = await borrowRequestApi.getAllBorrowRequests();
      if (response.isSuccess) {
        const requestMap = response.data.reduce(
          (map, request) => ({
            ...map,
            [request.requestId]: {
              itemName: request.itemName,
              status: request.status,
            },
          }),
          {}
        );
        setRequestsMap(requestMap);
      }
    } catch (error) {
      console.error("Error fetching borrow requests:", error);
    }
  };

  const filteredHistory = borrowHistory.filter((item) => {
    const userInfo = userInfoMap[item.userId] || {};
    const matchesSearch =
      userInfo.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header with Staff Role Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-black">Borrow History</h1>
          <span className="text-sm text-amber-600 font-medium">
            Staff Dashboard
          </span>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-600" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "History ID",
                  "Request ID",
                  "Full Name",
                  "Email",
                  "Item Name",
                  "Borrow Date",
                  "Return Date",
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
              {currentItems.map((item) => (
                <tr key={item.borrowHistoryId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-black">
                    #{item.borrowHistoryId}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    #{item.requestId}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {userInfoMap[item.userId]?.fullName || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {userInfoMap[item.userId]?.email || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {requestsMap[item.requestId]?.itemName || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {format(new Date(item.borrowDate), "dd/MM/yyyy HH:mm:ss")}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {item.returnDate
                      ? format(new Date(item.returnDate), "dd/MM/yyyy HH:mm:ss")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-black">
        <span>
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, filteredHistory.length)} of{" "}
          {filteredHistory.length} entries
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-slate-600 text-white rounded-md disabled:bg-slate-300 hover:bg-amber-600 transition-colors"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-amber-600 text-white"
                  : "bg-slate-600 text-white hover:bg-amber-600"
              } transition-colors`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-slate-600 text-white rounded-md disabled:bg-slate-300 hover:bg-amber-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistory;
