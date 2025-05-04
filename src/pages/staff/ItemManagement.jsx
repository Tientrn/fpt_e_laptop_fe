import { useEffect, useState } from "react";
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
      const response = await donateitemsApi.deleteDonateItem(
        itemToDelete.itemId
      );

      if (response && response.isSuccess) {
        toast.success("Item deleted successfully!");
        setItems(items.filter((item) => item.itemId !== itemToDelete.itemId));
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

  const filteredItems = items.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cpu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-extrabold text-blue-700 flex items-center drop-shadow-lg tracking-tight">
          <FaLaptop className="mr-4 text-4xl text-blue-500" />
          Donated Laptops Management
        </h1>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search laptops..."
            className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm text-lg transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
          <p className="text-2xl text-blue-400 font-semibold">
            No donated laptops found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.itemId}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2 border border-blue-100 group"
            >
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
                <img
                  src={
                    item.itemImage ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={item.itemName}
                  className="w-full h-full object-cover rounded-t-2xl border-b border-blue-100 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow-md border border-white/60 backdrop-blur-sm ${
                    item.status === "Available"
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                      : item.status === "Borrowed"
                      ? "bg-gradient-to-r from-red-400 to-red-600 text-white"
                      : item.status === "Maintenance"
                      ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900"
                      : item.status === "Reserved"
                      ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                      : item.status === "Damaged"
                      ? "bg-gradient-to-r from-red-400 to-red-600 text-white"
                      : item.status === "Retired"
                      ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                      : "bg-red-400 text-white"
                  }`}
                >
                  {item.status || "Available"}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-blue-800 line-clamp-2">
                  {item.itemName}
                </h2>
                <div className="space-y-1 mb-4 text-base">
                  <p className="text-gray-600">
                    <span className="font-semibold text-blue-700">Model:</span>{" "}
                    {item.model || "Not specified"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-blue-700">CPU:</span>{" "}
                    {item.cpu || "Not specified"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-blue-700">RAM:</span>{" "}
                    {item.ram || "Not specified"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-blue-700">
                      Storage:
                    </span>{" "}
                    {item.storage || "Not specified"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-blue-700">
                      Borrowed:
                    </span>{" "}
                    {item.totalBorrowedCount || 0} times
                  </p>
                </div>
                <div className="flex justify-between mt-6 gap-2">
                  <button
                    onClick={() => handleViewDetail(item)}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition duration-300"
                  >
                    <FaEye className="mr-2" /> Details
                  </button>
                  <button
                    onClick={() => navigate(`/staff/edit-item/${item.itemId}`)}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition duration-300 mx-1"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition duration-300"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-blue-200">
            <div className="flex justify-between items-center border-b p-6 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
              <h2 className="text-2xl font-extrabold text-blue-700">
                Laptop Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-blue-400 hover:text-red-500 text-2xl font-bold transition"
              >
                ×
              </button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Images Gallery */}
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="w-full">
                    <img
                      src={
                        selectedItem.itemImage ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={selectedItem.itemName}
                      className="w-full h-[320px] object-contain rounded-xl shadow-lg bg-blue-50 border border-blue-100"
                    />
                  </div>
                  {/* Additional Images */}
                  {additionalImages.length > 0 && (
                    <div className="relative">
                      <div className="flex gap-3 overflow-x-auto py-2 px-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
                        {additionalImages.map((img, index) => (
                          <div key={img.itemImageId} className="flex-shrink-0">
                            <img
                              src={img.imageUrl}
                              alt={`Additional ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border-2 border-blue-200 hover:border-blue-500 transition-all duration-200 cursor-pointer shadow"
                              onClick={() => {
                                setSelectedItem({
                                  ...selectedItem,
                                  itemImage: img.imageUrl,
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4 text-blue-800">
                    {selectedItem.itemName}
                  </h3>
                  <div className="space-y-2 text-base">
                    <p>
                      <span className="font-semibold text-blue-700">
                        Model:
                      </span>{" "}
                      {selectedItem.model || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Condition:
                      </span>{" "}
                      {selectedItem.conditionItem || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Status:
                      </span>{" "}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-md border border-blue-100 ${
                          selectedItem.status === "Available"
                            ? "bg-gradient-to-r from-green-100 to-green-300 text-green-800"
                            : selectedItem.status === "Borrowed"
                            ? "bg-gradient-to-r from-red-100 to-red-300 text-red-800"
                            : selectedItem.status === "Maintenance"
                            ? "bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-800"
                            : selectedItem.status === "Reserved"
                            ? "bg-gradient-to-r from-purple-100 to-purple-300 text-purple-800"
                            : selectedItem.status === "Damaged"
                            ? "bg-gradient-to-r from-red-100 to-red-300 text-red-800"
                            : selectedItem.status === "Retired"
                            ? "bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedItem.status || "Available"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Serial Number:
                      </span>{" "}
                      {selectedItem.serialNumber || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Production Year:
                      </span>{" "}
                      {selectedItem.productionYear || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">CPU:</span>{" "}
                      {selectedItem.cpu || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">RAM:</span>{" "}
                      {selectedItem.ram || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Storage:
                      </span>{" "}
                      {selectedItem.storage || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Graphics Card:
                      </span>{" "}
                      {selectedItem.graphicsCard || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Screen Size:
                      </span>{" "}
                      {selectedItem.screenSize || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Operating System:
                      </span>{" "}
                      {selectedItem.operatingSystem || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Battery:
                      </span>{" "}
                      {selectedItem.battery || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Ports:
                      </span>{" "}
                      {selectedItem.ports || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Color:
                      </span>{" "}
                      {selectedItem.color || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Total Borrowed:
                      </span>{" "}
                      {selectedItem.totalBorrowedCount || 0}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Date Created:
                      </span>{" "}
                      {selectedItem.createdDate
                        ? new Date(
                            selectedItem.createdDate
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">
                        Last Updated:
                      </span>{" "}
                      {selectedItem.updatedDate
                        ? new Date(
                            selectedItem.updatedDate
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition duration-300 shadow"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    navigate(`/staff/edit-item/${selectedItem.itemId}`)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 shadow"
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
          <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl border border-red-200">
            <h3 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <FaTrash className="inline" /> Confirm Delete
            </h3>
            <p className="mb-8 text-gray-700">
              Are you sure you want to delete item{" "}
              <span className="font-semibold text-blue-700">
                {itemToDelete?.itemName}
              </span>
              ?<br />
              <span className="text-red-500 font-medium">
                This action cannot be undone.
              </span>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors shadow"
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
