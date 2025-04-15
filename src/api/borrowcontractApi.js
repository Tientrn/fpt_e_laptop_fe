import axiosClient from "./axiosClient";

const borrowcontractApi = {
    // Get all borrow contracts
    getAllBorrowContracts: () => {
        const url = '/BorrowContract/get-all';
        return axiosClient.get(url);
    },

    // Get borrow contract by id
    getBorrowContractById: (id) => {
        const url = `/BorrowContract/get-by-id/${id}`;
        return axiosClient.get(url);
    },
    
    // Get borrow contract by request id
    getBorrowContractByRequestId: (requestId) => {
        const url = `/BorrowContract/get-by-request-id/${requestId}`;
        return axiosClient.get(url);
    },

    // Create borrow contract
    createBorrowContract: (data) => {
        const url = '/BorrowContract/create';
        return axiosClient.post(url, data);
    },

    // Update borrow contract
    updateBorrowContract: (data) => {
        const url = '/BorrowContract/update';
        return axiosClient.put(url, data);
    },

    // Delete borrow contract
    deleteBorrowContract: (id) => {
        const url = `/BorrowContract/delete/${id}`;
        return axiosClient.delete(url);
    },

    // Upload contract image
    uploadContractImage: (formData) => {
        const url = '/contract-images';
        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default borrowcontractApi; 