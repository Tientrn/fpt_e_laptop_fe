import axiosClient from "./axiosClient";

const productImageApi = {
  getProductImageById(productId) {
    const url = `/ProductImages/${productId}`;
    return axiosClient.get(url);
  },
};

export default productImageApi;
