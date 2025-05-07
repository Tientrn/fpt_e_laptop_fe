import axiosClient from './axiosClient';

const walletApi = {
    getWallet   : () => {
        return axiosClient.get('/Wallet/get');
    },

    createWallet : (type) => {
        return axiosClient.post('/Wallet/create', { type });
    },
    
    getTransactions: () => {
        return axiosClient.get('/TransactionLog/get-all');
    },
    
    withdrawMoney: (amount, note) => {
        // Get shopId from localStorage
        const shopId = localStorage.getItem('shopId');

        console.log(shopId)
        
        if (!shopId) {
            return Promise.reject({ message: "Shop ID not found. Please set up your shop profile first." });
        }
        
        return axiosClient.post(`/Wallet/withdraw-shop?shopId=${shopId}&amount=${amount}`, {});
    }
};

export default walletApi; 