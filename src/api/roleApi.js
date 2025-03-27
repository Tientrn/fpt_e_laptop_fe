import axiosClient from "./axiosClient";

const roleApi = {
    // Get all roles
    getAllRoles: () => {
        return axiosClient.get('/Role/get-all');
    },

    // Get role by id
    getRoleById: (id) => {
        return axiosClient.get(`/Role/${id}`);
    },

    // Create new role
    createRole: (data) => {
        return axiosClient.post('/Role/create', data);
    },

    // Update role
    updateRole: (id, data) => {
        return axiosClient.put(`/Role/update/${id}`, data);
    }
};

export default roleApi; 