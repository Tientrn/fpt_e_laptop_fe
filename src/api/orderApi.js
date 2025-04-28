import axiosClient from "./axiosClient";

const orderApis = {
  // Get all orders

  getAllOrders: () => {
    return axiosClient.get("/orders");
  },
  // Get orders by id
  getOrderById: (id) => {
    return axiosClient.get(`/orders/${id}`);
  },
  // Create new order
  createOrder: (data) => {
    return axiosClient.post("/orders", data);
  },

  // Create payment
  createPayment: (data) => {
    return axiosClient.post(
      `/Payment/create?orderID=${data.orderId}&paymenMethodId=${data.paymentMethod}`
    );
  },

  // Create payment url
  createPaymentUrl: (data) => {
    return axiosClient.get(
      `/Payment/${data.paymentId}/payment-url?redirectUrl=${encodeURIComponent(data.redirectUrl)}`
    );
  },

  getPayment: (id) => {
    return axiosClient.get(`/Payment/${id}`);
  },

  getAllPayments: () => {
    return axiosClient.get(`/Payment/get-all`);
  },

  updatePayment: (id, data) => {
    return axiosClient.put(`/Payment/update/${id}`, data);
  },

  // Create order detail
  createOrderDetail: (data) => {
    return axiosClient.post("/orderdetails", data);
  },

  // Get order detail
  getAllOrderDetail: () => {
    return axiosClient.get("/orderdetails");
  },
  deleteOrder: (id) => {
    return axiosClient.delete(`/orders/${id}`);
  },

  deleteOrderDetail: (id) => {
    return axiosClient.delete(`/orderdetails/${id}`);
  },
};

export default orderApis;
