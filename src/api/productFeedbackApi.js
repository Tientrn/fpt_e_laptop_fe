import axiosClient from "./axiosClient";

const productFeedbackApi = {
  // Get feedback by product id
  getFeedbackByProductId: (id) => {
    return axiosClient.get(`/feedback-products/by-product/${id}`);
  },
};

export default productFeedbackApi;
