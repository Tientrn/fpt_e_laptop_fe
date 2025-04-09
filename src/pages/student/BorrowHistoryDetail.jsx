import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FaStar } from "react-icons/fa";
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
      toast.error("Error submitting feedback");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (!borrowHistory) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <p className="text-gray-500 text-sm">
          Borrow history details not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Borrow History Details
        </h1>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
          {/* Product Information */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-1">
              Product Information
            </h2>
            <p className="text-gray-700 text-base">{borrowHistory.itemName}</p>
          </div>

          {/* Borrowing Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Borrow Date</p>
              <p className="text-base text-black">
                {isValidDate(borrowHistory.startDate)
                  ? format(new Date(borrowHistory.startDate), "dd/MM/yyyy")
                  : "Invalid date"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Return Date</p>
              <p className="text-base text-black">
                {isValidDate(borrowHistory.endDate)
                  ? format(new Date(borrowHistory.endDate), "dd/MM/yyyy")
                  : "Invalid date"}
              </p>
            </div>
          </div>

          {/* Borrower Information */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-2">
              Borrower Information
            </h3>
            <ul className="text-gray-700 space-y-1">
              <li>Name: {borrowHistory.fullName}</li>
              <li>Email: {borrowHistory.email}</li>
              <li>Phone Number: {borrowHistory.phoneNumber}</li>
            </ul>
          </div>

          {/* Feedback Submission */}
          {borrowHistory.status === "Approved" && !isFeedbackSubmitted && (
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Your Feedback
              </h3>

              <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-1">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className={`w-6 h-6 cursor-pointer transition ${
                        feedback.rating >= star
                          ? "text-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Comments
                </label>
                <textarea
                  name="comments"
                  value={feedback.comments}
                  onChange={handleFeedbackChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSubmitFeedback}
                  className="bg-slate-600 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          )}

          {isFeedbackSubmitted && (
            <div className="text-green-600 font-medium">
              Thank you for your feedback!
            </div>
          )}

          {/* Back Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-600 border border-slate-600 px-6 py-2 rounded-lg text-sm hover:bg-slate-600 hover:text-white transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistoryDetail;
