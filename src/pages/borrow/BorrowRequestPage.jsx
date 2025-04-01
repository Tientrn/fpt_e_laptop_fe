import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateitemsApi from "../../api/donateitemsApi";
import userinfoApi from "../../api/userinfoApi";
import borrowrequestApi from "../../api/borrowRequestApi";

const BorrowRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    borrowDate: new Date().toISOString().split('T')[0], // Today as default
    endDate: new Date().toISOString().split('T')[0] // Today as default
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: `/borrow-request/create/${id}` } });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch laptop details
        const laptopResponse = await donateitemsApi.getDonateItemById(id);
        
        // Fetch user info
        const userResponse = await userinfoApi.getUserInfo();
        
        if (laptopResponse.isSuccess && userResponse.isSuccess) {
          setLaptop(laptopResponse.data);
          setUserInfo(userResponse.data);
          
          // Check if laptop is available
          if (laptopResponse.data.status !== 'Available') {
            setError("This laptop is no longer available for borrowing.");
          }
        } else {
          setError("Failed to load required information. Please try again.");
        }
      } catch (err) {
        setError("An error occurred. Please check your connection and try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    try {
      setSubmitting(true);
      const requestData = {
        itemId: laptop.itemId,
        startDate: formData.borrowDate,
        endDate: formData.endDate,
        itemName: laptop.itemName,
        status: 'Pending'
      };
      
      const response = await borrowrequestApi.createBorrowRequest(requestData);
      console.log("Create response:", response);
      
      if (response && response.isSuccess) {
        toast.success("Request created successfully! Redirecting in 3 seconds...", {
          autoClose: 3000
        });
        
        setTimeout(() => {
          navigate("/student/requests");
        }, 3000);
        
      } else {
        if (response.message && response.message.includes("already has a borrow request")) {
          toast.error("You already have an active borrow request", {
            autoClose: 5000
          });
        } else {
          toast.error(response.message || "Failed to submit borrow request");
        }
      }
    } catch (err) {
      console.error("Error creating request:", err);
      if (err.response?.data?.message) {
        if (err.response.data.message.includes("already has a borrow request")) {
          toast.error("You already have an active borrow request", {
            autoClose: 5000
          });
        } else {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("You already sent an active borrow request.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !laptop || !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Failed to load required information"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8 flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-lg max-w-5xl mx-auto w-full">
        <div className="h-full flex flex-col">
          <div className="bg-teal-600 text-white p-4 sm:p-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white hover:text-teal-100 transition-colors mb-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl font-bold">Borrow Request</h1>
            <p className="text-teal-100">
              Complete the form below to request to borrow this laptop
            </p>
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {/* Vertical layout with three sections */}
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Section 1 - Laptop Details */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Laptop Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column - Specifications */}
                  <div className="space-y-4 text-base text-gray-600 ">
                    <h3 className="text-xl font-medium text-gray-900">
                      {laptop.itemName}
                    </h3>
                    <p className="text-base text-teal-600 font-medium mt-1">
                      Status: <span className={`${laptop.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{laptop.status}</span>
                    </p>
                    <p>
                      <span className="font-medium">CPU:</span> {laptop.cpu}
                    </p>
                    <p>
                      <span className="font-medium">RAM:</span> {laptop.ram}
                    </p>
                    <p>
                      <span className="font-medium">Storage:</span> {laptop.storage}
                    </p>
                    <p>
                      <span className="font-medium">Screen:</span> {laptop.screenSize}
                    </p>
                    <p>
                      <span className="font-medium">Condition:</span>{" "}
                      {laptop.conditionItem}
                    </p>
                  </div>
                  
                  {/* Right column - Image */}
                  <div className="flex">
                    <div className="w-56 h-56 mb-4">
                      <img
                        src={laptop.itemImage}
                        alt={laptop.itemName}
                        className="w-full h-full object-contain bg-white rounded-lg border"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 - Borrower Information */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Borrower Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium block mb-1">Full Name:</span>
                      <span className="text-gray-800 text-lg">{userInfo.fullName}</span>
                    </div>
                    <div>
                      <span className="font-medium block mb-1">Email:</span>
                      <span className="text-gray-800 text-lg">{userInfo.email}</span>
                    </div>
                    <div>
                      <span className="font-medium block mb-1">Date of Birth:</span>
                      <span className="text-gray-800 text-lg">{userInfo.dob || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-medium block mb-1">Gender:</span>
                      <span className="text-gray-800 text-lg">{userInfo.gender || "Not provided"}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium block mb-1">Phone Number:</span>
                      <span className="text-gray-800 text-lg">{userInfo.phoneNumber || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-medium block mb-1">Student Code:</span>
                      <span className="text-gray-800 text-lg">{userInfo.studentCode || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-medium block mb-1">Role:</span>
                      <span className="text-gray-800 text-lg">{userInfo.roleName || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-medium block mb-1">Identity Card:</span>
                      <span className="text-gray-800 text-lg">{userInfo.identityCard || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 - Borrow Form */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Borrow Details
                </h2>
                <form onSubmit={handleSubmit}>
                  {/* Borrow Information in 3 equal columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Borrow Date */}
                    <div>
                      <label
                        htmlFor="borrowDate"
                        className="block text-base font-medium text-gray-700 mb-1"
                      >
                        Start Date*
                      </label>
                      <input
                        type="date"
                        id="borrowDate"
                        name="borrowDate"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.borrowDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label
                        htmlFor="endDate"
                        className="block text-base font-medium text-gray-700 mb-1"
                      >
                        End Date*
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        required
                        min={formData.borrowDate}
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="border-t pt-4 mb-4 ">
                    <div className="flex items-start mt-6">
                      <div className="flex items-center h-5 ">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          checked={termsAccepted}
                          onChange={handleTermsChange}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                          I agree to the terms and conditions
                        </label>
                        <p className="text-gray-500">
                          I will take good care of the laptop and return it in the same condition.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-center pt-4 mt-8">
                    <div className="flex space-x-4 w-full max-w-md">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!termsAccepted || submitting}
                        className={`flex-1 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          termsAccepted && !submitting
                            ? "bg-teal-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400" 
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {submitting ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowRequestPage; 