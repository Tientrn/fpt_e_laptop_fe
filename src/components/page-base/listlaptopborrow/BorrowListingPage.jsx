import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";
import FiltersSidebar from "./FiltersSidebar";
import donateitemsApi from "../../../api/donateitemsApi";
import CardBorrow from "./CardBorrow";
import LaptopIcon from "@mui/icons-material/Laptop";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";

const BorrowListingPage = () => {
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
        const response = await donateitemsApi.getAllDonateItems();
        if (response.isSuccess) {
          setAllLaptops(response.data || []);
          setLaptops(response.data || []);
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
          return laptop[key]?.toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    filteredLaptops.sort((a, b) => {
      switch (sortOption) {
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
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-indigo-900 font-medium text-sm">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-600 font-medium">Lỗi: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm w-full"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(value => value !== "") || searchQuery !== "" || sortOption !== "default";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section - More Compact */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white rounded-full p-1.5 shadow-md">
                <LaptopIcon className="text-indigo-700" fontSize="medium" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">
                Laptop Borrow Program
              </h1>
            </div>
            <div className="w-24 h-1 bg-amber-500 rounded-full mb-4"></div>
            <p className="max-w-2xl text-indigo-100 text-base mb-6">
              Browse our collection of available laptops for borrowing
            </p>

            <div className="max-w-3xl w-full">
              <SearchBar
                onSearch={setSearchQuery}
                className="w-full"
              />
              <div className="flex items-center justify-center mt-2 text-indigo-200 text-xs">
                <InfoIcon fontSize="small" className="mr-1" />
                <p>Use search or filters to find your perfect laptop</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation - More Compact */}
      <div className={`transition-all duration-300 ease-in-out z-30 bg-white shadow-sm py-2 px-3 ${isSticky ? 'sticky top-0' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <LaptopIcon className="text-indigo-600" fontSize="small" />
            <h2 className="text-indigo-900 font-medium hidden md:block text-sm">Laptop Borrowing</h2>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 md:px-3 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showFilters 
                  ? "bg-indigo-100 text-indigo-800" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {showFilters ? <CloseIcon fontSize="small" /> : <FilterListIcon fontSize="small" />}
              <span className="hidden md:inline">{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>

            <SortOptions onSort={setSortOption} className="w-auto" />
            
            {hasActiveFilters && (
              <button 
                onClick={resetAllFilters}
                className="md:px-3 px-2 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
              >
                <span className="hidden md:inline">Reset All</span>
                <span className="md:hidden">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - More Compact */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Filters Sidebar - Mobile */}
          {showFilters && <div className="md:hidden"><FiltersSidebar onFilterChange={handleFilterChange} currentFilters={activeFilters} /></div>}

          {/* Filters Sidebar - Desktop */}
          <div className={`hidden md:block md:w-1/4 transition-all duration-300 ${showFilters ? 'opacity-100' : 'opacity-0 md:w-0 overflow-hidden'}`}>
            {showFilters && <div className="sticky top-16"><FiltersSidebar onFilterChange={handleFilterChange} currentFilters={activeFilters} /></div>}
          </div>

          {/* Laptops Grid */}
          <div className={`flex-1 transition-all duration-300 ${showFilters ? 'md:w-3/4' : 'w-full'}`}>
            {laptops.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-indigo-900">Available Laptops</h2>
                  <p className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full text-xs">
                    {laptops.length} {laptops.length === 1 ? "laptop" : "laptops"} found
                  </p>
                </div>

                {/* Masonry-like layout with CSS columns */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                  {laptops.map((laptop) => (
                    <div key={laptop.itemId} className="break-inside-avoid">
                      <CardBorrow laptop={laptop} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center mt-4">
                <div className="flex flex-col items-center">
                  <LaptopIcon style={{ fontSize: 50 }} className="text-indigo-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Laptops Found</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    There are no laptops matching your search criteria.
                  </p>
                  <button 
                    onClick={resetAllFilters}
                    className="px-5 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowListingPage;
