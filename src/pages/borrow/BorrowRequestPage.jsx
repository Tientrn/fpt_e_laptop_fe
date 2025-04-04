import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateitemsApi from "../../api/donateitemsApi";
import userinfoApi from "../../api/userinfoApi";
import borrowrequestApi from "../../api/borrowRequestApi";
import borrowhistoryApi from "../../api/borrowhistoryApi";
const BorrowRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    borrowDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [borrowData, setBorrowData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: `/borrow-request/create/${id}` } });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const laptopResponse = await donateitemsApi.getDonateItemById(id);
        const userResponse = await userinfoApi.getUserInfo();
        if (laptopResponse.isSuccess && userResponse.isSuccess) {
          setLaptop(laptopResponse.data);
          setUserInfo(userResponse.data);
          if (laptopResponse.data.status !== "Available") {
            setError("This laptop is no longer available for borrowing.");
          }
        } else {
          setError("Failed to load required information.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    const today = new Date().toISOString().split("T")[0];
    const semesterStartDate = "2025-04-01";
    const semesterEndDate = "2025-06-30";
    if (formData.borrowDate < today) {
      validationErrors.borrowDate = "Borrow date cannot be in the past.";
    }
    if (
      formData.borrowDate < semesterStartDate ||
      formData.borrowDate > semesterEndDate
    ) {
      validationErrors.borrowDate =
        "Borrow date must be within the current semester.";
    }
    if (formData.endDate < formData.borrowDate) {
      validationErrors.endDate = "End date must be after the borrow date.";
    }
    if (formData.endDate > semesterEndDate) {
      validationErrors.endDate =
        "End date cannot exceed the semester end date.";
    }
    if (!termsAccepted) {
      validationErrors.terms = "You must accept the terms and conditions.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }

    try {
      setSubmitting(true);

      // 1. Gửi yêu cầu tạo Borrow Request
      const requestData = {
        itemId: laptop.itemId,
        startDate: formData.borrowDate,
        endDate: formData.endDate,
        itemName: laptop.itemName,
        status: "Pending",
      };

      const requestResponse = await borrowrequestApi.createBorrowRequest(
        requestData
      );
      console.log("Request response:", requestResponse);

      if (requestResponse?.isSuccess && requestResponse.data) {
        const requestId = requestResponse.data.requestId; // Lấy ID từ phản hồi
        console.log(`data request: ${requestId}`);

        if (!requestId) {
          toast.error("Request ID is missing.");
          return;
        }

        // 2. Gửi yêu cầu tạo Borrow History với requestId vừa nhận
        const historyData = {
          requestId: requestId,
          itemId: laptop.itemId,
          userId: userInfo.userId, // Giả sử userInfo có userId
          borrowDate: formData.borrowDate,
          returnDate: formData.endDate,
        };

        console.log("Request data for borrow history:", historyData);
        const historyResponse = await borrowhistoryApi.createBorrowHistory(
          historyData
        );

        if (historyResponse?.isSuccess) {
          toast.success(
            "Request and history created successfully! Redirecting...",
            {
              autoClose: 2000,
            }
          );
          setTimeout(() => navigate("/student/requests"), 2000);
        } else {
          toast.error(
            historyResponse?.message || "Failed to create borrow history"
          );
        }
      } else {
        toast.error(
          requestResponse?.message || "Failed to submit borrow request"
        );
      }
    } catch (err) {
      console.error("Error creating request:", err);
      // Log more details for debugging
      toast.error(err?.response?.data?.message || "An error occurred.");
      // For debugging, you could also add:
      console.log("Error response:", err?.response);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  if (error || !laptop || !userInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-black">{error || "Failed to load data"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-black mb-4 hover:text-amber-600"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Title */}
        <h1 className="text-xl font-medium text-black mb-6">Borrow Request</h1>

        {/* Laptop Details */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-black mb-3 border-b border-amber-600 pb-1">
            Laptop Details
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 text-black text-sm">
              <p className="font-medium">{laptop.itemName}</p>
              <p>
                Status:{" "}
                <span
                  className={
                    laptop.status === "Available"
                      ? "text-amber-600"
                      : "text-red-600"
                  }
                >
                  {laptop.status}
                </span>
              </p>
              <p>CPU: {laptop.cpu}</p>
              <p>RAM: {laptop.ram}</p>
              <p>Storage: {laptop.storage}</p>
              <p>Screen: {laptop.screenSize}</p>
              <p>Condition: {laptop.conditionItem}</p>
            </div>
            <img
              src={laptop.itemImage}
              alt={laptop.itemName}
              className="w-40 h-40 object-contain rounded border border-gray-200"
            />
          </div>
        </div>

        {/* Borrower Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-black mb-3 border-b border-amber-600 pb-1">
            Borrower Information
          </h2>
          <div className="grid grid-cols-1 gap-1 text-black text-sm">
            <p>
              <span className="font-medium">Name:</span> {userInfo.fullName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {userInfo.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {userInfo.phoneNumber || "N/A"}
            </p>
            <p>
              <span className="font-medium">Student Code:</span>{" "}
              {userInfo.studentCode || "N/A"}
            </p>
          </div>
        </div>

        {/* Borrow Form */}
        <div>
          <h2 className="text-lg font-medium text-black mb-3 border-b border-amber-600 pb-1">
            Borrow Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="borrowDate"
                  className="block text-black text-sm mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="borrowDate"
                  name="borrowDate"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.borrowDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-amber-600"
                />
                {errors.borrowDate && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.borrowDate}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-black text-sm mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  min={formData.borrowDate}
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-amber-600"
                />
                {errors.endDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="mt-1 h-4 w-4 text-amber-600 border-gray-200 rounded focus:ring-amber-600"
              />
              <label htmlFor="terms" className="ml-2 text-black text-sm">
                I agree to care for and return the laptop in good condition.
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-amber-600"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!termsAccepted || submitting}
                className={`px-4 py-2 text-white rounded ${
                  termsAccepted && !submitting
                    ? "bg-slate-600 hover:bg-amber-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BorrowRequestPage;