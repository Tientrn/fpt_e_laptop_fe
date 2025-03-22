import axiosClient from './axiosClient';

const userinfoApi = {
    getUserInfo: () => {
        return axiosClient.get('/Authentication/user-infor');
    }
};

export default userinfoApi; 