import axiosClient from './axiosClient';

const changepassApi = {
    changePassword: (data) => {
        return axiosClient.post('/Authentication/change-password', data);
    }
};

export default changepassApi; 