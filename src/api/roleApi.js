import axiosClient from "./axiosClient";

const roleApi = {
  getAllRoles() {
    const url = '/Roles';
    return axiosClient.get(url);
  },
  
  getRoleById(roleId) {
    const url = `/Roles/${roleId}`;
    return axiosClient.get(url).then(response => {
      // API trả về array với 1 phần tử, lấy phần tử đầu tiên
      return Array.isArray(response) ? response[0] : response;
    });
  }
};

export default roleApi; 