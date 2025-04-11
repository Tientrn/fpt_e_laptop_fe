import axiosClient from "./axiosClient";

const deposittransactionApi = {
  // Get all deposit transactions
  getAllDepositTransactions: () => {
    return axiosClient.get("/deposit-transactions");
  },

  // Get deposit transaction by id
  getDepositTransactionById: (id) => {
    return axiosClient.get(`/deposit-transactions/${id}`);
  },

  // Create new deposit transaction
  createDepositTransaction: (data) => {
    const token = localStorage.getItem("token");
    return axiosClient.post("/deposit-transactions", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update deposit transaction
  updateDepositTransaction: (id, data) => {
    return axiosClient.put(`/deposit-transactions/${id}`, data);
  },

  // Delete deposit transaction
  deleteDepositTransaction: (id) => {
    return axiosClient.delete(`/deposit-transactions/${id}`);
  },
};

export default deposittransactionApi;
