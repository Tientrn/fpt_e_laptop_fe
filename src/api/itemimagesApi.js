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

    // Add new item images
    addItemImage: (itemId, data) => {
        return axiosClient.post('/item-images', data, {
            params: {
                itemId: itemId
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // Update item image
    updateItemImage: (imageId, data) => {
        return axiosClient.put(`/item-images/${imageId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // Delete item image
    deleteItemImage: (id) => {
        // Đảm bảo id là số
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw new Error('Invalid image ID');
        }
        return axiosClient.delete(`/item-images/${numericId}`);
    }
};

export default itemimagesApi; 