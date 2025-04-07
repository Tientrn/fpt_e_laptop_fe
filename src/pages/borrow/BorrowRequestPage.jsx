import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateitemsApi from "../../api/donateitemsApi";
import userinfoApi from "../../api/userinfoApi";
import borrowrequestApi from "../../api/borrowrequestApi";
import borrowhistoryApi from "../../api/borrowhistoryApi";
import { ArrowLeft, Calendar, User, Laptop, Check } from "lucide-react";

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
    endDate: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [borrowData, setBorrowData] = useState(null);

  // Calculate min and max end dates based on start date
  const calculateEndDateConstraints = (startDate) => {
    const start = new Date(startDate);
    const minEndDate = new Date(start);
    minEndDate.setMonth(start.getMonth() + 4);
    
    const maxEndDate = new Date(start);
    maxEndDate.setMonth(start.getMonth() + 8);

    return {
      min: minEndDate.toISOString().split("T")[0],
      max: maxEndDate.toISOString().split("T")[0]
    };
  };

  // Update end date when start date changes
  useEffect(() => {
    if (formData.borrowDate) {
      const { min } = calculateEndDateConstraints(formData.borrowDate);
      setFormData(prev => ({
        ...prev,
        endDate: min // Set end date to minimum allowed date when start date changes
      }));
    }
  }, [formData.borrowDate]);

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
    
    if (name === "borrowDate") {
      const { min } = calculateEndDateConstraints(value);
      setFormData({
        borrowDate: value,
        endDate: min // Reset end date to minimum when start date changes
      });
    } else if (name === "endDate") {
      const { min, max } = calculateEndDateConstraints(formData.borrowDate);
      if (value >= min && value <= max) {
        setFormData(prev => ({
          ...prev,
          endDate: value
        }));
      }
    }
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    const today = new Date().toISOString().split("T")[0];
    const { min, max } = calculateEndDateConstraints(formData.borrowDate);

    if (formData.borrowDate < today) {
      validationErrors.borrowDate = "Borrow date cannot be in the past.";
    }

    if (formData.endDate < min || formData.endDate > max) {
      validationErrors.endDate = "End date must be between 4 and 8 months from start date.";
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !laptop || !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-800 font-medium">{error || "Failed to load data"}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Laptops</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Borrow Request</h1>
        </div>

        <div className="space-y-6">
          {/* Laptop Details Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Laptop className="w-5 h-5 mr-2 text-amber-600" />
                Laptop Details
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">{laptop.itemName}</h3>
                    <p className="text-sm">
                      {" "}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">CPU</p>
                      <p className="font-medium">{laptop.cpu}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">RAM</p>
                      <p className="font-medium">{laptop.ram}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Storage</p>
                      <p className="font-medium">{laptop.storage}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Screen</p>
                      <p className="font-medium">{laptop.screenSize}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Condition</p>
                      <p className="font-medium">{laptop.conditionItem}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className={laptop.status === "Available" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{laptop.status}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-64 h-64">
                  <img
                    src={laptop.itemImage}
                    alt={laptop.itemName}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Borrower Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-amber-600" />
                Borrower Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Full Name</p>
                  <p className="font-medium">{userInfo.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{userInfo.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone Number</p>
                  <p className="font-medium">{userInfo.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Student Code</p>
                  <p className="font-medium">{userInfo.studentCode || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Borrow Details Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                Borrow Details
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="borrowDate"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.borrowDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                    />
                    {errors.borrowDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.borrowDate}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Choose your start date
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      min={calculateEndDateConstraints(formData.borrowDate).min}
                      max={calculateEndDateConstraints(formData.borrowDate).max}
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Must be between 4-8 months from start date
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={handleTermsChange}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-600"
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to care for and return the laptop in good condition.
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!termsAccepted || submitting}
                    className={`px-6 py-2.5 rounded-lg font-medium flex items-center ${
                      termsAccepted && !submitting
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowRequestPage;
