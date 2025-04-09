import axiosClient from "./axiosClient";

const userApi = {
  getUserById: (id) => {
    return axiosClient.get(`/User/${id}`);
  },
  getAllUsers: () => {
    return axiosClient.get('/User');
  },
};

export default userApi;
