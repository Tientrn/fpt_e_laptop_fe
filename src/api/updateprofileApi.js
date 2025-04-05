import axiosClient from "./axiosClient";

const updateProfileApi = {
  updateProfile: (data) => {
    const url = "/api/Authentication/update-profile";
    return axiosClient.put(url, {
      dob: data.dob || "",
      address: data.address || "",
      phoneNumber: data.phoneNumber || "",
      gender: data.gender || "",
      avatar: data.avatar || null
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};

export default updateProfileApi;
