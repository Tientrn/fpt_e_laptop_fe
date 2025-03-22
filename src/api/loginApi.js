import axiosClient from './axiosClient';

const loginApi = {
    // Login
    login: (data) => {
        return axiosClient.post('/Authentication/login', data);
    },

    // Logout
    logout: () => {
        return axiosClient.post('/Authentication/logout');
    }
};

export default loginApi;