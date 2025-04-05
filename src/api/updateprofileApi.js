import axiosClient from "./axiosClient";

const updateProfileApi = {
  updateProfile: (data) => {
    const token = localStorage.getItem("token");
    return axiosClient.put("/Authentication/update-profile", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default updateProfileApi;
