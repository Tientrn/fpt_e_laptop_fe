import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://testapi1.somee.com/api", // Thay thế bằng URL API của bạn
  timeout: 10000, // Thời gian chờ request
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  }, // Chỉ lấy dữ liệu cần thiết từ response
  (error) => {
    // Xử lý lỗi chung, ví dụ: làm mới token hoặc thông báo lỗi

    return Promise.reject(error);
  }
);

export default axiosClient;
