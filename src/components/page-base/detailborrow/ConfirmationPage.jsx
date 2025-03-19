import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, addMonths } from 'date-fns';

const ConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [formData, setFormData] = useState({
    fullName: '', // Will be pre-filled from profile
    email: '',    // Will be pre-filled from profile
    phone: '',
    citizenId: ''
  });
  const [errors, setErrors] = useState({});

  // Rental period is fixed at 4 months (1 semester)
  const rentalPrice = 2000000; // 2,000,000 VND per semester

  useEffect(() => {
    // Calculate end date (4 months from start date)
    const startDateObj = new Date(startDate);
    const endDateObj = addMonths(startDateObj, 4);
    setEndDate(format(endDateObj, 'yyyy-MM-dd'));
  }, [startDate]);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchLaptopDetails = async () => {
      try {
        const mockLaptop = {
          id: id,
          name: "HP Pavilion 14",
          image: "https://example.com/laptop.jpg",
          processor: "Intel Core i7-1165G7",
          ram: "16GB DDR4",
          storage: "512GB SSD",
          display: "14-inch FHD IPS",
          condition: "Excellent"
        };
        setLaptop(mockLaptop);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load laptop details");
        setLoading(false);
      }
    };

    fetchLaptopDetails();
  }, [id]);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showSuccess, navigate]);

  // Fetch user profile data
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUserProfile = async () => {
      try {
        // Mock profile data
        const profileData = {
          fullName: "John Doe",
          email: "john.doe@example.com"
        };
        setFormData(prev => ({
          ...prev,
          fullName: profileData.fullName,
          email: profileData.email
        }));
      } catch (error) {
        toast.error("Failed to load user profile");
      }
    };
    fetchUserProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Phone validation (10 digits)
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Citizen ID validation (12 digits)
    if (!formData.citizenId) {
      newErrors.citizenId = 'Citizen ID is required';
    } else if (!/^[0-9]{12}$/.test(formData.citizenId)) {
      newErrors.citizenId = 'Citizen ID must be 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleConfirm = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      // TODO: Implement API call to submit borrow request with formData
      setShowSuccess(true);
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform animate-fadeIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Borrow Request Successful!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Your request has been submitted successfully.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Redirecting to home in {countdown} seconds...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-teal-600 hover:text-teal-700 transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Confirm Borrowing Details</h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Account Information - New Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name - Disabled, pre-filled */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                {/* Email - Disabled, pre-filled */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Citizen ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Citizen ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleInputChange}
                    placeholder="Enter your citizen ID"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      ${errors.citizenId ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.citizenId && (
                    <p className="mt-1 text-sm text-red-500">{errors.citizenId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Laptop Details */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Laptop Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Model:</span>
                    <span className="ml-2 text-gray-600">{laptop.name}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Processor:</span>
                    <span className="ml-2 text-gray-600">{laptop.processor}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">RAM:</span>
                    <span className="ml-2 text-gray-600">{laptop.ram}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Storage:</span>
                    <span className="ml-2 text-gray-600">{laptop.storage}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Display:</span>
                    <span className="ml-2 text-gray-600">{laptop.display}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Condition:</span>
                    <span className="ml-2 text-gray-600">{laptop.condition}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Rental Details */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rental Details</h2>
              
              {/* Rental Period Info */}
              <div className="mb-6">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-teal-700">
                      Rental period is fixed at 4 months (one semester)
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date (4 months from start)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Total Cost */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold text-gray-900">Semester Fee:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Includes maintenance and support for the entire 4-month semester
                  </p>
                </div>
                <span className="text-2xl font-bold text-teal-600">
                  {rentalPrice.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Confirm Borrowing
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationPage; 