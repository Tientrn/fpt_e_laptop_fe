import { useState, useEffect } from "react";
import { FaFilter, FaMicrochip, FaMemory, FaHdd, FaDesktop } from "react-icons/fa";
import PropTypes from "prop-types";

const CreativeFilterSidebar = ({ onFilterChange, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    screenSize: "",
    cpu: "",
    ram: "",
    storage: "",
    status: "",
    ...currentFilters
  });

  // Sync with currentFilters from parent
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ...currentFilters
    }));
  }, [currentFilters]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-700 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold flex items-center">
            <FaFilter className="mr-2" />
            <span>Refine Results</span>
          </h3>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
            Advanced Filters
          </span>
        </div>
      </div>

      {/* Filter Options */}
      <div className="p-4 space-y-4">
        {/* CPU Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-2 text-indigo-900 font-medium">
            <FaMicrochip className="mr-2 text-indigo-600" />
            <h4>Processor</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.cpu === "" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("cpu", "")}
            >
              All CPUs
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.cpu === "i5" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("cpu", "i5")}
            >
              Intel i5
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.cpu === "i7" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("cpu", "i7")}
            >
              Intel i7
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.cpu === "i9" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("cpu", "i9")}
            >
              Intel i9
            </button>
          </div>
        </div>

        {/* RAM Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-2 text-indigo-900 font-medium">
            <FaMemory className="mr-2 text-indigo-600" />
            <h4>RAM</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.ram === "" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("ram", "")}
            >
              All RAM
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.ram === "8" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("ram", "8")}
            >
              8 GB
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.ram === "16" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("ram", "16")}
            >
              16 GB
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.ram === "32" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("ram", "32")}
            >
              32 GB
            </button>
          </div>
        </div>

        {/* Storage Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-2 text-indigo-900 font-medium">
            <FaHdd className="mr-2 text-indigo-600" />
            <h4>Storage</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.storage === "" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("storage", "")}
            >
              All Storage
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.storage === "256" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("storage", "256")}
            >
              256 GB
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.storage === "512" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("storage", "512")}
            >
              512 GB
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.storage === "1" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("storage", "1")}
            >
              1 TB
            </button>
          </div>
        </div>

        {/* Screen Size Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-2 text-indigo-900 font-medium">
            <FaDesktop className="mr-2 text-indigo-600" />
            <h4>Screen Size</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.screenSize === "" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("screenSize", "")}
            >
              All Sizes
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.screenSize === "13.3" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("screenSize", "13.3")}
            >
              13.3&quot;
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.screenSize === "14" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("screenSize", "14")}
            >
              14&quot;
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.screenSize === "15.6" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("screenSize", "15.6")}
            >
              15.6&quot;
            </button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-2 text-indigo-900 font-medium">
            <FaDesktop className="mr-2 text-indigo-600" />
            <h4>Status</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.status === "" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("status", "")}
            >
              All Statuses
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.status === "Available" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("status", "Available")}
            >
              Available
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-full border transition-colors ${
                filters.status === "Unavailable" 
                  ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => handleFilterChange("status", "Unavailable")}
            >
              Unavailable
            </button>
          </div>
        </div>

        {/* Reset Button - Only show if any filter is active */}
        {Object.values(filters).some(value => value !== "") && (
          <div className="mt-6">
            <button
              onClick={() => {
                const resetFilters = {
                  screenSize: "",
                  cpu: "",
                  ram: "",
                  storage: "",
                  status: ""
                };
                setFilters(resetFilters);
                onFilterChange(resetFilters);
              }}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

CreativeFilterSidebar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  currentFilters: PropTypes.object
};

export default CreativeFilterSidebar; 