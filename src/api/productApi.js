import axiosClient from "./axiosClient";

const productApi = {
  // Get all products
  getAllProducts: () => {
    return axiosClient.get("/products");
  },

  // Get product by id
  getProductById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },
};

export default productApi;
