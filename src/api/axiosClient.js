import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://fptsharelaptop.io.vn/api",
  timeout: 10000,

  withCredentials: false, // Thay đổi thành true nếu cần gửi cookies
});

axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    // Nếu có token, thêm vào header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Log request để debug
    console.log("Request config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    // Log response để debug
    console.log("Response:", response.data);
    // Trả về dữ liệu response
    return response.data;
  },
  (error) => {
    // Xử lý lỗi response
    console.error("Error full details:", error);

    if (error.response) {
      // Server trả về response với status code nằm ngoài range 2xx
      console.error("Response error data:", error.response.data);
      console.error("Response error status:", error.response.status);
      console.error("Response error headers:", error.response.headers);

      // Xử lý lỗi 401 Unauthorized
      if (error.response.status === 401) {
        // Redirect to login page or refresh token
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response
      console.error("Request error:", error.request);
      return Promise.reject({
        message: "No response from server. Please check your connection.",
      });
    } else {
      // Có lỗi khi setting up request
      console.error("Error message:", error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default axiosClient;
