import axiosClient from './axiosClient';

const forgotpassApi = {
    forgotPassword: (data) => {
        return axiosClient.post('/Authentication/forgot-password', data);
    }
};

export default forgotpassApi; 