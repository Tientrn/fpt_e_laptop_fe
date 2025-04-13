import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FaHistory, FaCalendarAlt, FaEye, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import borrowhistoryApi from "../../api/borrowhistoryApi"; // Ensure the correct import of the API

const BorrowHistoryStudent = () => {
  const navigate = useNavigate();
  const goToDetail = (borrowHistoryId, id) => {
    navigate(`/student/borrowhistorydetailstudent/${borrowHistoryId}/${id}`);
  };

  const [borrowHistories, setBorrowHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Initialize as null

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      try {
        // Decode the token
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Extract userId (nameidentifier from decoded token)
        const userIdFromToken = decodedToken.userId;

        console.log("Decoded userId:", userIdFromToken);

        setUserId(Number(userIdFromToken)); // Set userId in state
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Error decoding token");
      }
    }
  }, []); // Empty dependency array ensures this effect runs once on component mount

  useEffect(() => {
    if (userId) {
      const fetchBorrowHistories = async () => {
        try {
          setLoading(true);
          const response = await borrowhistoryApi.getAllBorrowHistories();
          if (response?.isSuccess && response.data) {
            const filteredHistories = response.data.filter(
              (history) => history.userId === userId
            );

            // 🔽 Sort từ mới nhất đến cũ nhất
            const sortedHistories = filteredHistories.sort(
              (a, b) => b.borrowHistoryId - a.borrowHistoryId
            );

            setBorrowHistories(sortedHistories);

            if (sortedHistories.length === 0) {
              toast.info("No borrow history for this user");
            }
          } else {
            toast.info("No borrow history available");
          }
        } catch (error) {
          console.error("Error fetching borrow histories:", error);
          toast.error("Error loading borrow history");
        } finally {
          setLoading(false);
        }
      };

      fetchBorrowHistories();
    }
  }, [userId]);
  // Trigger the effect when userId changes

  // Check if the date is valid
  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
          <p className="mt-3 text-indigo-600 font-medium">Loading history...</p>
        </div>
      </div>
    );
  }

  if (borrowHistories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaHistory className="mr-3" /> Borrow History
            </h1>
            <p className="text-indigo-100 mt-1">View your laptop borrowing records</p>
          </div>
          
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="text-indigo-600 mb-4">
              <FaExclamationCircle className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No History Found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              You haven&apos;t borrowed any laptops yet. Once you borrow a laptop, your history will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaHistory className="mr-3" /> Borrow History
            </h1>
            <p className="text-indigo-100 mt-1">View your laptop borrowing records</p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {borrowHistories.map((history) => (
                <div
                  key={history.borrowHistoryId}
                  className="bg-white border border-indigo-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="border-b border-indigo-100 p-4 md:p-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaHistory className="text-indigo-600" />
                      </div>
                      Borrow Record
                    </h2>
                    <button
                      onClick={() =>
                        goToDetail(history.borrowHistoryId, history.requestId)
                      }
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </button>
                  </div>

                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FaCalendarAlt className="text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500">Borrow Date</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {isValidDate(history.borrowDate)
                              ? format(new Date(history.borrowDate), "dd MMMM yyyy")
                              : "Invalid date"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <FaCalendarAlt className="text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500">Return Date</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {isValidDate(history.returnDate)
                              ? format(new Date(history.returnDate), "dd MMMM yyyy")
                              : "Invalid date"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistoryStudent;
