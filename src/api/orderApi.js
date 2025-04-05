import axiosClient from './axiosClient';

const orderApis = {

    // Create new order
    createOrder: (data) => {
        return axiosClient.post('/orders', data);
    },

    // Create payment
    createPayment: (data) => {
        return axiosClient.post(`/Payment/create?orderID=${data.orderId}&paymenMethodId=${data.paymentMethod}`);
    },

    // Create payment url
    createPaymentUrl: (data) => {
        return axiosClient.get(`/Payment/${data.paymentId}/payment-url?redirectUrl=${data.redirectUrl}`);
    },

    // Create order detail
    createOrderDetail: (data) => {
        return axiosClient.post('/orderdetails', data);
    },
};

export default orderApis; 