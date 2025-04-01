import axiosClient from "./axiosClient";

const borrowcontractApi = {
    // Get all borrow contracts
    getAllBorrowContracts: () => {
        return axiosClient.get('/BorrowContract/get-all');
    },

    // Get borrow contract by id
    getBorrowContractById: (id) => {
        return axiosClient.get(`/BorrowContract/get/${id}`);
    },
    
    // Create borrow contract
    createBorrowContract: (data) => {
        return axiosClient.post('/BorrowContract/create', data);
    },

    // Update borrow contract
    updateBorrowContract: (id, data) => {
        return axiosClient.put(`/BorrowContract/update/${id}`, data);
    },

    // Delete borrow contract
    deleteBorrowContract: (id) => {
        return axiosClient.delete(`/BorrowContract/delete/${id}`);
    }
};

export default borrowcontractApi; 