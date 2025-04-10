import axiosClient from "./axiosClient";

const donateitemsApi = {
  // Get all donate items
  getAllDonateItems: () => {
    return axiosClient.get("/donate-items");
  },

  // Get donate item by id
  getDonateItemById: (id) => {
    return axiosClient.get(`/donate-items/${id}`);
  },

  // Create new donate item
  createDonateItem: (data) => {
    return axiosClient.post("/donate-items", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update donate item
  updateDonateItem: (id, data) => {
    return axiosClient.put(`/donate-items/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete donate item
  deleteDonateItem: (id) => {
    return axiosClient.delete(`/donate-items/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default donateitemsApi;
