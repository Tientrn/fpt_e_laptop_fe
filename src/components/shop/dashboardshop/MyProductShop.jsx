import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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
        const productsData = Array.isArray(productsRes.data) ? productsRes.data : [];
        console.log("Products data:", productsData);

        // Lọc sản phẩm thuộc về shop của user
        const shopProducts = productsData.filter(
          (product) => product.shopId === userShop.shopId
        );

        setProducts(shopProducts);
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "An error occurred while loading products");
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

  const handleDeleteConfirm = async (productId) => {
    try {
      console.log("Deleting product with ID:", productId);
      const response = await productApi.deleteProduct(productId);
      console.log("Delete response:", response);
      
      if (response && response.isSuccess) {
        // Cập nhật state local trước
        setProducts(prevProducts => prevProducts.filter(product => product.productId !== productId));
        toast.success("Product deleted successfully!");
        
        // Refresh lại danh sách từ server
        const refreshResponse = await productApi.getAllProducts();
        if (refreshResponse && refreshResponse.isSuccess) {
          const filteredProducts = refreshResponse.data.filter(
            (product) => product.shopId === shopId
          );
          setProducts(filteredProducts);
        }
      } else {
        toast.error(response?.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const handleDelete = (productId) => {
    console.log("Delete button clicked for product ID:", productId);
    
    toast.info(
      <div className="text-center">
        <p className="mb-2">Are you sure you want to delete this product?</p>
        <div className="flex justify-center">
          <button 
            onClick={() => {
              console.log("Confirm delete clicked for ID:", productId);
              handleDeleteConfirm(productId);
              toast.dismiss();
            }} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2 transition duration-300"
          >
            Confirm
          </button>
          <button 
            onClick={() => toast.dismiss()} 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const filteredProducts = products.filter(product => 
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
          <p className="text-gray-400 mt-2">Start adding products to your shop!</p>
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
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.imageProduct || "https://via.placeholder.com/300x200?text=No+Image"} 
                  alt={product.productName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-amber-500 text-white px-2 py-1 text-sm">
                  {product.quantity > 0 ? `In Stock: ${product.quantity}` : "Out of Stock"}
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">{product.productName}</h2>
                <p className="text-amber-600 font-bold mb-4">{product.price?.toLocaleString() || 0} đ</p>
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => handleViewDetail(product)} 
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition duration-300"
                  >
                    <FaEye className="mr-2" /> Details
                  </button>
                  <Link
                    to={`/shop/edit-product/${product.productId}`}
                    className="flex items-center bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded transition duration-300"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.productId)} 
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

      {/* Chi tiết sản phẩm Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-90vh overflow-y-auto">
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
                <div>
                  <img 
                    src={selectedProduct.imageProduct || "https://via.placeholder.com/400x300?text=No+Image"} 
                    alt={selectedProduct.productName} 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">{selectedProduct.productName}</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Price:</span> {selectedProduct.price?.toLocaleString() || 0} đ</p>
                    <p><span className="font-medium">Quantity:</span> {selectedProduct.quantity || 0}</p>
                    <p><span className="font-medium">CPU:</span> {selectedProduct.cpu || "Not specified"}</p>
                    <p><span className="font-medium">RAM:</span> {selectedProduct.ram || "Not specified"}</p>
                    <p><span className="font-medium">Storage:</span> {selectedProduct.storage || "Not specified"}</p>
                    <p><span className="font-medium">Screen Size:</span> {selectedProduct.screenSize || "Not specified"}</p>
                    <p><span className="font-medium">Category:</span> {selectedProduct.categoryName || "Not specified"}</p>
                    <p><span className="font-medium">Created Date:</span> {selectedProduct.createdDate ? new Date(selectedProduct.createdDate).toLocaleDateString() : "Not specified"}</p>
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
    </div>
  );
};

export default MyProductShop;
