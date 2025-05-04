import React, { useEffect, useState } from "react";
import productApi from "../../api/productApi";
import productimageApi from "../../api/productimageApi";
import { toast } from "react-toastify";
import { FaSearch, FaTrash, FaEye, FaLaptop } from "react-icons/fa";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAllProducts();
      if (response.isSuccess) {
        setProducts(response.data);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);
      const response = await productApi.deleteProduct(
        productToDelete.productId
      );

      if (response && response.isSuccess) {
        toast.success("Product deleted successfully!");
        setProducts(
          products.filter(
            (product) => product.productId !== productToDelete.productId
          )
        );
      } else {
        toast.error(response?.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleViewDetail = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await productimageApi.getProductImagesById(
        product.productId
      );
      if (response.isSuccess) {
        setAdditionalImages(response.data);
      }
    } catch (error) {
      console.error("Error fetching additional images:", error);
      toast.error("Failed to load additional images");
    }
    setShowDetailModal(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.cpu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <FaLaptop className="text-blue-600 w-8 h-8" />
            Product Management
          </h1>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-gray-100">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLaptop className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-2xl text-gray-600 font-medium">
              No products found
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.productId}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden group">
                  <img
                    src={
                      product.imageProduct ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={product.productName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                      product.quantity > 0
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                </div>
                <div className="p-6">
                  <h2
                    className="text-xl font-bold mb-3 text-gray-800 line-clamp-2"
                    style={{ maxHeight: "3rem" }}
                  >
                    {product.productName}
                  </h2>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-700">
                        Price:
                      </span>{" "}
                      <span className="text-blue-600 font-bold">
                        {product.price?.toLocaleString() || 0} đ
                      </span>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-700">
                        Quantity:
                      </span>{" "}
                      <span className="font-medium">
                        {product.quantity || 0}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between gap-3 mt-6">
                    <button
                      onClick={() => handleViewDetail(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                    >
                      <FaEye className="w-5 h-5" /> Details
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                    >
                      <FaTrash className="w-5 h-5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-blue-100 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center shadow">
                    <img
                      src={
                        selectedProduct.imageProduct ||
                        "https://via.placeholder.com/100x100?text=No+Image"
                      }
                      alt="icon"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-blue-700 mb-1">
                      {selectedProduct.productName}
                    </h2>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                      {selectedProduct.categoryName || "No Category"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-blue-600 text-3xl font-bold transition-colors duration-200"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: Image Gallery */}
                <div className="space-y-6">
                  <div className="w-full bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 shadow-lg border border-blue-100 flex items-center justify-center">
                    <img
                      src={
                        selectedProduct.imageProduct ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={selectedProduct.productName}
                      className="w-full h-[260px] object-contain rounded-xl transition-transform duration-300 hover:scale-105 shadow-md border border-blue-200"
                    />
                  </div>
                  {additionalImages.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {additionalImages.map((img, index) => (
                        <img
                          key={img.productImageId}
                          src={img.imageUrl}
                          alt={`Additional ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-xl border-2 border-blue-100 hover:border-blue-400 transition-all duration-200 cursor-pointer hover:shadow-lg"
                          onClick={() => {
                            setSelectedProduct({
                              ...selectedProduct,
                              imageProduct: img.imageUrl,
                            });
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* Right: Info */}
                <div className="flex flex-col gap-6">
                  {/* Price & Quantity */}
                  <div className="flex gap-6 items-center">
                    <div className="bg-blue-50 rounded-xl p-4 flex-1 flex flex-col items-center shadow border border-blue-100">
                      <span className="text-sm text-gray-500 mb-1">Price</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {selectedProduct.price?.toLocaleString() || 0} đ
                      </span>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 flex-1 flex flex-col items-center shadow border border-blue-100">
                      <span className="text-sm text-gray-500 mb-1">
                        Quantity
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        {selectedProduct.quantity || 0}
                      </span>
                    </div>
                  </div>
                  {/* Status */}
                  <div className="flex gap-3 items-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-base font-bold shadow border transition-all duration-200 ${
                        selectedProduct.quantity > 0
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {selectedProduct.quantity > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>
                  {/* Main Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white rounded-xl p-4 border border-blue-50 shadow">
                    <InfoRow label="CPU" value={selectedProduct.cpu} />
                    <InfoRow label="RAM" value={selectedProduct.ram} />
                    <InfoRow label="Storage" value={selectedProduct.storage} />
                    <InfoRow
                      label="Screen Size"
                      value={selectedProduct.screenSize}
                    />
                    <InfoRow label="Model" value={selectedProduct.model} />
                    <InfoRow label="Color" value={selectedProduct.color} />
                    <InfoRow
                      label="Graphics Card"
                      value={selectedProduct.graphicsCard}
                    />
                    <InfoRow label="Battery" value={selectedProduct.battery} />
                    <InfoRow label="Ports" value={selectedProduct.ports} />
                    <InfoRow
                      label="Production Year"
                      value={selectedProduct.productionYear}
                    />
                    <InfoRow
                      label="Operating System"
                      value={selectedProduct.operatingSystem}
                    />
                    <InfoRow
                      label="Category"
                      value={selectedProduct.categoryName}
                    />
                    <InfoRow label="Shop" value={selectedProduct.shopName} />
                    <InfoRow
                      label="Date Created"
                      value={
                        selectedProduct.createdDate
                          ? new Date(
                              selectedProduct.createdDate
                            ).toLocaleDateString()
                          : ""
                      }
                    />
                    <InfoRow
                      label="Last Updated"
                      value={
                        selectedProduct.updatedDate
                          ? new Date(
                              selectedProduct.updatedDate
                            ).toLocaleDateString()
                          : ""
                      }
                    />
                  </div>
                  {/* Description */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 shadow max-h-32 overflow-y-auto">
                    <span className="text-gray-600 font-semibold mb-1 block">
                      Description
                    </span>
                    <span className="text-gray-700 whitespace-pre-line">
                      {selectedProduct.description || (
                        <span className="italic text-gray-400">
                          Not specified
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end p-6 border-t bg-gradient-to-r from-blue-50 to-blue-100 rounded-b-3xl">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow transition-all duration-300 text-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTrash className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 text-center mb-8">
                Are you sure you want to delete product "
                {productToDelete?.productName}"? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// InfoRow helper
function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-base font-medium ${
          !value ? "text-gray-400 italic" : "text-gray-800"
        }`}
      >
        {value || "Not specified"}
      </span>
    </div>
  );
}

export default ProductManagement;
