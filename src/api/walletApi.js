import axiosClient from './axiosClient';

const walletApi = {
    getWallet   : () => {
        return axiosClient.get('/Wallet/get');
    },

    createWallet : (type) => {
        return axiosClient.post('/Wallet/create', { type });
    }
};

export default walletApi; 