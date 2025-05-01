import axiosClient from "./axiosClient";

const donateitemsApi = {
  // Get all donate items
  getAllDonateItems: () => {
    return axiosClient.get("/donate-items");
  },

  // Get donate item by id
  getDonateItemById: (id) => {
    return axiosClient.get(`/donate-items/${id}`);
  },

  // Create new donate item
  createDonateItem: (data) => {
    return axiosClient.post("/donate-items", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update donate item
  updateDonateItem: (id, data) => {
    // Log request details for debugging
    console.log('Updating donate item:', {
      id,
      formData: Array.from(data.entries()).reduce((obj, [key, value]) => {
        obj[key] = value instanceof File ? `File: ${value.name}` : value;
        return obj;
      }, {})
    });

    return axiosClient.put(`/donate-items/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json"
      }
    }).then(response => {
      // Log success response
      console.log('Update successful:', response);
      return response;
    }).catch(error => {
      // Log error details
      console.error('Update failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    });
  },

  // Delete donate item
  deleteDonateItem: (id) => {
    return axiosClient.delete(`/donate-items/${id}`);
  },

  // Get suggested laptops by major
  getSuggestedLaptopsByMajor: (major) => {
    return axiosClient.get(`/donate-items/suggest-laptops`, {
      params: { major }
    });
  }
};

export default donateitemsApi;
