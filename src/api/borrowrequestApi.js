import axiosClient from "./axiosClient";

const borrowrequestApi = {
  // Get all borrow requests
  getAllBorrowRequests: () => {
    return axiosClient.get("/BorrowRequest/get-all");
  },

  // Get borrow request by id
  getBorrowRequestById: (id) => {
    return axiosClient.get(`/BorrowRequest/get/${id}`);
  },

  // Create new borrow request
  createBorrowRequest: (data) => {
    return axiosClient.post("/BorrowRequest/create", data);
  },

  // Update borrow request
  updateBorrowRequest: (id, data) => {
    const token = localStorage.getItem("token");
    return axiosClient.put(`/BorrowRequest/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete borrow request
  deleteBorrowRequest: (id) => {
    return axiosClient.delete(`/BorrowRequest/delete/${id}`);
  },
};

export default borrowrequestApi;
