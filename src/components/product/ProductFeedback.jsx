import React, { useEffect, useState } from "react";
import moment from "moment";
import productFeedbackApi from "../../api/productFeedbackApi";
import userApi from "../../api/userApi";
import { FaStar } from "react-icons/fa";

const ProductFeedback = ({ productId, onFeedbacksLoaded }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({});
  const [showAll, setShowAll] = useState(false);
  const visibleFeedbacks = showAll ? feedbacks : feedbacks.slice(0, 2);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await productFeedbackApi.getFeedbackByProductId(
          productId
        );
        const feedbackData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        console.log("Feedback Data:", feedbackData);

        setFeedbacks(feedbackData);

        // Truyền feedbackData lên parent component
        if (onFeedbacksLoaded) {
          onFeedbacksLoaded(feedbackData);
        }

        // Fetch user names for all feedbacks with userId
        for (const feedback of feedbackData) {
          if (feedback.userId) {
            try {
              const userResponse = await userApi.getUserById(feedback.userId);
              console.log("User Response:", userResponse);

              if (
                userResponse.isSuccess &&
                userResponse.data.userId === feedback.userId
              ) {
                setUserNames((prev) => ({
                  ...prev,
                  [feedback.userId]: userResponse.data.fullName,
                }));
              }
            } catch (error) {
              console.error(`Error fetching user ${feedback.userId}:`, error);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setFeedbacks([]);
        if (onFeedbacksLoaded) {
          onFeedbacksLoaded([]); // Truyền mảng rỗng nếu lỗi
        }
        setLoading(false);
      }
    };

    if (productId) {
      fetchFeedbacks();
    }
  }, [productId, onFeedbacksLoaded]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${
          index < rating ? "text-amber-600" : "text-gray-300"
        } w-4 h-4`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="product-feedback bg-white p-6">
      <h2 className="text-lg font-semibold text-black mb-4">
        Product Feedback
      </h2>

      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No feedback available for this product
        </p>
      ) : (
        <div className="space-y-6">
          {visibleFeedbacks.map(
            (feedback, index) => (
              console.log(feedback.createdDate),
              (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {feedback.isAnonymous === true
                          ? "?"
                          : userNames[feedback.userId]?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-black">
                          {feedback.isAnonymous === true
                            ? "Anonymous"
                            : userNames[feedback.userId] ||
                              `User ${feedback.userId}`}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {moment(feedback.createdDate).format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-black text-sm">{feedback.comments}</p>
                </div>
              )
            )
          )}
          {feedbacks.length > 2 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-amber-600 hover:underline"
              >
                {showAll ? "Hide" : "Show more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFeedback;
