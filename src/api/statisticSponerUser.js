import axiosClient from "./axiosClient";

const statisticSponerUserApi = {
  getTopSponsor: () => {
    return axiosClient.get("/sponsor-funds/top-sponsor");
  },


};

export default statisticSponerUserApi;
