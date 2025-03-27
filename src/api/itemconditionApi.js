import axiosClient from "./axiosClient";

const itemconditionApi = {
    // Get all item conditions
    getAllItemConditions: () => {
        return axiosClient.get('/ItemCondition/get-all');
    },

    // Get item condition by id
    getItemConditionById: (id) => {
        return axiosClient.get(`/ItemCondition/get/${id}`);
    },

    // Create new item condition
    createItemCondition: (data) => {
        return axiosClient.post('/ItemCondition/create', data);
    },

    // Update item condition
    updateItemCondition: (id, data) => {
        return axiosClient.put(`/ItemCondition/update/${id}`, data);
    },

    // Delete item condition
    deleteItemCondition: (id) => {
        return axiosClient.delete(`/ItemCondition/delete/${id}`);
    }
};

export default itemconditionApi; 