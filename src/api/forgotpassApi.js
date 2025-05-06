import axiosClient from "./axiosClient";

const forgotpassApi = {
  forgotPassword: (email) => {
    return axiosClient.post("/Authentication/forgot-password", { email });
  },
};

export default forgotpassApi;
