import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import productApi from "../../../api/productApi";
import shopApi from "../../../api/shopApi";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";

const MyProductShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy token và decode để xác định user
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        // Lấy thông tin shop của user
        const shopsRes = await shopApi.getAllShops();

        console.log("Shops response:", shopsRes);
        if (!shopsRes || !shopsRes.isSuccess) {
          throw new Error("Failed to fetch shops");
        }

        const userShop = shopsRes.data.find(
          (shop) => shop.userId === Number(userId)
        );

        if (!userShop) {
          throw new Error("Shop not found for this user");
        }

        setShopId(userShop.shopId);

        // Lấy tất cả sản phẩm
        const productsRes = await productApi.getAllProducts();
        if (!productsRes || !productsRes.isSuccess) {
          throw new Error("Failed to fetch products");
        }

        // Đảm bảo data là một mảng
        const productsData = Array.isArray(productsRes.data)
          ? productsRes.data
          : [];
        console.log("Products data:", productsData);

        // Lọc sản phẩm thuộc về shop của user
        const shopProducts = productsData.filter(
          (product) => product.shopId === userShop.shopId
        );

        setProducts(shopProducts);
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.message || "An error occurred while loading products"
        );
        // Đảm bảo products luôn là mảng ngay cả khi có lỗi
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleDelete = (productId) => {
    const product = products.find(p => p.productId === productId);
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (productId) => {
    try {
      const response = await productApi.deleteProduct(productId);
      if (response && response.isSuccess) {
        // Cập nhật state local
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.productId !== productId)
        );
        toast.success("Product deleted successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: "#10B981",
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }
        });
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        toast.error(response?.message || "Failed to delete product", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: "#EF4444",
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#EF4444",
          color: "white",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }
      });
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.cpu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!shopId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-4 text-amber-600 text-center">
          My Products
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-500 font-medium">
            Shop information not found. Please create a shop first.
          </p>
          <Link
            to="/shop/create-shop"
            className="mt-4 inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Create Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-600 mb-4 md:mb-0">
          My Products
        </h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <Link
            to="/shop/add-product"
            className="flex items-center justify-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            <FaPlus className="mr-2" /> Add New Product
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-500">No products found</p>
          <p className="text-gray-400 mt-2">
            Start adding products to your shop!
          </p>
          <Link
            to="/shop/add-product"
            className="mt-4 inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            <FaPlus className="inline mr-2" /> Add New Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    product.imageProduct ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
                {product.quantity > 0 ? (
                  <span className="absolute top-3 right-3 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow">
                    In Stock: {product.quantity}
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-red-400 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-2xl font-extrabold mb-2 text-blue-800 line-clamp-2 drop-shadow">
                  {product.productName}
                </h2>
                <div className="mb-4 ">
                  <span className="text-lg font-bold text-amber-600">
                    {product.price?.toLocaleString() || 0} đ
                  </span>
                </div>
                <div className="space-y-1 mb-4">
                  <div className="text-base text-indigo-700">
                    <span className="font-bold">CPU:</span> {product.cpu || '-'}
                  </div>
                  <div className="text-base text-purple-700">
                    <span className="font-bold">RAM:</span> {product.ram || '-'}
                  </div>
                  <div className="text-base text-pink-700">
                    <span className="font-bold">Storage:</span> {product.storage || '-'}
                  </div>
                </div>
                <div className="flex justify-between gap-2 mt-auto">
                  <button
                    onClick={() => handleViewDetail(product)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition duration-200 text-base gap-2"
                  >
                    <FaEye /> Details
                  </button>
                  <Link
                    to={`/shop/edit-product/${product.productId}`}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition duration-200 text-base gap-2"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition duration-200 text-base gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chi tiết sản phẩm Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200">
            <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-600 tracking-tight">
                Product Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto p-8 flex-1">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image section */}
                <div className="flex-shrink-0 flex flex-col items-center w-full md:w-60">
                  <div className="bg-gradient-to-br from-amber-100 to-white p-3 rounded-xl shadow mb-4 w-full">
                    <img
                      src={selectedProduct.imageProduct || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={selectedProduct.productName}
                      className="w-full h-44 object-contain rounded-lg border-2 border-amber-200 shadow"
                    />
                  </div>
                </div>
                {/* Info section */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                    <h3 className="text-2xl font-bold text-gray-900 flex-1 line-clamp-2">
                      {selectedProduct.productName}
                    </h3>
                    <div className="flex flex-col md:flex-row md:gap-4 gap-1 items-start md:items-center">
                      <span className="text-xl font-bold text-amber-600">
                        {selectedProduct.price?.toLocaleString() || 0} đ
                      </span>
                      <span className="text-base font-semibold text-green-700 bg-green-100 px-4 py-1 rounded-full border border-green-200">
                        Qty: {selectedProduct.quantity || 0}
                      </span>
                    </div>
                  </div>
                  {/* Technical and Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-amber-500">•</span>Technical Specifications
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-base">
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">CPU</span>
                          <div className="text-gray-700">{selectedProduct.cpu || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">RAM</span>
                          <div className="text-gray-700">{selectedProduct.ram || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Storage</span>
                          <div className="text-gray-700">{selectedProduct.storage || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Screen Size</span>
                          <div className="text-gray-700">{selectedProduct.screenSize || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Graphics Card</span>
                          <div className="text-gray-700">{selectedProduct.graphicsCard || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Battery</span>
                          <div className="text-gray-700">{selectedProduct.battery || "-"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-amber-500">•</span>Additional Information
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-base">
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Model</span>
                          <div className="text-gray-700">{selectedProduct.model || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Color</span>
                          <div className="text-gray-700">{selectedProduct.color || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Ports</span>
                          <div className="text-gray-700">{selectedProduct.ports || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Production Year</span>
                          <div className="text-gray-700">{selectedProduct.productionYear || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Operating System</span>
                          <div className="text-gray-700">{selectedProduct.operatingSystem || "-"}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 mb-2 flex items-center gap-2">Category</span>
                          <div className="text-gray-700">{selectedProduct.categoryName || "-"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Description */}
                  {selectedProduct.description && (
                    <div className="bg-gradient-to-r from-amber-50 to-white border-l-4 border-amber-400 p-5 rounded-xl shadow-sm mt-6">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-amber-500">•</span>Description
                      </h4>
                      <p className="text-gray-900 whitespace-pre-line text-base">{selectedProduct.description}</p>
                    </div>
                  )}
                  {/* Dates */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="font-medium">Created:</span> {selectedProduct.createdDate ? new Date(selectedProduct.createdDate).toLocaleDateString() : "-"}
                    </div>
                    <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="font-medium">Updated:</span> {selectedProduct.updatedDate ? new Date(selectedProduct.updatedDate).toLocaleDateString() : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Delete Product</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Are you sure you want to delete this product?</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{productToDelete.productName}</h4>
                  <p className="text-amber-600 font-bold">{productToDelete.price?.toLocaleString()} đ</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteConfirm(productToDelete.productId)}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{
          fontSize: "14px",
          fontWeight: "500"
        }}
      />
    </div>
  );
};

export default MyProductShop;
