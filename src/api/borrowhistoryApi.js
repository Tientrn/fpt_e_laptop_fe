import axiosClient from "./axiosClient";

const borrowhistoryApi = {
  // Get all borrow histories
  getAllBorrowHistories: () => {
    return axiosClient.get("/borrow-histories");
  },

  // Get borrow history by id
  getBorrowHistoryById: (id) => {
    return axiosClient.get(`/borrow-histories/${id}`);
  },

  // Create new borrow history
  createBorrowHistory: (data) => {
    return axiosClient.post("/borrow-histories", data);
  },

  // Update borrow history
  updateBorrowHistory: (id, data) => {
    return axiosClient.put(`/borrow-histories/${id}`, data);
  },

  // Delete borrow history
  deleteBorrowHistory: (id) => {
    return axiosClient.delete(`/borrow-histories/${id}`);
  },
};

export default borrowhistoryApi;
