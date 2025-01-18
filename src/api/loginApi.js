import axiosClient from './axiosClient';

const loginApi = {
    login: (data) => {
        return axiosClient.post('/Auth/login', data);
    },
    // Có thể thêm các API auth khác như:
    // register: (data) => axiosClient.post('/Auth/register', data),
    // forgotPassword: (email) => axiosClient.post('/Auth/forgot-password', { email }),
    // etc.
};

export default loginApi;