import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import shopApi from "../../api/shopApi";
import { FaEdit, FaTrash, FaStore, FaPlus } from "react-icons/fa";

const ShopManager = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [editForm, setEditForm] = useState({
    shopName: "",
    shopAddress: "",
    shopPhone: "",
    businessLicense: "",
    bankName: "",
    bankNumber: "",
    status: "",
  });

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await shopApi.getAllShops();
      setShops(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shops:", error);
      toast.error("Không thể tải danh sách shops");
      setLoading(false);
    }
  };

  const handleEditClick = (shop) => {
    setSelectedShop(shop);
    setEditForm({
      shopName: shop.shopName,
      shopAddress: shop.shopAddress,
      shopPhone: shop.shopPhone,
      businessLicense: shop.businessLicense,
      bankName: shop.bankName,
      bankNumber: shop.bankNumber,
      status: shop.status,
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await shopApi.updateShop(selectedShop.shopId, editForm);
      toast.success("Cập nhật thông tin shop thành công!");
      setIsEditing(false);
      fetchShops(); // Refresh danh sách shops
    } catch (error) {
      console.error("Error updating shop:", error);
      toast.error("Lỗi khi cập nhật thông tin shop");
    }
  };

  const handleDeleteClick = (shop) => {
    setSelectedShop(shop);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await shopApi.deleteShop(selectedShop.shopId);
      toast.success("Shop deleted successfully!");
      setIsDeleting(false);
      fetchShops();
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast.error("Failed to delete shop");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f5f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d5a80]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f8f5f2] min-h-screen relative">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#3d5a80] rounded-lg">
            <FaStore className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#3d5a80]">Shop Management</h1>
        </div>
        <p className="text-[#293241]/70 ml-11">
          Manage and monitor shop partners
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-[#293241] text-sm font-medium">Total Shops</h3>
          <p className="text-2xl font-bold text-[#3d5a80]">{shops.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-[#293241] text-sm font-medium">Active Shops</h3>
          <p className="text-2xl font-bold text-[#3d5a80]">
            {shops.filter((shop) => shop.status === "Active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-[#293241] text-sm font-medium">Inactive Shops</h3>
          <p className="text-2xl font-bold text-[#ee6c4d]">
            {shops.filter((shop) => shop.status !== "Active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-[#293241] text-sm font-medium">Newest Shop</h3>
          <p className="text-xl font-bold text-[#3d5a80] truncate">
            {shops.length > 0
              ? shops.sort(
                  (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                )[0].shopName
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#3d5a80] to-[#98c1d9] text-white">
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Shop Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shops.map((shop) => (
                <tr
                  key={shop.shopId}
                  className="text-sm hover:bg-[#e0fbfc] transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#293241]">
                    {shop.shopId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#98c1d9]/30 flex items-center justify-center text-[#3d5a80]">
                        <FaStore />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-[#293241]">
                          {shop.shopName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#293241]">
                    {shop.shopAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#293241]">
                    {shop.shopPhone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#293241]">
                    {formatDate(shop.createdDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        shop.status.toLowerCase() === "active"
                          ? "bg-[#98c1d9] text-[#3d5a80]"
                          : "bg-[#ee6c4d] text-white"
                      }`}
                    >
                      {shop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditClick(shop)}
                        className="p-1.5 bg-[#3d5a80]/10 text-[#3d5a80] rounded-md hover:bg-[#3d5a80]/20 transition-colors"
                        title="Edit shop"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(shop)}
                        className="p-1.5 bg-[#ee6c4d]/10 text-[#ee6c4d] rounded-md hover:bg-[#ee6c4d]/20 transition-colors"
                        title="Delete shop"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shop Button */}
      <button
        className="fixed bottom-8 right-8 p-4 bg-[#3d5a80] text-white rounded-full shadow-lg hover:bg-[#3d5a80]/90 transition-colors"
        title="Add new shop"
      >
        <FaPlus />
      </button>

      {/* Modal Edit Shop */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-[#3d5a80] flex items-center gap-2">
              <FaEdit /> Edit Shop Information
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-[#293241]">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={editForm.shopName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3d5a80] focus:ring-[#3d5a80] text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-[#293241]">
                    Shop Address
                  </label>
                  <input
                    type="text"
                    name="shopAddress"
                    value={editForm.shopAddress}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3d5a80] focus:ring-[#3d5a80] text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-[#293241]">
                    Shop Phone
                  </label>
                  <input
                    type="text"
                    name="shopPhone"
                    value={editForm.shopPhone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3d5a80] focus:ring-[#3d5a80] text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-[#293241]">
                    Business License
                  </label>
                  <input
                    type="text"
                    name="businessLicense"
                    value={editForm.businessLicense}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3d5a80] focus:ring-[#3d5a80] text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-[#293241]">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={editForm.bankName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3d5a80] focus:ring-[#3d5a80] text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-[#293241]">
                    Bank Number
                  </label>
                  <input
                    type="text"
                    name="bankNumber"
                    value={editForm.bankNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3d5a80] focus:ring-[#3d5a80] text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-[#293241]">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3d5a80] focus:ring-[#3d5a80] text-base"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3d5a80] text-white rounded-md hover:bg-[#3d5a80]/90 transition-colors w-full"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-[#3d5a80] flex items-center gap-2">
              <FaTrash className="text-[#ee6c4d]" /> Confirm Deletion
            </h2>
            <p className="mb-6 text-[#293241]">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedShop?.shopName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-[#ee6c4d] text-white rounded-md hover:bg-[#ee6c4d]/90 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManager;
