import axiosClient from "./axiosClient";

const productApi = {
  getAll(params) {
    const url = "/Products";
    return axiosClient.get(url, { params });
  },
};

export default productApi;
