import axiosClient from "./axiosClient";

const statisticSponerUserApi = {
  getTopSponsor: () => {
    return axiosClient.get("/sponsor-funds/top-sponsors");
  },

  getTopDonor: () => {
    return axiosClient.get("/donate-items/top-donors");
  },
};

export default statisticSponerUserApi;
