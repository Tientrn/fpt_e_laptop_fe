import React, { useState, useEffect } from "react";
import productApi from "../../api/productApi";
import { FaShoppingCart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import SearchBar from "../../components/page-base/listlaptopborrow/SearchBar";
import SortOptions from "../../components/page-base/listlaptopborrow/SortOptions";
import 'react-toastify/dist/ReactToastify.css';

const LaptopShopPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAllProducts();
        if (response.isSuccess) {
          setAllProducts(response.data || []);
          setProducts(response.data || []);
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

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    let filteredProducts = allProducts.filter((product) =>
      product.productName.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedProducts = [...products];

    sortedProducts.sort((a, b) => {
      switch (option) {
        case "ram-high-to-low":
          return parseInt(b.ram) - parseInt(a.ram);
        case "ram-low-to-high":
          return parseInt(a.ram) - parseInt(b.ram);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setProducts(sortedProducts);
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.productName} to cart`);
  };

  const navigateToDetail = (productId) => {
    navigate(`/laptopshop/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB] mx-auto"></div>
        <p className="mt-2 text-[#2563EB]">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 lg:px-12 py-6">
      {/* Tiêu đề */}
      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-black">
          Laptop Shop
        </h1>
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full mt-2"></div>
      </div>

      {/* Search, Sort, Category */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <SearchBar onSearch={handleSearch} className="w-full md:w-2/3" />
          <SortOptions onSort={handleSort} className="w-full md:w-1/3" />
        </div>

        {/* Danh mục sản phẩm
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                selectedCategory === category
                  ? "bg-amber-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>*/}
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-300 relative cursor-pointer"
            onClick={() => navigateToDetail(product.productId)}
          >
            {product.quantity > 0 && (
              <div className="absolute top-2 right-2 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Available
              </div>
            )}
            <img
              src={product.imageProduct}
              alt={product.productName}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1 hover:text-amber-600">
                {product.productName}
              </h2>
              <p className="text-sm text-gray-600">CPU: {product.cpu}</p>
              <p className="text-sm text-gray-600">RAM: {product.ram}</p>
              <p className="text-sm text-gray-600">
                Storage: {product.storage}
              </p>
              <p className="text-sm text-gray-600">
                Screen: {product.screenSize}"
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-slate-600">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.quantity > 0) {
                      addToCart({
                        productId: product.productId,
                        productName: product.productName,
                        price: product.price,
                        imageProduct: product.imageProduct,
                        quantity: 1,
                        cpu: product.cpu,
                        ram: product.ram,
                        storage: product.storage
                      });
                      toast.success(`Đã thêm ${product.productName} vào giỏ hàng`, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        style: {
                          fontSize: '14px',
                          fontWeight: '500'
                        }
                      });
                    }
                  }}
                  disabled={product.quantity <= 0}
                  className={`px-3 py-2 rounded-md transition ${
                    product.quantity > 0
                      ? "bg-slate-600 text-white hover:bg-amber-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {product.quantity > 0 ? <FaShoppingCart /> : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          <p>No products found.</p>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LaptopShopPage;
