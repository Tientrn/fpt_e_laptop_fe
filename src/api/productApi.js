import axiosClient from "./axiosClient";

const productApi = {
  // Get all products
  getAllProducts: () => {
    return axiosClient.get("/products");
  },
  // Create products
  createProduct: (data) => {
    return axiosClient.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  // Get product by id
  getProductById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },
  // Update product by id
  updateProduct: (id, data) => {
    return axiosClient.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  // Delete product by id
  deleteProduct: (id) => {
    return axiosClient.delete(`/products/${id}`);
  },
};

export default productApi;
