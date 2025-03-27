import axiosClient from "./axiosClient";

const reportdamagesApi = {
    // Get all report damages
    getAllReportDamages: () => {
        return axiosClient.get('/report-damages');
    },

    // Get report damage by id
    getReportDamageById: (id) => {
        return axiosClient.get(`/report-damages/${id}`);
    },

    // Create new report damage
    createReportDamage: (data) => {
        return axiosClient.post('/report-damages', data);
    },

    // Update report damage
    updateReportDamage: (id, data) => {
        return axiosClient.put(`/report-damages/${id}`, data);
    },

    // Delete report damage
    deleteReportDamage: (id) => {
        return axiosClient.delete(`/report-damages/${id}`);
    }
};

export default reportdamagesApi; 