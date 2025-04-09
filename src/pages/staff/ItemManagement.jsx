import React, { useEffect, useState } from "react";
import donateitemsApi from "../../api/donateitemsApi";
import { toast } from "react-toastify";

const ItemManagement = () => {
  const [donateItems, setDonateItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonateItems = async () => {
      try {
        const response = await donateitemsApi.getAllDonateItems();
        if (response.isSuccess) {
          setDonateItems(response.data);
        } else {
          console.error("Failed to fetch donate items");
        }
      } catch (error) {
        console.error("Error fetching donate items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonateItems();
  }, []);

  const handleDelete = (itemId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this item?</p>
        <button onClick={() => confirmDelete(itemId)} className="bg-red-500 text-white px-3 py-1 rounded mt-2">Confirm</button>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const confirmDelete = async (itemId) => {
    try {
      const response = await donateitemsApi.deleteDonateItem(itemId);
      if (response.isSuccess) {
        toast.success("Item deleted successfully");
        setDonateItems(donateItems.filter(item => item.itemId !== itemId));
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center font-bold mb-12">Donate Items Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {donateItems.map((item) => (
            <div key={item.itemId} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <img src={item.itemImage} alt={item.itemName} className="w-full h-48 object-cover" />
              <div className="p-4 bg-gray-50 h-40 flex flex-col justify-between">
                <div>
                  <p className="text-lg font-semibold mb-2">{item.itemName}</p>
                  <p className="text-gray-600 mb-4">Status: {item.status}</p>
                </div>
                <div className="flex justify-between">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(item.itemId)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemManagement;
