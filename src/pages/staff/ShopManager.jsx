import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import shopApi from "../../api/shopApi";
import { FaEdit, FaTrash } from "react-icons/fa";

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
    status: ""
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
      status: shop.status
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
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
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Shop Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Shop Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shops.map((shop) => (
              <tr key={shop.shopId} className="text-sm">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500">
                  {shop.shopId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{shop.shopName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shop.shopAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shop.shopPhone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(shop.createdDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    shop.status === "Active" 
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white"
                  }`}>
                    {shop.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                  <button
                    onClick={() => handleEditClick(shop)}
                    className="text-amber-600 hover:text-amber-900 transition-colors"
                    title="Edit shop"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(shop)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Delete shop"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Shop */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Shop Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-700">Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    value={editForm.shopName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="shopAddress"
                    value={editForm.shopAddress}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="shopPhone"
                    value={editForm.shopPhone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Tax Code</label>
                  <input
                    type="text"
                    name="businessLicense"
                    value={editForm.businessLicense}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={editForm.bankName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Bank Account</label>
                  <input
                    type="text"
                    name="bankNumber"
                    value={editForm.bankNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-base"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-base"
                >
                  Save Changes
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
            <h2 className="text-2xl font-bold mb-4">Delete Shop</h2>
            <p className="mb-6">Are you sure you want to delete the shop "{selectedShop?.shopName}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManager; 