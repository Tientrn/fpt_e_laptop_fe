import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FaStar, FaUser, FaEnvelope, FaPhone, FaLaptop, FaCalendarAlt, FaComments } from "react-icons/fa";
import borrowrequestApi from "../../api/borrowrequestApi";
import feedbackborrowApi from "../../api/feedbackborrowApi";

const BorrowHistoryDetail = () => {
  const { borrowHistoryId, id } = useParams();
  const navigate = useNavigate();
  const [borrowHistory, setBorrowHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({
    borrowHistoryId: 0,
    itemId: 0,
    rating: 0,
    comments: "",
  });
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchBorrowHistoryDetail = async () => {
      try {
        setLoading(true);
        const response = await borrowrequestApi.getBorrowRequestById(id);
        if (response?.data) {
          setBorrowHistory(response.data);
        } else {
          toast.info("Borrow history details not found");
        }
      } catch (error) {
        console.error("Error loading borrow history details:", error);
        toast.error("Error loading borrow history details");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistoryDetail();
  }, [id]);

  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate);
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating) => {
    setFeedback((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmitFeedback = async () => {
    try {
      const feedbackData = {
        borrowHistoryId,
        itemId: borrowHistory.itemId,
        rating: feedback.rating,
        comments: feedback.comments,
      };

      const response = await feedbackborrowApi.createFeedbackBorrow(
        feedbackData
      );
      if (response?.data) {
        setIsFeedbackSubmitted(true);
        toast.success("Thank you for your feedback!");
      } else {
        toast.error("Error submitting feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-3 text-indigo-600 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!borrowHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-indigo-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Details Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't find the borrow history details you're looking for.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">
              Borrow History Details
            </h1>
            <p className="text-indigo-100 mt-1">
              View the details of your laptop borrowing history
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Product Information */}
            <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <FaLaptop className="text-indigo-600 w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Product Information
                  </h2>
                  <p className="text-indigo-600 font-medium">{borrowHistory.itemName}</p>
                </div>
              </div>
            </div>

            {/* Borrowing Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="text-indigo-600 w-4 h-4 mr-2" />
                  <p className="text-gray-500 font-medium">Borrow Date</p>
                </div>
                <p className="text-lg text-gray-800 ml-6">
                  {isValidDate(borrowHistory.startDate)
                    ? format(new Date(borrowHistory.startDate), "dd/MM/yyyy")
                    : "Invalid date"}
                </p>
              </div>
              <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="text-purple-600 w-4 h-4 mr-2" />
                  <p className="text-gray-500 font-medium">Return Date</p>
                </div>
                <p className="text-lg text-gray-800 ml-6">
                  {isValidDate(borrowHistory.endDate)
                    ? format(new Date(borrowHistory.endDate), "dd/MM/yyyy")
                    : "Invalid date"}
                </p>
              </div>
            </div>

            {/* Borrower Information */}
            <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="text-indigo-600 w-5 h-5 mr-2" />
                Borrower Information
              </h3>
              <div className="space-y-4 ml-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <FaUser className="text-indigo-600 w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-800 font-medium">{borrowHistory.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <FaEnvelope className="text-indigo-600 w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">{borrowHistory.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <FaPhone className="text-indigo-600 w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800 font-medium">{borrowHistory.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Submission */}
            {borrowHistory.status === "Approved" && !isFeedbackSubmitted && (
              <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaComments className="text-indigo-600 w-5 h-5 mr-2" />
                  Your Feedback
                </h3>

                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2 font-medium">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                          feedback.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } hover:scale-110`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2 font-medium">
                    Comments
                  </label>
                  <textarea
                    name="comments"
                    value={feedback.comments}
                    onChange={handleFeedbackChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Share your experience with this laptop..."
                  ></textarea>
                </div>

                <div>
                  <button
                    onClick={handleSubmitFeedback}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium flex items-center justify-center"
                  >
                    <FaStar className="mr-2" />
                    Submit Feedback
                  </button>
                </div>
              </div>
            )}

            {isFeedbackSubmitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-700 font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Thank you for your feedback!
              </div>
            )}

            {/* Back Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-6 py-2.5 border border-indigo-600 text-indigo-600 rounded-lg transition duration-200 hover:bg-indigo-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistoryDetail;
