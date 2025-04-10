import React, { useEffect, useState } from "react";
import donateitemsApi from "../../api/donateitemsApi";
import itemimagesApi from "../../api/itemimagesApi";
import { toast } from "react-toastify";
import { FaSearch, FaTrash, FaEye, FaLaptop, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await donateitemsApi.getAllDonateItems();
      if (response.isSuccess) {
        setItems(response.data);
      } else {
        toast.error("Failed to fetch donated items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Error loading donated items");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      const response = await donateitemsApi.deleteDonateItem(itemToDelete.itemId);

      if (response && response.isSuccess) {
        toast.success("Item deleted successfully!");
        setItems(items.filter(item => item.itemId !== itemToDelete.itemId));
      } else {
        toast.error(response?.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleViewDetail = async (item) => {
    setSelectedItem(item);
    try {
      const response = await itemimagesApi.getItemImagesById(item.itemId);
      if (response.isSuccess) {
        setAdditionalImages(response.data);
      }
    } catch (error) {
      console.error("Error fetching additional images:", error);
      toast.error("Failed to load additional images");
    }
    setShowDetailModal(true);
  };

  const filteredItems = items.filter(item => 
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cpu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaLaptop className="mr-3 text-blue-600" /> 
          Donated Laptops Management
        </h1>
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search laptops..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-500">No donated laptops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.itemId} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.itemImage || "https://via.placeholder.com/300x200?text=No+Image"} 
                  alt={item.itemName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm">
                  {item.status || "Available"}
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">{item.itemName}</h2>
                <p className="text-gray-600 mb-2"><span className="font-medium">CPU:</span> {item.cpu}</p>
                <p className="text-gray-600 mb-2"><span className="font-medium">RAM:</span> {item.ram}</p>
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => handleViewDetail(item)} 
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition duration-300"
                  >
                    <FaEye className="mr-2" /> Details
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(item)} 
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition duration-300"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-2xl font-bold text-gray-800">Laptop Details</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Images Gallery */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="w-full">
                    <img 
                      src={selectedItem.itemImage || "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={selectedItem.itemName} 
                      className="w-full h-[300px] object-contain rounded-lg shadow-md bg-gray-50"
                    />
                  </div>
                  
                  {/* Additional Images */}
                  {additionalImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {additionalImages.map((img, index) => (
                        <div key={img.itemImageId} className="flex-shrink-0">
                          <img
                            src={img.imageUrl}
                            alt={`Additional ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">{selectedItem.itemName}</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Condition:</span> {selectedItem.conditionItem || "Not specified"}</p>
                    <p><span className="font-medium">Status:</span> {selectedItem.status || "Available"}</p>
                    <p><span className="font-medium">CPU:</span> {selectedItem.cpu || "Not specified"}</p>
                    <p><span className="font-medium">RAM:</span> {selectedItem.ram || "Not specified"}</p>
                    <p><span className="font-medium">Storage:</span> {selectedItem.storage || "Not specified"}</p>
                    <p><span className="font-medium">Screen Size:</span> {selectedItem.screenSize || "Not specified"}</p>
                    <p><span className="font-medium">Total Borrowed:</span> {selectedItem.totalBorrowedCount || 0}</p>
                    <p><span className="font-medium">Date Created:</span> {selectedItem.createdDate ? new Date(selectedItem.createdDate).toLocaleDateString() : "Not specified"}</p>
                    <p><span className="font-medium">Last Updated:</span> {selectedItem.updatedDate ? new Date(selectedItem.updatedDate).toLocaleDateString() : "Not specified"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">                
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-300"
                >
                  Close
                </button>
                <button 
                  onClick={() => navigate(`/staff/edit-item/${selectedItem.itemId}`)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete item {itemToDelete?.itemName}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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

export default ItemManagement;
