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
      const response = await productApi.deleteProduct(productToDelete.productId);

      if (response && response.isSuccess) {
        toast.success("Product deleted successfully!");
        setProducts(products.filter(product => product.productId !== productToDelete.productId));
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
      const response = await productimageApi.getProductImagesById(product.productId);
      if (response.isSuccess) {
        setAdditionalImages(response.data);
      }
    } catch (error) {
      console.error("Error fetching additional images:", error);
      toast.error("Failed to load additional images");
    }
    setShowDetailModal(true);
  };

  const filteredProducts = products.filter(product => 
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.cpu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaLaptop className="mr-3 text-blue-600" /> 
          Product Management
        </h1>
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search products..."
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
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.productId} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.imageProduct || "https://via.placeholder.com/300x200?text=No+Image"} 
                  alt={product.productName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm">
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold mb-2" style={{ maxHeight: '4rem', overflow: 'hidden' }}>{product.productName}</h2>
                <p className="text-gray-600 mb-2"><span className="font-medium">Price:</span> {product.price?.toLocaleString() || 0} đ</p>
                <p className="text-gray-600 mb-2"><span className="font-medium">Quantity:</span> {product.quantity || 0}</p>
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => handleViewDetail(product)} 
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition duration-300"
                  >
                    <FaEye className="mr-2" /> Details
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(product)} 
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
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
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
                      src={selectedProduct.imageProduct || "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={selectedProduct.productName} 
                      className="w-full h-[300px] object-contain rounded-lg shadow-md bg-gray-50"
                    />
                  </div>
                  
                  {/* Additional Images */}
                  {additionalImages.length > 0 && (
                    <div className="relative">
                      <div className="flex gap-2 overflow-hidden py-2 px-8">
                        {additionalImages.map((img, index) => (
                          <div key={img.productImageId} className="flex-shrink-0">
                            <img
                              src={img.imageUrl}
                              alt={`Additional ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-200 cursor-pointer"
                              onClick={() => {
                                setSelectedProduct({
                                  ...selectedProduct,
                                  imageProduct: img.imageUrl
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {additionalImages.length > 4 && (
                        <>
                          <button
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              const gallery = e.target.closest('.relative').querySelector('.flex');
                              gallery.scrollBy({ left: -100, behavior: 'smooth' });
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              const gallery = e.target.closest('.relative').querySelector('.flex');
                              gallery.scrollBy({ left: 100, behavior: 'smooth' });
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column - Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">{selectedProduct.productName}</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Price:</span> {selectedProduct.price?.toLocaleString() || 0} đ</p>
                    <p><span className="font-medium">Quantity:</span> {selectedProduct.quantity || 0}</p>
                    <p><span className="font-medium">CPU:</span> {selectedProduct.cpu || "Not specified"}</p>
                    <p><span className="font-medium">RAM:</span> {selectedProduct.ram || "Not specified"}</p>
                    <p><span className="font-medium">Storage:</span> {selectedProduct.storage || "Not specified"}</p>
                    <p><span className="font-medium">Screen Size:</span> {selectedProduct.screenSize || "Not specified"}</p>
                    <p><span className="font-medium">Date Created:</span> {selectedProduct.createdDate ? new Date(selectedProduct.createdDate).toLocaleDateString() : "Not specified"}</p>
                    <p><span className="font-medium">Last Updated:</span> {selectedProduct.updatedDate ? new Date(selectedProduct.updatedDate).toLocaleDateString() : "Not specified"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-300"
                >
                  Close
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
              Are you sure you want to delete product "{productToDelete?.productName}"?
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

export default ProductManagement;
