import axiosClient from "./axiosClient";

const categoryApi = {
    // Get all categories
    getAllCategories: () => {
        return axiosClient.get('/categories');
    },

    // Get category by id
    getCategoryById: (id) => {
        return axiosClient.get(`/categories/${id}`);
    },

    // Create new category
    createCategory: (data) => {
        return axiosClient.post('/categories', data);
    },

    // Update category
    updateCategory: (id, data) => {
        return axiosClient.put(`/categories/${id}`, data);
    },

    // Delete category
    deleteCategory: (id) => {
        return axiosClient.delete(`/categories/${id}`);
    }
};

export default categoryApi; 