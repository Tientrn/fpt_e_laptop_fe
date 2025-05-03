import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateformApi from "../../api/donateformApi";
import { jwtDecode } from "jwt-decode";

const LaptopInfo = () => {
  const [donationForms, setDonationForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = Number(decoded.userId);
        setUserId(id);
      } catch {
        // Token decode failed
      }
    }
  }, []);

  useEffect(() => {
    const fetchForms = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const res = await donateformApi.getAllDonateForms();

        const allForms = res.data || [];
        const sponsorForms = allForms
          .filter((form) => Number(form.sponsorId) === Number(userId))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setDonationForms(sponsorForms);
        setFilteredForms(sponsorForms);
      } catch {
        toast.error("Unable to load donation requests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [userId]);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredForms(donationForms);
    } else {
      setFilteredForms(
        donationForms.filter((form) => form.status === statusFilter)
      );
    }
  }, [statusFilter, donationForms]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get status label and style
  const getStatusInfo = (status) => {
    switch (status) {
      case "Approved":
        return {
          label: "Approved",
          className: "bg-green-100 text-green-700 border border-green-200",
          icon: (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case "Rejected":
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-600 border border-red-200",
          icon: (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        };
      case "Done":
        return {
          label: "Done",
          className: "bg-indigo-100 text-indigo-700 border border-indigo-200",
          icon: (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2l4 -4"
              />
            </svg>
          ),
        };
      default:
        return {
          label: "Pending",
          className: "bg-amber-100 text-amber-700 border border-amber-200",
          icon: (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const handleViewDetail = (form) => {
    setSelectedForm(form);
    setIsDetailView(true);
  };

  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedForm(null);
  };

  const renderDetailView = () => {
    if (!selectedForm) return null;

    const { label, className, icon } = getStatusInfo(selectedForm.status);

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header with back button */}
        <div className="bg-gradient-to-r from-amber-50 to-white py-3 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={handleBackToList}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h2 className="ml-2 text-lg font-bold text-gray-800">
              Donation Request Details
            </h2>
            <span
              className={`${className} ml-auto text-xs px-2.5 py-1 rounded-full font-medium flex items-center`}
            >
              {icon}
              {label}
            </span>
          </div>
        </div>

        <div className="p-4">
          {/* Main content */}
          <div className="flex flex-col md:flex-row gap-5">
            {/* Image section */}
            <div className="md:w-1/3">
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 h-56 flex items-center justify-center">
                {selectedForm.imageDonateForm ? (
                  <img
                    src={selectedForm.imageDonateForm}
                    alt={selectedForm.itemName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-xs text-gray-500">
                      Image not available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Details section */}
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {selectedForm.itemName}
              </h3>

              <div className="flex flex-wrap gap-3 mb-4">
                <div className="inline-flex items-center bg-gray-50 rounded-lg py-1.5 px-3">
                  <svg
                    className="w-4 h-4 text-amber-500 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">
                    {formatDate(selectedForm.createdAt)}
                  </span>
                </div>

                <div className="inline-flex items-center bg-gray-50 rounded-lg py-1.5 px-3">
                  <svg
                    className="w-4 h-4 text-amber-500 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">
                    {selectedForm.quantity} item(s)
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Description
                </h4>
                <div className="bg-gray-50 rounded-lg py-2.5 px-3 border border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {selectedForm.itemDescription}
                  </p>
                </div>
              </div>

              {selectedForm.status === "Rejected" &&
                selectedForm.rejectionReason && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Rejection Reason
                    </h4>
                    <div className="bg-red-50 rounded-lg py-2.5 px-3 border border-red-100 text-red-700">
                      <p className="text-sm">{selectedForm.rejectionReason}</p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      );
    }

    if (filteredForms.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <svg
              className="w-8 h-8 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No requests found
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            No donation requests match the current filter
          </p>

          <button
            onClick={() => setStatusFilter("All")}
            className="px-4 py-1.5 bg-amber-600 text-white text-sm rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            View all requests
          </button>
        </div>
      );
    }

    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => {
          const { label, className, icon } = getStatusInfo(form.status);

          return (
            <div
              key={form.donationFormId}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow border border-gray-100 group h-full flex flex-col"
            >
              {/* Image thumbnail */}
              <div className="h-40 bg-gray-50 border-b border-gray-100 overflow-hidden relative">
                {form.imageDonateForm ? (
                  <img
                    src={form.imageDonateForm}
                    alt={form.itemName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 ${className} text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center`}
                >
                  {icon}
                  {label}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-auto">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {form.itemName}
                  </h3>
                  <div className="flex items-center text-gray-500 text-xs mb-2">
                    <svg
                      className="w-3.5 h-3.5 mr-1 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDate(form.createdAt)}</span>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-md p-2 mb-3">
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {form.itemDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-gray-600 bg-amber-50 px-2 py-1 rounded-md">
                    <svg
                      className="w-3.5 h-3.5 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-xs">Qty: {form.quantity}</span>
                  </div>

                  <button
                    onClick={() => handleViewDetail(form)}
                    className="text-xs text-white bg-amber-600 hover:bg-amber-700 px-2.5 py-1 rounded-md font-medium flex items-center transition-colors"
                  >
                    Details
                    <svg
                      className="w-3.5 h-3.5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {!isDetailView ? (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-0.5">
                Donation Requests
              </h1>
              <p className="text-sm text-gray-500">
                Manage your laptop donation requests
              </p>
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full sm:w-44 bg-white border border-gray-300 rounded-md pl-3 pr-9 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent hover:border-amber-300 transition-colors"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Done">Done</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {renderListView()}
        </>
      ) : (
        renderDetailView()
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default LaptopInfo;
