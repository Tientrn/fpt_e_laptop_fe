import axiosClient from "./axiosClient";

const changepassApi = {
  changePassword: (data, token) => {
    return axiosClient.post("/Authentication/change-password", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default changepassApi;
