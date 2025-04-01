import React, { useState, useEffect } from "react";
import productApi from "../../api/productApi";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import FiltersSidebar from "../../components/page-base/listlaptopborrow/FiltersSidebar";
import SortOptions from "../../components/page-base/listlaptopborrow/SortOptions";
import SearchBar from "../../components/page-base/listlaptopborrow/SearchBar";

const LaptopShopPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const cartCount = useCartStore((state) => state.getCartCount());

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

  const handleFilterChange = (filters) => {
    let filteredProducts = [...allProducts];

    console.log("Current filters:", filters);
    console.log("All products before filtering:", filteredProducts);

    if (filters.screenSize) {
      filteredProducts = filteredProducts.filter((product) => {
        console.log(
          "Comparing screenSize:",
          product.screenSize,
          filters.screenSize
        );
        return (
          String(product.screenSize)
            .replace(/inch|"/i, "")
            .trim() === String(filters.screenSize)
        );
      });
    }

    if (filters.cpu) {
      filteredProducts = filteredProducts.filter((product) => {
        const productCpu = String(product.cpu).toLowerCase();
        console.log(
          "Comparing CPU:",
          product.cpu,
          "->",
          productCpu,
          "with",
          filters.cpu
        );
        return productCpu.includes(filters.cpu.toLowerCase());
      });
    }

    if (filters.ram) {
      filteredProducts = filteredProducts.filter((product) => {
        const productRam = String(product.ram)
          .replace(/GB|gb|g|b/gi, "")
          .trim();
        console.log(
          "Comparing RAM:",
          product.ram,
          "->",
          productRam,
          "with",
          filters.ram
        );
        return productRam === String(filters.ram);
      });
    }

    if (filters.storage) {
      filteredProducts = filteredProducts.filter((product) => {
        const productStorage = String(product.storage)
          .replace(/GB|TB|SSD|gb|tb|ssd/gi, "")
          .trim();
        console.log(
          "Comparing storage:",
          product.storage,
          "->",
          productStorage,
          "with",
          filters.storage
        );
        return productStorage === String(filters.storage);
      });
    }

    if (filters.status) {
      filteredProducts = filteredProducts.filter((product) => {
        const isAvailable = product.quantity > 0;
        return filters.status.toLowerCase() === "available"
          ? isAvailable
          : !isAvailable;
      });
    }

    console.log("Filtered products:", filteredProducts);
    setProducts(filteredProducts);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    let filteredProducts = [...allProducts];

    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );
    }

    setProducts(filteredProducts);
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedProducts = [...products];

    sortedProducts.sort((a, b) => {
      switch (option) {
        case "ram-high-to-low":
          return (
            parseInt(String(b.ram).replace(/GB/i, "")) -
            parseInt(String(a.ram).replace(/GB/i, ""))
          );
        case "ram-low-to-high":
          return (
            parseInt(String(a.ram).replace(/GB/i, "")) -
            parseInt(String(b.ram).replace(/GB/i, ""))
          );
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

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB] mx-auto"></div>
        <p className="mt-2 text-[#2563EB]">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FiltersSidebar onFilterChange={handleFilterChange} />
      <div className="w-full lg:w-3/4 p-4 lg:p-6">
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2563EB] mb-2">
            Laptop Shop
          </h1>
          <div className="w-24 lg:w-32 h-1 bg-[#2563EB] mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center mb-8 lg:mb-12 space-y-4 md:space-y-0 md:space-x-6 justify-center">
          <div className="w-full md:w-1/5">
            <SortOptions onSort={handleSort} />
          </div>
          <div className="w-full md:w-3/5">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative cursor-pointer"
              onClick={() => navigateToDetail(product.productId)}
            >
              {product.quantity > 0 && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Available
                </div>
              )}
              <img
                src={product.imageProduct}
                alt={product.productName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 hover:text-[#2563EB]">
                  {product.productName}
                </h2>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>CPU: {product.cpu}</p>
                  <p>RAM: {product.ram}</p>
                  <p>Storage: {product.storage}</p>
                  <p>Screen: {product.screenSize}"</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#10B981]">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.quantity <= 0}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                      product.quantity > 0
                        ? "bg-[#10B981] text-white hover:bg-[#0F766E]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaptopShopPage;
