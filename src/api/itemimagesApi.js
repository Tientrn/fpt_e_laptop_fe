import axiosClient from './axiosClient';

const itemimagesApi = {
    // Get all images
    getAllItemImages: () => {
        return axiosClient.get('/item-images');
    },

    // Get images by item id
    getItemImagesById: (itemId) => {
        return axiosClient.get(`/item-images/${itemId}`);
    },

    // Add new item image
    addItemImage: (id, data) => {
        return axiosClient.put(`/item-images/${id}`, data);
    },

    // Delete item image
    deleteItemImage: (id) => {
        return axiosClient.delete(`/item-images/${id}`);
    }
};

export default itemimagesApi; 