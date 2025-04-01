import axiosClient from "./axiosClient";

const userApi = {
  getUserById: (id) => {
    return axiosClient.get(`/User/${id}`);
  },
};

export default userApi;
