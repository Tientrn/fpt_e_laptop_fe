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

  // Create new product image
  createProductImage: (id, data) => {
    return axiosClient.post(`/product-images/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Add new product image
  addProductImage: (productId, data) => {
    return axiosClient.post('/product-images', data, {
      params: {
        productId: productId
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete product image
  deleteProductImage: (id) => {
    return axiosClient.delete(`/product-images/${id}`);
  },
};

export default productimageApi;
