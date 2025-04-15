import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";
import FiltersSidebar from "./FiltersSidebar";
import shopitemsApi from "../../../api/shopitemsApi";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StorefrontIcon from "@mui/icons-material/Storefront";

const ShopListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [laptops, setLaptops] = useState([]);
  const [allLaptops, setAllLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    screenSize: "",
    status: "",
    cpu: "",
    ram: "",
    storage: "",
    price: "",
  });
  const [isSticky, setIsSticky] = useState(false);

  // Monitor scroll position for sticky navigation
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await shopitemsApi.getAllShopItems();
        if (response.isSuccess) {
          setAllLaptops(response.data || []);
          setLaptops(response.data || []);
        } else {
          setError("Failed to fetch shop laptops");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLaptops();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => setActiveFilters(newFilters);

  useEffect(() => {
    let filteredLaptops = [...allLaptops];

    // Apply search filter
    if (searchQuery) {
      filteredLaptops = filteredLaptops.filter((laptop) =>
        laptop.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filteredLaptops = filteredLaptops.filter((laptop) => {
          if (key === "ram" || key === "storage") {
            return parseInt(laptop[key]) === parseInt(value);
          }
          if (key === "price") {
            const price = parseInt(laptop.price);
            switch(value) {
              case "under-500": return price < 500;
              case "500-1000": return price >= 500 && price <= 1000;
              case "1000-1500": return price >= 1000 && price <= 1500;
              case "over-1500": return price > 1500;
              default: return true;
            }
          }
          return laptop[key]?.toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    filteredLaptops.sort((a, b) => {
      switch (sortOption) {
        case "price-high-to-low": return parseInt(b.price) - parseInt(a.price);
        case "price-low-to-high": return parseInt(a.price) - parseInt(b.price);
        case "ram-high-to-low": return parseInt(b.ram) - parseInt(a.ram);
        case "ram-low-to-high": return parseInt(a.ram) - parseInt(b.ram);
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        default: return 0;
      }
    });

    setLaptops(filteredLaptops);
  }, [searchQuery, sortOption, allLaptops, activeFilters]);

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setSortOption("default");
    setActiveFilters({
      screenSize: "",
      status: "",
      cpu: "",
      ram: "",
      storage: "",
      price: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 animate-pulse bg-blue-600 rounded-full opacity-10"></div>
            <div className="animate-spin h-full w-full rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <ShoppingCartIcon className="text-blue-600" style={{ fontSize: 28 }} />
            </div>
          </div>
          <p className="mt-6 text-blue-900 font-medium text-sm">Loading laptops from shop...</p>
          <p className="text-blue-500 text-xs mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full border border-red-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <InfoIcon style={{ fontSize: 32 }} className="text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
            <p className="text-red-600 font-medium mb-4 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 text-sm font-medium shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(value => value !== "") || searchQuery !== "" || sortOption !== "default";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 to-indigo-50/40">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl transform -translate-x-1/3 translate-y-1/2"></div>
          <div className="absolute bottom-20 right-20 opacity-20">
            <LocalMallIcon style={{ fontSize: 180 }} className="text-white" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 shadow-lg border border-white/30 rotate-3">
                <StorefrontIcon className="text-white" style={{ fontSize: 28 }} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">
                FPT Laptop Shop
              </h1>
              <div className="bg-amber-500/90 rounded-full px-2.5 py-1 text-xs font-medium text-amber-950 shadow-sm flex items-center -rotate-3">
                <AutoAwesomeIcon fontSize="small" className="mr-1" />
                PREMIUM
              </div>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mb-5"></div>
            <p className="max-w-2xl text-blue-100 text-base mb-8 leading-relaxed">
              Explore our collection of premium laptops available for purchase
              <br />Choose from a wide range of high-performance devices
            </p>

            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg">
              <SearchBar
                onSearch={setSearchQuery}
                className="w-full"
              />
              <div className="flex items-center justify-center mt-3 text-blue-200 text-xs">
                <InfoIcon fontSize="small" className="mr-1.5" />
                <p>Search by laptop name, brand, or specifications</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 text-blue-50/40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div className={`transition-all duration-300 ease-in-out z-30 bg-white shadow-md py-3 px-4 ${isSticky ? 'sticky top-0 animate-slideDown' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StorefrontIcon className="text-blue-600" fontSize="small" />
            <h2 className="text-blue-900 font-medium hidden md:block text-sm">FPT Laptop Shop</h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 md:px-3.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                showFilters 
                  ? "bg-blue-100 text-blue-800 border border-blue-200" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
            >
              {showFilters ? <CloseIcon fontSize="small" /> : <FilterListIcon fontSize="small" />}
              <span className="hidden md:inline">{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>

            <SortOptions onSort={setSortOption} currentSort={sortOption} className="w-auto" />
            
            {hasActiveFilters && (
              <button 
                onClick={resetAllFilters}
                className="md:px-3.5 px-2.5 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all duration-300 shadow-sm"
              >
                <span className="hidden md:inline">Reset All</span>
                <span className="md:hidden">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Mobile */}
          {showFilters && <div className="md:hidden"><FiltersSidebar onFilterChange={handleFilterChange} currentFilters={activeFilters} /></div>}

          {/* Filters Sidebar - Desktop */}
          <div className={`hidden md:block transition-all duration-300 ${showFilters ? 'md:w-1/4 opacity-100' : 'md:w-0 overflow-hidden opacity-0'}`}>
            {showFilters && <div className="sticky top-16"><FiltersSidebar onFilterChange={handleFilterChange} currentFilters={activeFilters} /></div>}
          </div>

          {/* Laptops Grid */}
          <div className={`flex-1 transition-all duration-300 ${showFilters ? 'md:w-3/4' : 'w-full'}`}>
            {laptops.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-blue-900">Premium Laptops</h2>
                    <div className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      {laptops.length} {laptops.length === 1 ? "laptop" : "laptops"}
                    </div>
                  </div>
                  
                  {hasActiveFilters && (
                    <div className="text-blue-600 text-xs hidden md:block">
                      Filtered results • <button onClick={resetAllFilters} className="underline hover:text-blue-800">Reset</button>
                    </div>
                  )}
                </div>

                {/* Laptops grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {laptops.map((laptop) => (
                    <div 
                      key={laptop.itemId} 
                      className="relative bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer transform hover:-translate-y-1 border border-blue-50 hover:border-blue-200"
                      onClick={() => window.location.href = `/shop/${laptop.itemId}`}
                    >
                      {/* Image container with gradient overlay */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={laptop.itemImage}
                          alt={laptop.itemName}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        
                        {/* Sale badge if discounted */}
                        {laptop.discount && (
                          <div className="absolute top-3 left-3 bg-red-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                            {laptop.discount}% OFF
                          </div>
                        )}
                        
                        {/* Price badge */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm shadow-sm bg-blue-500/90">
                          ${laptop.price}
                        </div>
                        
                        {/* Laptop name overlay on image */}
                        <h3 className="absolute bottom-3 left-3 right-3 font-semibold text-sm text-white line-clamp-1 drop-shadow-md">
                          {laptop.itemName}
                        </h3>
                      </div>

                      {/* Card body with specs */}
                      <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white to-blue-50/30">
                        <div className="space-y-2.5 flex-grow">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center text-blue-800 bg-blue-50/80 p-1.5 rounded-lg">
                              <span className="truncate text-xs font-medium">CPU: {laptop.cpu || "N/A"}</span>
                            </div>
                            <div className="flex items-center text-blue-800 bg-blue-50/80 p-1.5 rounded-lg">
                              <span className="truncate text-xs font-medium">RAM: {laptop.ram || "N/A"} GB</span>
                            </div>
                            <div className="flex items-center text-blue-800 bg-blue-50/80 p-1.5 rounded-lg">
                              <span className="truncate text-xs font-medium">Storage: {laptop.storage || "N/A"} GB</span>
                            </div>
                            <div className="flex items-center text-blue-800 bg-blue-50/80 p-1.5 rounded-lg">
                              <span className="truncate text-xs font-medium">Screen: {laptop.screenSize || "N/A"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/shop/${laptop.itemId}`;
                            }}
                            className="w-full py-2 text-xs bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 font-medium"
                          >
                            <ShoppingCartIcon fontSize="small" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Decorative element */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination or load more */}
                {laptops.length > 12 && (
                  <div className="flex justify-center mt-8">
                    <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-sm flex items-center">
                      Load More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center mt-5 border border-blue-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCartIcon style={{ fontSize: 32 }} className="text-blue-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Laptops Found</h3>
                  <p className="text-gray-600 mb-5 max-w-md text-sm">
                    There are no laptops matching your current search criteria. Try adjusting your filters or search terms.
                  </p>
                  <button 
                    onClick={resetAllFilters}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 text-sm font-medium shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="bg-white py-12 mt-12 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Need Help Choosing a Laptop?</h2>
          <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
            Our team of experts is ready to assist you in finding the perfect laptop for your needs.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 text-sm font-medium shadow-md">
            Contact Support
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <StorefrontIcon className="text-blue-200 mb-3" style={{ fontSize: 32 }} />
          <p className="text-blue-200 text-sm mb-2">© {new Date().getFullYear()} FPT University Laptop Shop</p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-blue-300">
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopListingPage;
