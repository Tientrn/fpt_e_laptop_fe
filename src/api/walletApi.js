import axiosClient from './axiosClient';

const walletApi = {
    getWallet   : () => {
        return axiosClient.get('/Wallet/get');
    }
};

export default walletApi; 