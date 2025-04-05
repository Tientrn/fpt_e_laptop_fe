import axiosClient from "./axiosClient";

const productimageApi = {
  // Get all product images
  getAllProductImages: () => {
    return axiosClient.get("/product-images");
  },

  // Get product images by product id
  getProductImagesById: (productId) => {
    return axiosClient.get(`/product-images/${productId}`);
  },

  // Create products
  createProductImage: (id, data) => {
    return axiosClient.post(`/product-images/${id}`, data);
  },
  // Add new product image
  addProductImage: (id, data) => {
    return axiosClient.put(`/product-images/${id}`, data);
  },

  // Delete product image
  deleteProductImage: (id) => {
    return axiosClient.delete(`/product-images/${id}`);
  },
};

export default productimageApi;
