import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://fptsharelaptopsp.somee.com/api", 
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  }, 
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        default:
          console.error('API Error:', error.response.data);
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
