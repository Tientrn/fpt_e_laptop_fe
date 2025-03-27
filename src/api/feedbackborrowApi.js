import axiosClient from "./axiosClient";

const feedbackborrowApi = {
    // Get all feedback borrows
    getAllFeedbackBorrows: () => {
        return axiosClient.get('/FeedbackBorrow/get-all');
    },

    // Get feedback borrow by id
    getFeedbackBorrowById: (id) => {
        return axiosClient.get(`/FeedbackBorrow/get/${id}`);
    },

    // Create new feedback borrow
    createFeedbackBorrow: (data) => {
        return axiosClient.post('/FeedbackBorrow/create', data);
    },

    // Update feedback borrow
    updateFeedbackBorrow: (id, data) => {
        return axiosClient.put(`/FeedbackBorrow/update/${id}`, data);
    },

    // Delete feedback borrow
    deleteFeedbackBorrow: (id) => {
        return axiosClient.delete(`/FeedbackBorrow/delete/${id}`);
    }
};

export default feedbackborrowApi; 