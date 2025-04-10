import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import donateitemsApi from "../../api/donateitemsApi";
import { FaLaptop } from "react-icons/fa";

const EditDonateItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    itemId: "",
    itemName: "",
    cpu: "",
    ram: "",
    storage: "",
    screenSize: "",
    conditionItem: "",
    totalBorrowedCount: 0,
    status: ""
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await donateitemsApi.getDonateItemById(itemId);
        if (response.isSuccess) {
          setItem(response.data);
        } else {
          toast.error("Failed to fetch item details");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Error loading item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('ItemId', item.itemId);
      formData.append('ItemName', item.itemName);
      formData.append('Cpu', item.cpu);
      formData.append('Ram', item.ram);
      formData.append('Storage', item.storage);
      formData.append('ScreenSize', item.screenSize);
      formData.append('ConditionItem', item.conditionItem);
      formData.append('TotalBorrowedCount', item.totalBorrowedCount);
      formData.append('Status', item.status);

      const response = await donateitemsApi.updateDonateItem(itemId, formData);
      if (response.isSuccess) {
        toast.success("Item updated successfully!");
        navigate("/staff/items");
      } else {
        toast.error(response?.message || "Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <FaLaptop className="mr-3 text-blue-600" />
          Edit Donated Laptop
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Laptop Name
              </label>
              <input
                type="text"
                name="itemName"
                value={item.itemName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                CPU
              </label>
              <input
                type="text"
                name="cpu"
                value={item.cpu}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                RAM
              </label>
              <input
                type="text"
                name="ram"
                value={item.ram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Storage
              </label>
              <input
                type="text"
                name="storage"
                value={item.storage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Screen Size
              </label>
              <input
                type="text"
                name="screenSize"
                value={item.screenSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Condition
              </label>
              <input
                type="text"
                name="conditionItem"
                value={item.conditionItem}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={item.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/staff/items")}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonateItem; 