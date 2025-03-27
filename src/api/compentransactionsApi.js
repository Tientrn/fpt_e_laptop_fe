import axiosClient from "./axiosClient";

const compentransactionsApi = {
    // Get all compensation transactions
    getAllCompenTransactions: () => {
        return axiosClient.get('/compensation-transactions');
    },

    // Get compensation transaction by id
    getCompenTransactionById: (id) => {
        return axiosClient.get(`/compensation-transactions/${id}`);
    },

    // Create new compensation transaction
    createCompenTransaction: (data) => {
        return axiosClient.post('/compensation-transactions', data);
    },

    // Update compensation transaction
    updateCompenTransaction: (id, data) => {
        return axiosClient.put(`/compensation-transactions/${id}`, data);
    },

    // Delete compensation transaction
    deleteCompenTransaction: (id) => {
        return axiosClient.delete(`/compensation-transactions/${id}`);
    }
};

export default compentransactionsApi; 