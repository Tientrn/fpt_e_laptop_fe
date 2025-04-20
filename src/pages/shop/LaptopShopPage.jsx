import { useState, useEffect } from "react";
import productApi from "../../api/productApi";
import { FaShoppingCart, FaSearch, FaLaptop, FaTimesCircle, FaTags, FaSort, FaRegLightbulb, FaFilter } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import "react-toastify/dist/ReactToastify.css";
import categoryApi from "../../api/categoryApi";
import PropTypes from "prop-types";
import CreativeFilterSidebar from "../../components/shop/CreativeFilterSidebar";

// Custom compact SearchBar with creative design
const CreativeSearchBar = ({ onSearch, className }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`${className}`}>
      <div className="relative group">
        <input
          type="text"
          className="w-full py-3 px-12 bg-white/90 backdrop-blur-md border-2 border-indigo-200 rounded-full
            focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-md
            transition-all duration-300 text-sm placeholder-indigo-500 text-indigo-800
            group-hover:shadow-lg group-hover:border-indigo-300"
          placeholder="Find your perfect laptop..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300">
          <FaSearch className="text-lg" />
        </div>
      </div>
    </div>
  );
};

CreativeSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string
};

// Custom creative SortOptions
const CreativeSortOptions = ({ onSort, className }) => {
  const [sortValue, setSortValue] = useState("default");

  const handleSortChange = (e) => {
    setSortValue(e.target.value);
    onSort(e.target.value);
  };

  return (
    <div className={`${className}`}>
      <div className="relative group">
        <select
          value={sortValue}
          onChange={handleSortChange}
          className="appearance-none w-full bg-white/90 backdrop-blur-md border-2 border-indigo-200 py-2.5 pl-10 pr-10 rounded-full
            text-indigo-800 text-sm font-medium cursor-pointer shadow-md group-hover:shadow-lg
            focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300
            group-hover:border-indigo-300"
        >
          <option value="default">Sort By</option>
          <option value="ram-high-to-low">RAM: High to Low</option>
          <option value="ram-low-to-high">RAM: Low to High</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300">
          <FaSort className="text-lg" />
        </div>
        <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

CreativeSortOptions.propTypes = {
  onSort: PropTypes.func.isRequired,
  className: PropTypes.string
};

const LaptopShopPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isSticky, setIsSticky] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    screenSize: "",
    cpu: "",
    ram: "",
    storage: "",
    status: ""
  });
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const getCurrentCart = useCartStore((state) => state.getCurrentCart);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Monitor scroll for sticky header
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        if (res.isSuccess) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
    filterAndSortProducts(query, selectedCategory, sortOption, activeFilters);
  };

  const handleSort = (option) => {
    setSortOption(option);
    filterAndSortProducts(searchQuery, selectedCategory, option, activeFilters);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    filterAndSortProducts(searchQuery, categoryId, sortOption, activeFilters);
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    filterAndSortProducts(searchQuery, selectedCategory, sortOption, newFilters);
  };

  // Combined function to filter and sort products
  const filterAndSortProducts = (query, category, sortOpt, filters) => {
    let filtered = [...allProducts];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter((product) => product.categoryId === category);
    }
    
    // Apply advanced filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((product) => {
          if (key === "ram" || key === "storage") {
            return parseInt(product[key]) === parseInt(value);
          }
          if (key === "status") {
            if (value === "Available") {
              return product.quantity > 0;
            } else if (value === "Unavailable") {
              return product.quantity <= 0;
            }
            return true;
          }
          return product[key]?.toLowerCase().includes(value.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOpt) {
        case "ram-high-to-low": return parseInt(b.ram) - parseInt(a.ram);
        case "ram-low-to-high": return parseInt(a.ram) - parseInt(b.ram);
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        default: return 0;
      }
    });
    
    setProducts(filtered);
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

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortOption("default");
    setActiveFilters({
      screenSize: "",
      cpu: "",
      ram: "",
      storage: "",
      status: ""
    });
    setProducts(allProducts);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || 
                          selectedCategory !== null || 
                          sortOption !== "default" || 
                          Object.values(activeFilters).some(value => value !== "");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-indigo-800 font-medium text-sm">Loading amazing laptops...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section - Creative Design */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-800 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute top-20 right-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-5 left-1/3 w-32 h-32 bg-white rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-full p-3 shadow-lg transform rotate-6">
                <FaLaptop className="text-indigo-600 text-2xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md tracking-tight">
                Tech Haven
              </h1>
            </div>
            <div className="w-28 h-1.5 bg-gradient-to-r from-white/60 to-white/90 rounded-full mb-5"></div>
            <p className="max-w-2xl text-indigo-100 text-lg mb-8 font-light">
              Discover premium laptops for work, gaming, and everything in between
            </p>

            <div className="max-w-xl w-full">
              <CreativeSearchBar onSearch={handleSearch} className="w-full" />
              <div className="flex items-center justify-center mt-3 text-indigo-100 text-xs">
                <FaRegLightbulb className="mr-1.5" />
                <p>Type a keyword to find your dream laptop or browse by category below</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation - Stylish & Clean */}
      <div 
        className={`transition-all duration-300 ease-in-out z-30 bg-white border-b border-indigo-100 shadow-sm 
          ${isSticky ? 'sticky top-0 py-2 px-4' : 'py-3 px-4'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaLaptop className="text-indigo-600" />
            <h2 className="text-indigo-800 font-medium hidden md:block">Tech Haven</h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                showFilters 
                  ? "bg-indigo-100 text-indigo-800 shadow-sm" 
                  : "bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-sm hover:shadow"
              }`}
            >
              {showFilters ? <FaTimesCircle className="text-sm" /> : <FaFilter className="text-sm" />}
              <span className="hidden md:inline">{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>

            <CreativeSortOptions onSort={handleSort} className="w-auto" />
            
            {hasActiveFilters && (
              <button 
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-sm hover:shadow"
              >
                <FaTimesCircle />
                <span className="hidden md:inline">Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories - Modern Tab Style */}
      <div className="bg-white shadow-sm mb-8 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center py-3 gap-1 md:gap-2">
            <div className="flex items-center text-indigo-700 pr-3 border-r border-indigo-100">
              <FaTags className="mr-2" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            
            <button
              onClick={() => {
                setSelectedCategory(null);
                filterAndSortProducts(searchQuery, null, sortOption, activeFilters);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${selectedCategory === null
                  ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-sm"
                  : "text-indigo-700 hover:bg-indigo-50"
                }`}
            >
              All Products
            </button>

            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => handleCategoryClick(cat.categoryId)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${selectedCategory === cat.categoryId
                    ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-sm"
                    : "text-indigo-700 hover:bg-indigo-50"
                  }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content with Filter Sidebar */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filters (shown when showFilters is true) */}
          {showFilters && (
            <div className="md:hidden">
              <CreativeFilterSidebar 
                onFilterChange={handleFilterChange} 
                currentFilters={activeFilters}
              />
            </div>
          )}

          {/* Desktop Filters */}
          <div className={`hidden md:block md:w-1/4 transition-all duration-300 ${
            showFilters ? 'opacity-100' : 'opacity-0 md:w-0 overflow-hidden'
          }`}>
            {showFilters && (
              <div className="sticky top-20">
                <CreativeFilterSidebar 
                  onFilterChange={handleFilterChange} 
                  currentFilters={activeFilters}
                />
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className={`flex-1 transition-all duration-300 ${showFilters ? 'md:w-3/4' : 'w-full'}`}>
            {products.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-indigo-900">
                    <span className="border-b-2 border-indigo-400 pb-1">Available Products</span>
                  </h2>
                  <div className="text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                    {products.length} {products.length === 1 ? "product" : "products"} found
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
                      onClick={() => navigateToDetail(product.productId)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.imageProduct}
                          alt={product.productName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        {product.quantity > 0 ? (
                          <span className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            Available
                          </span>
                        ) : (
                          <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            Out of Stock
                          </span>
                        )}
                        <div className="absolute bottom-3 left-4 text-white">
                          <p className="text-lg font-bold drop-shadow-md">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-indigo-900 font-semibold text-lg mb-2 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors">
                          {product.productName}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-indigo-700 mb-4">
                          <div className="flex items-center">
                            <span className="w-3 h-3 bg-indigo-100 rounded-full mr-2"></span>
                            <span>CPU: {product.cpu}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 bg-purple-100 rounded-full mr-2"></span>
                            <span>RAM: {product.ram}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 bg-indigo-100 rounded-full mr-2"></span>
                            <span>Storage: {product.storage}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 bg-purple-100 rounded-full mr-2"></span>
                            <span>Screen: {product.screenSize}&quot;</span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const cart = getCurrentCart();
                              const existingItem = cart.find(
                                (item) => item.productId === product.productId
                              );
                              const currentQty = existingItem ? existingItem.quantity : 0;

                              if (currentQty >= product.quantity) {
                                toast.error("Maximum quantity reached");
                                return;
                              }
                              
                              if (product.quantity > 0) {
                                addToCart({
                                  productId: product.productId,
                                  productName: product.productName,
                                  price: product.price,
                                  imageProduct: product.imageProduct,
                                  quantity: 1,
                                  cpu: product.cpu,
                                  ram: product.ram,
                                  storage: product.storage,
                                  quantityAvailable: product.quantity,
                                });
                                toast.success(`Added to cart`, {
                                  position: "top-right",
                                  autoClose: 2000,
                                  style: {
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  },
                                });
                              }
                            }}
                            disabled={product.quantity <= 0}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-medium shadow-sm 
                              ${product.quantity > 0
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                : "bg-gray-300 cursor-not-allowed"
                              }`}
                          >
                            <FaShoppingCart />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center mt-6 max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 flex items-center justify-center bg-indigo-50 rounded-full mb-4">
                    <FaLaptop size={32} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">No Products Found</h3>
                  <p className="text-indigo-700 mb-6 max-w-md">
                    We couldn&apos;t find any products matching your search criteria. Try adjusting your filters or browse our entire collection.
                  </p>
                  <button 
                    onClick={resetAllFilters}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm hover:shadow font-medium"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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