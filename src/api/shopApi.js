import axiosClient from "./axiosClient";

const shopApi = {
  // Get all shop
  getAllShops: () => {
    return axiosClient.get("/shops");
  },

  // Get shop by id
  getShopById: (id) => {
    return axiosClient.get(`/shops/${id}`);
  },

  // Create new shop
  createShop: (data) => {
    return axiosClient.post("/shops", data);
  },

  // Update shop
  updateShop: (id, data) => {
    return axiosClient.put(`/shops/${id}`, data);
  },

  // Delete shop
  deleteShop: (id) => {
    return axiosClient.delete(`/shops/${id}`);
  },
};

export default shopApi;
