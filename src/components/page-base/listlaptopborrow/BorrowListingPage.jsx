import { useState, useEffect } from "react";
import { FaTags } from "react-icons/fa";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";
import FiltersSidebar from "./FiltersSidebar";
import donateitemsApi from "../../../api/donateitemsApi";
import categoryApi from "../../../api/categoryApi";
import majorApi from "../../../api/major";
import CardBorrow from "./CardBorrow";
import LaptopIcon from "@mui/icons-material/Laptop";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SchoolIcon from "@mui/icons-material/School";

const BorrowListingPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [laptops, setLaptops] = useState([]);
  const [allLaptops, setAllLaptops] = useState([]);
  const [currentBaseLaptops, setCurrentBaseLaptops] = useState([]); // Store current dataset before filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    screenSize: "",
    status: "",
    cpu: "",
    ram: "",
    storage: "",
  });
  const [isSticky, setIsSticky] = useState(false);
  const [showMajors, setShowMajors] = useState(false);
  
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedMajor(null);
    setSuggestionMessage("");
    
    // Set current base laptops to all laptops filtered by category
    const categoryLaptops = allLaptops.filter(laptop => laptop.categoryId === categoryId);
    setCurrentBaseLaptops(categoryLaptops);
    
    // Apply existing filters to the new base
    applyFiltersAndSort(categoryLaptops, searchQuery, activeFilters, sortOption);
  };

  const handleMajorClick = async (majorName) => {
    try {
      setLoading(true);
      setSelectedMajor(majorName);
      setSelectedCategory(null);
      
      const response = await donateitemsApi.getSuggestedLaptopsByMajor(majorName);
      if (response.isSuccess) {
        const majorLaptops = response.data.suitableLaptops || [];
        setSuggestionMessage(response.data.suggestionMessage || "");
        
        // Set current base laptops to major-specific laptops
        setCurrentBaseLaptops(majorLaptops);
        
        // Apply existing filters to the major-specific laptops
        applyFiltersAndSort(majorLaptops, searchQuery, activeFilters, sortOption);
      } else {
        setError("Failed to fetch suggested laptops");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sort to the given dataset
  const applyFiltersAndSort = (baseData, search, filters, sort) => {
    let filteredLaptops = [...baseData];

    // Apply search filter
    if (search) {
      filteredLaptops = filteredLaptops.filter((laptop) =>
        laptop.itemName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply active filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredLaptops = filteredLaptops.filter((laptop) => {
          if (key === "ram" || key === "storage") {
            return parseInt(laptop[key]) === parseInt(value);
          }
          return laptop[key]?.toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    filteredLaptops.sort((a, b) => {
      switch (sort) {
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

    setLaptops(filteredLaptops);
  };

  // Legacy function for backward compatibility
  const filterAndSortProducts = (search, category, sort, filters) => {
    let baseData = [...allLaptops];
    
    // Apply category filter if applicable
    if (category) {
      baseData = baseData.filter(laptop => laptop.categoryId === category);
    }
    
    // Use common filter/sort function
    applyFiltersAndSort(baseData, search, filters, sort);
  };

  // Monitor scroll position for sticky navigation
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        if (res.isSuccess) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  // fetch majors
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const res = await majorApi.getAllMajor();
        if (res.isSuccess) {
          setMajors(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch majors", err);
      }
    };

    fetchMajors();
  }, []);

  //fetch laptops
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await donateitemsApi.getAllDonateItems();
        if (response.isSuccess) {
          const laptopsData = response.data || [];
          setAllLaptops(laptopsData);
          setCurrentBaseLaptops(laptopsData);
          setLaptops(laptopsData);
        } else {
          setError("Failed to fetch laptops");
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
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    applyFiltersAndSort(currentBaseLaptops, searchQuery, newFilters, sortOption);
  };

  // Handle search query changes
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    applyFiltersAndSort(currentBaseLaptops, query, activeFilters, sortOption);
  };

  // Handle sort option changes
  const handleSortChange = (option) => {
    setSortOption(option);
    applyFiltersAndSort(currentBaseLaptops, searchQuery, activeFilters, option);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setSortOption("default");
    setSelectedCategory(null);
    setSelectedMajor(null);
    setSuggestionMessage("");
    setActiveFilters({
      screenSize: "",
      status: "",
      cpu: "",
      ram: "",
      storage: "",
    });
    
    // Reset to all laptops
    setCurrentBaseLaptops(allLaptops);
    setLaptops(allLaptops);
  };

  // Handle "All Products" button click
  const handleAllProductsClick = () => {
    setSelectedCategory(null);
    setSelectedMajor(null);
    setSuggestionMessage("");
    setCurrentBaseLaptops(allLaptops);
    applyFiltersAndSort(allLaptops, searchQuery, activeFilters, sortOption);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 animate-pulse bg-indigo-600 rounded-full opacity-10"></div>
            <div className="absolute top-2 left-2 right-2 bottom-2 animate-spin rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600"></div>
            <LaptopMacIcon
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 opacity-80"
              style={{ fontSize: 24 }}
            />
          </div>
          <p className="mt-4 text-indigo-900 font-medium text-sm">
            Đang tải dữ liệu borrow...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full border border-red-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <InfoIcon style={{ fontSize: 32 }} className="text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Lỗi khi tải dữ liệu
            </h3>
            <p className="text-red-600 font-medium mb-4 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 text-sm font-medium shadow-sm"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if any filters are active
  const hasActiveFilters =
    Object.values(activeFilters).some((value) => value !== "") ||
    searchQuery !== "" ||
    sortOption !== "default" ||
    selectedMajor !== null ||
    selectedCategory !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 to-purple-50/40">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl transform -translate-x-1/3 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 shadow-lg border border-white/30">
                <LaptopMacIcon
                  className="text-white"
                  style={{ fontSize: 28 }}
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">
                Laptop Borrow Program
              </h1>
              <div className="bg-amber-500/90 rounded-full px-2.5 py-1 text-xs font-medium text-amber-950 shadow-sm flex items-center">
                <AutoAwesomeIcon fontSize="small" className="mr-1" />
                FPT
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mb-5"></div>
            <p className="max-w-2xl text-indigo-100 text-base mb-8">
              Explore our collection of high-quality laptops available for
              borrowing
            </p>

            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <SearchBar onSearch={handleSearchChange} className="w-full" />
              <div className="flex items-center justify-center mt-3 text-indigo-200 text-xs">
                <InfoIcon fontSize="small" className="mr-1.5" />
                <p>Search by laptop name, brand, or specifications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 text-indigo-50/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-full"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div
        className={`transition-all duration-300 ease-in-out z-30 bg-white shadow-md py-3 px-4 ${
          isSticky ? "sticky top-0 animate-slideDown" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LaptopMacIcon className="text-indigo-600" fontSize="small" />
            <h2 className="text-indigo-900 font-medium hidden md:block text-sm">
              Laptop Borrowing
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 md:px-3.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                showFilters
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              }`}
            >
              {showFilters ? (
                <CloseIcon fontSize="small" />
              ) : (
                <FilterListIcon fontSize="small" />
              )}
              <span className="hidden md:inline">
                {showFilters ? "Hide Filters" : "Show Filters"}
              </span>
            </button>

            <button
              onClick={() => setShowMajors(!showMajors)}
              className={`flex items-center gap-1.5 md:px-3.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                showMajors
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              }`}
            >
              <SchoolIcon fontSize="small" />
              <span className="hidden md:inline">
                {showMajors ? "Hide Majors" : "Suggest by Major"}
              </span>
            </button>

            <SortOptions
              onSort={handleSortChange}
              currentSort={sortOption}
              className="w-auto"
            />

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
      
      {/* Categories Section */}
      <div className="bg-white shadow-sm mb-4 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center py-3 gap-1 md:gap-2">
            <div className="flex items-center text-indigo-700 pr-3 border-r border-indigo-100">
              <FaTags className="mr-2" />
              <span className="text-sm font-medium">Categories</span>
            </div>

            <button
              onClick={handleAllProductsClick}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${
                  selectedCategory === null && selectedMajor === null
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
                  ${
                    selectedCategory === cat.categoryId
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
      
      {/* Majors Section */}
      {showMajors && (
        <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 shadow-sm mb-8 py-4 overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center text-indigo-700 border-b border-indigo-100 pb-2">
                <SchoolIcon className="mr-2" />
                <span className="text-sm font-medium">Suggest Laptops by Major</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {majors.map((major) => (
                  <button
                    key={major.majorId}
                    onClick={() => handleMajorClick(major.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                      ${
                        selectedMajor === major.name
                          ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-sm"
                          : "text-indigo-700 bg-white/70 hover:bg-white border border-indigo-100"
                      }`}
                  >
                    {major.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Suggestion Message */}
        {suggestionMessage && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 text-indigo-800">
            <div className="flex items-start">
              <InfoIcon className="text-indigo-600 mr-3 mt-0.5" fontSize="small" />
              <div>
                <h3 className="font-medium text-indigo-900 mb-1">Suggested Configuration</h3>
                <p className="text-sm">{suggestionMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Mobile */}
          {showFilters && (
            <div className="md:hidden">
              <FiltersSidebar
                onFilterChange={handleFilterChange}
                currentFilters={activeFilters}
              />
            </div>
          )}

          {/* Filters Sidebar - Desktop */}
          <div
            className={`hidden md:block transition-all duration-300 ${
              showFilters
                ? "md:w-1/4 opacity-100"
                : "md:w-0 overflow-hidden opacity-0"
            }`}
          >
            {showFilters && (
              <div className="sticky top-16">
                <FiltersSidebar
                  onFilterChange={handleFilterChange}
                  currentFilters={activeFilters}
                />
              </div>
            )}
          </div>

          {/* Laptops Grid */}
          <div
            className={`flex-1 transition-all duration-300 ${
              showFilters ? "md:w-3/4" : "w-full"
            }`}
          >
            {laptops.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-indigo-900">
                      {selectedMajor ? `Laptops for ${selectedMajor}` : "Available Laptops"}
                    </h2>
                    <div className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      {laptops.length}{" "}
                      {laptops.length === 1 ? "laptop" : "laptops"}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="text-indigo-600 text-xs hidden md:block">
                      Filtered results •{" "}
                      <button
                        onClick={resetAllFilters}
                        className="underline hover:text-indigo-800"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>

                {/* Masonry-like layout with CSS columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {laptops.map((laptop) => (
                    <div key={laptop.itemId}>
                      <CardBorrow laptop={laptop} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center mt-5 border border-indigo-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <LaptopIcon
                      style={{ fontSize: 32 }}
                      className="text-indigo-300"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No Laptops Found
                  </h3>
                  <p className="text-gray-600 mb-5 max-w-md text-sm">
                    There are no laptops matching your current search criteria.
                    Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 text-sm font-medium shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-indigo-200 text-sm">
            © {new Date().getFullYear()} FPT University Laptop Borrowing Program
          </p>
        </div>
      </div>
    </div>
  );
};

export default BorrowListingPage;
