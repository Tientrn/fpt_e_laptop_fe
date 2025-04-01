import React, { useEffect, useState } from "react";
import moment from "moment";
import productFeedbackApi from "../../api/productFeedbackApi";
import userApi from "../../api/userApi";
import { FaStar } from "react-icons/fa";

const ProductFeedback = ({ productId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({});

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
        setLoading(false);
      }
    };

    if (productId) {
      fetchFeedbacks();
    }
  }, [productId]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${
          index < rating ? "text-yellow-400" : "text-gray-300"
        } w-5 h-5`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="product-feedback bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Đánh giá sản phẩm</h2>

      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Chưa có đánh giá nào cho sản phẩm này
        </p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((feedback, index) => (
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
                    <h3 className="font-medium text-gray-800">
                      {feedback.isAnonymous === true
                        ? "Ẩn danh"
                        : userNames[feedback.userId] ||
                          `Người dùng ${feedback.userId}`}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {moment(feedback.createdDate).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(feedback.rating)}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-gray-600">{feedback.comments}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductFeedback;
