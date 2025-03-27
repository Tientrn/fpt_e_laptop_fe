import axiosClient from "./axiosClient";

const registerApi = { 
  // Register general (for non-student)
  register: (data) => {
    return axiosClient.post('/Authentication/register', data);
  },
  
  // Register for student
  registerStudent: (data) => {
    return axiosClient.post('/Authentication/register/student', data);
  },

  // Register for sponsor
  registerSponsor: (data) => {
    return axiosClient.post('/Authentication/register/sponsor', data);
  },

};

export default registerApi; 