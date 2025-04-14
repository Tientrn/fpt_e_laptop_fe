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
        console.log("API received data:", data);
        
        // For FormData, we need to ensure Axios doesn't try to process the data
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        
        // Log all entries for debugging
        console.log("Sending FormData with the following entries:");
        for (let [key, value] of data.entries()) {
            console.log(`${key}: ${value instanceof File ? `File: ${value.name}, size: ${value.size}` : value}`);
        }
        
        return axiosClient.post('/report-damages', data, config);
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