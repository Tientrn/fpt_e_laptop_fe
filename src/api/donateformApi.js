import axiosClient from "./axiosClient";

const donateformApi = {
  // Get all donate forms
  getAllDonateForms: () => {
    return axiosClient.get("/DonateForm/all");
  },

  // Get donate form by id
  getDonateFormById: (id) => {
    return axiosClient.get(`/DonateForm/${id}`);
  },

  // Create new donate form
  createDonateForm: (data) => {
    return axiosClient.post("/DonateForm/create", data);
  },

  // Update donate form
  updateDonateForm: (id, data) => {
    return axiosClient.put(`/DonateForm/update/${id}`, data);
  },

  // Delete donate form
  deleteDonateForm: (id) => {
    return axiosClient.delete(`/DonateForm/delete/${id}`);
  },
};

export default donateformApi;
