import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateitemsApi from "../../api/donateitemsApi";
import userinfoApi from "../../api/userinfoApi";
import borrowrequestApi from "../../api/borrowrequestApi";
import {
  ArrowLeft,
  Calendar,
  User,
  Check,
  XCircle,
  Clock,
  Shield,
  ChevronRight,
  Info,
} from "lucide-react";
import majorApi from "../../api/major";

const BorrowRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [major, setMajor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    borrowDate: new Date().toISOString().split("T")[0],
    endDate: "",
    majorId: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Calculate min and max end dates based on start date
  const calculateEndDateConstraints = (startDate) => {
    const start = new Date(startDate);
    const minEndDate = new Date(start);
    minEndDate.setMonth(start.getMonth() + 4);

    const maxEndDate = new Date(start);
    maxEndDate.setMonth(start.getMonth() + 8);

    return {
      min: minEndDate.toISOString().split("T")[0],
      max: maxEndDate.toISOString().split("T")[0],
    };
  };

  // Update end date when start date changes
  useEffect(() => {
    if (formData.borrowDate) {
      const { min } = calculateEndDateConstraints(formData.borrowDate);
      setFormData((prev) => ({
        ...prev,
        endDate: min,
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
        const majorResponse = await majorApi.getAllMajor();
        if (
          laptopResponse.isSuccess &&
          userResponse.isSuccess &&
          majorResponse.isSuccess
        ) {
          setLaptop(laptopResponse.data);
          setUserInfo(userResponse.data);
          setMajor(majorResponse.data);
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
        ...formData,
        borrowDate: value,
        endDate: min,
      });
    } else if (name === "endDate") {
      const { min, max } = calculateEndDateConstraints(formData.borrowDate);
      if (value >= min && value <= max) {
        setFormData((prev) => ({
          ...prev,
          endDate: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
      validationErrors.endDate =
        "End date must be between 4 and 8 months from start date.";
    }

    if (!formData.majorId) {
      validationErrors.majorId = "Please select your major.";
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

      // Ensure all required fields are present and properly formatted
      if (!laptop || !userInfo) {
        toast.error("Missing laptop or user information. Please try again.");
        return;
      }

      // Double-check laptop availability right before submitting
      try {
        const freshLaptopResponse = await donateitemsApi.getDonateItemById(
          laptop.itemId
        );
        if (
          !freshLaptopResponse.isSuccess ||
          freshLaptopResponse.data.status !== "Available"
        ) {
          toast.error("This laptop is no longer available for borrowing.");
          return;
        }
      } catch (error) {
        console.error("Error checking laptop availability:", error);
        toast.error("Could not verify laptop availability. Please try again.");
        return;
      }

      const requestData = {
        itemId: Number(laptop.itemId),
        userId: Number(userInfo.userId),
        startDate: formData.borrowDate,
        endDate: formData.endDate,
        majorId: Number(formData.majorId),
      };

      const requestResponse = await borrowrequestApi.createBorrowRequest(
        requestData
      );

      if (requestResponse?.isSuccess) {
        toast.success("Request created successfully! Redirecting...", {
          autoClose: 2000,
        });
        setTimeout(() => navigate("/student/requests"), 2000);
      } else {
        toast.error(
          requestResponse?.message || "Failed to submit borrow request"
        );
      }
    } catch (err) {
      console.error("Error creating request:", err);
      toast.warn(
        err?.response?.data?.message ||
          "You have another borrow laptop please complete contract and return it before borrowing again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-2xl shadow-md">
          <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium mt-4">
            Loading request details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !laptop || !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-4 border border-red-100">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-red-500">Request Error</h2>
          <p className="text-gray-700">{error || "Failed to load data"}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all font-medium text-sm shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2000} theme="light" />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-amber-500 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-amber-50 transition-colors mr-2">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Laptops</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
            Borrow Request
          </h1>
        </div>

        <div className="space-y-6">
          {/* Combined Info Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform transition-all">
            <div className="flex flex-col md:flex-row">
              {/* Laptop Image */}
              <div className="md:w-1/4 p-4 md:p-6 flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
                <img
                  src={laptop.itemImage}
                  alt={laptop.itemName}
                  className="w-32 h-32 md:w-full md:h-auto object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Laptop Details */}
              <div className="flex-1 p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {laptop.itemName}
                    </h2>
                    <span className="inline-block mt-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      {laptop.status}
                    </span>
                  </div>

                  <div className="mt-2 md:mt-0">
                    <h3 className="text-sm font-medium text-gray-500">
                      Student: {userInfo.fullName}
                    </h3>
                    <p className="text-xs text-gray-500">{userInfo.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">CPU</p>
                    <p className="text-sm font-medium">{laptop.cpu}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">RAM</p>
                    <p className="text-sm font-medium">{laptop.ram}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Storage</p>
                    <p className="text-sm font-medium">{laptop.storage}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Screen</p>
                    <p className="text-sm font-medium">{laptop.screenSize}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Borrow Request Form Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                Request Details
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="borrowDate"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.borrowDate}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                  </div>
                  {errors.borrowDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.borrowDate}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="endDate"
                      required
                      min={calculateEndDateConstraints(formData.borrowDate).min}
                      max={calculateEndDateConstraints(formData.borrowDate).max}
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                  </div>
                  {errors.endDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.endDate}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Must be between 4-8 months from start date
                  </p>
                </div>
              </div>

              {/* Major Selection */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Major
                </label>
                <div className="relative">
                  <select
                    name="majorId"
                    value={formData.majorId}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors appearance-none"
                  >
                    <option value="">Select your major</option>
                    {major &&
                      major.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-500" />
                </div>
                {errors.majorId && (
                  <p className="mt-1 text-xs text-red-500">{errors.majorId}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="p-4 mb-5 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center mb-3">
                  <Shield className="w-4 h-4 text-amber-600 mr-2" />
                  <h3 className="text-sm font-semibold text-amber-800">
                    Terms and Conditions
                  </h3>
                </div>
                <ul className="list-disc list-inside text-xs text-amber-900 space-y-1 ml-1 mb-3">
                  <li>
                    You must return the laptop in the same condition as
                    received.
                  </li>
                  <li>Any damage or loss will be your responsibility.</li>
                  <li>
                    The borrowing period is strictly between the selected dates.
                  </li>
                  <li>Extensions must be requested before the end date.</li>
                  <li>Failure to return on time may result in penalties.</li>
                </ul>
                <div className="flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={handleTermsChange}
                      className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                    />
                  </div>
                  <label
                    htmlFor="terms"
                    className="ml-2 text-xs text-amber-900 font-medium"
                  >
                    I agree to care for and return the laptop in good condition.
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500 ml-6">
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!termsAccepted || !formData.majorId || submitting}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center text-sm ${
                    termsAccepted && formData.majorId && !submitting
                      ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 shadow-md hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <div className="inline-flex items-center text-xs text-gray-500">
              <Info className="w-3 h-3 mr-1 text-amber-500" />
              Need help? Contact the IT Support team at support@fpt.edu.vn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowRequestPage;
