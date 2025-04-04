import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { format } from "date-fns";
import borrowhistoryApi from "../../api/borrowhistoryApi"; // Ensure the correct import of the API

const BorrowHistoryStudent = () => {
  const navigate = useNavigate();
  const goToDetail = (id) => {
    navigate(`/student/borrowhistorydetailstudent/${id}`);
  };

  const [borrowHistories, setBorrowHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Initialize as null

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Extract userId (nameidentifier from decoded token)
        const userIdFromToken =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        console.log("Decoded userId:", userIdFromToken);

        setUserId(Number(userIdFromToken)); // Set userId in state
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Lỗi khi giải mã token");
      }
    }
  }, []); // Empty dependency array ensures this effect runs once on component mount

  useEffect(() => {
    if (userId) {
      const fetchBorrowHistories = async () => {
        try {
          setLoading(true);
          const response = await borrowhistoryApi.getAllBorrowHistories();
          console.log("API Response:", response);
          if (response?.isSuccess && response.data) {
            // Filter the borrow histories by the logged-in userId
            const filteredHistories = response.data.filter(
              (history) => history.userId === userId
            );
            response.data.forEach((history) => {
              console.log(
                "history.userId:",
                history.userId,
                "Type:",
                typeof history.userId
              );
            });
            console.log("userId:", userId, "Type:", typeof userId);
            console.log(`filteredHistiries:${filteredHistories}`);
            setBorrowHistories(filteredHistories);

            if (filteredHistories.length === 0) {
              toast.info("Không có lịch sử mượn nào cho người dùng này");
            }
          } else {
            toast.info("Không có lịch sử mượn nào");
          }
        } catch (error) {
          console.error("Error fetching borrow histories:", error);
          toast.error("Lỗi khi tải lịch sử mượn");
        } finally {
          setLoading(false);
        }
      };

      fetchBorrowHistories();
    }
  }, [userId]); // Trigger the effect when userId changes

  // Check if the date is valid
  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (borrowHistories.length === 0) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <p className="text-gray-500 text-sm">Không có lịch sử mượn nào</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-6">Lịch sử mượn</h1>

        <div className="space-y-6">
          {borrowHistories.map((history) => (
            <div
              key={history.borrowHistoryId}
              className="p-6 border border-gray-200 rounded-lg shadow-md bg-white"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-black">Borrow</h2>
                <button
                  onClick={() => goToDetail(history.requestId)}
                  className="text-white border bg-slate-600 px-4 py-2 text-sm rounded hover:bg-amber-600 hover:text-white transition"
                >
                  View Detail
                </button>
              </div>

              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Ngày mượn</p>
                    <p className="text-lg text-black">
                      {isValidDate(history.borrowDate)
                        ? format(new Date(history.borrowDate), "dd/MM/yyyy")
                        : "Ngày không hợp lệ"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày trả</p>
                    <p className="text-lg text-black">
                      {isValidDate(history.returnDate)
                        ? format(new Date(history.returnDate), "dd/MM/yyyy")
                        : "Ngày không hợp lệ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowHistoryStudent;
