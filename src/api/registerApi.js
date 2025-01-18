import axiosClient from "./axiosClient";

const registerApi = {
  register: (data) => {
    const url = '/Auth/register';
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default registerApi; 