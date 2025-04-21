import axiosClient from "./axiosClient";

const statisticSponerUserApi = {
  getTopSponsor: () => {
    return axiosClient.get("/sponsor-funds/top-sponsors");
  },

  getTopDonor: () => {
    return axiosClient.get("/donate-items/top-donors");
  },

  getTransactionHistory: () => {
    return axiosClient.get("/TransactionLog/get-all");
  },
};

export default statisticSponerUserApi;
