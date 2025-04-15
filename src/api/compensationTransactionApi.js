import axiosClient from "./axiosClient";

const compensationTransactionApi = {
  /**
   * Get all compensation transactions
   * @returns {Promise<Object>} Response containing transaction data
   */
  getAllCompensationTransactions: async () => {
    try {
      const response = await axiosClient.get("/compensation-transactions");
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "Failed to fetch compensation transactions"
      };
    }
  },

  /**
   * Get compensation transaction by ID
   * @param {number} id - Compensation transaction ID
   * @returns {Promise<Object>} Response containing transaction data
   */
  getCompensationTransactionById: async (id) => {
    try {
      const response = await axiosClient.get(`/compensation-transactions/${id}`);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "Failed to fetch compensation transaction"
      };
    }
  },

  /**
   * Create a new compensation transaction
   * @param {Object} transactionData - Data for the new transaction
   * @returns {Promise<Object>} Response containing transaction data
   */
  createCompensationTransaction: async (transactionData) => {
    try {
      console.log("Sending compensation data:", transactionData);
      
      // Ensure data is exactly in the format expected by the server
      const formattedData = {
        contractId: transactionData.contractId || 0,
        userId: transactionData.userId || 0,
        reportDamageId: transactionData.reportDamageId || 0,
        depositTransactionId: transactionData.depositTransactionId || 0,
        compensationAmount: transactionData.compensationAmount || 0,
        usedDepositAmount: transactionData.usedDepositAmount || 0,
        extraPaymentRequired: transactionData.extraPaymentRequired || 0,
        status: transactionData.status || "Pending"
      };
      
      console.log("Formatted compensation data:", formattedData);
      
      const response = await axiosClient.post("/compensation-transactions", formattedData);
      console.log("Compensation API response:", response);
      
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      console.error("Compensation API error:", error.response || error);
      
      // Return the exact error from the server for better debugging
      if (error.response && error.response.data) {
        return error.response.data;
      }
      
      return {
        isSuccess: false,
        message: error.response?.data?.message || "Failed to create compensation transaction"
      };
    }
  },

  /**
   * Update an existing compensation transaction
   * @param {number} id - Compensation transaction ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Response containing transaction data
   */
  updateCompensationTransaction: async (id, updateData) => {
    try {
      const response = await axiosClient.put(`/compensation-transactions/${id}`, updateData);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "Failed to update compensation transaction"
      };
    }
  }
};

export default compensationTransactionApi; 