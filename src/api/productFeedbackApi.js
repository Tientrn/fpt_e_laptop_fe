import axiosClient from "./axiosClient";

const productFeedbackApi = {
  // Get feedback by product id
  getFeedbackByProductId: (id) => {
    return axiosClient.get(`/feedback-products/by-product/${id}`);
  },
  // Create feedback product
  createFeedbackProduct: (data) => {
    return axiosClient.post("/feedback-products", data);
  },
};

export default productFeedbackApi;
