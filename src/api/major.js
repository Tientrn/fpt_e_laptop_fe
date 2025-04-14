import axiosClient from "./axiosClient";

const majorApi = {
  // Get all borrow requests
  getAllMajor: () => {
    return axiosClient.get("/majors");
  },

 
};

export default majorApi;
