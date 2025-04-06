import axiosClient from "./axiosClient";

const registerApi = {
  // Register general (for non-student)
  register: (data) => {
    return axiosClient.post("/Authentication/register", data);
  },

  // Register for student
  registerStudent: (data) => {
    return axiosClient.post("/Authentication/register/student", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default registerApi;
