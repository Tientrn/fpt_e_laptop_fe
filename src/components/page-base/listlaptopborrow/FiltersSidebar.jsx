import { useState, useEffect } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import MemoryIcon from "@mui/icons-material/Memory";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import StorageIcon from "@mui/icons-material/Storage";
import MonitorIcon from "@mui/icons-material/Monitor";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TuneIcon from "@mui/icons-material/Tune";
import PropTypes from "prop-types";

const FiltersSidebar = ({ onFilterChange, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    screenSize: "",
    status: "",
    cpu: "",
    ram: "",
    storage: "",
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

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => value !== "").length;

  // Filter button component with proper PropTypes
  const FilterButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`py-1.5 px-3 text-xs rounded-lg border transition-all duration-200 ${
        active 
          ? "bg-indigo-100 border-indigo-200 text-indigo-800 font-medium shadow-sm"
          : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/80"
      }`}
    >
      {children}
    </button>
  );

  // PropTypes for the FilterButton component
  FilterButton.propTypes = {
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-5 py-3.5 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold flex items-center">
            <TuneIcon fontSize="small" className="mr-2" />
            <span>Filter Options</span>
          </h3>
          {activeFilterCount > 0 && (
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/30">
              {activeFilterCount} active
            </span>
          )}
        </div>
      </div>

      {/* Filter Options */}
      <div className="p-4 space-y-5 text-sm">
        {/* CPU Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-3 text-indigo-900 font-medium">
            <MemoryIcon className="mr-2 text-indigo-600" fontSize="small" />
            <h4 className="text-sm">Processor</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <FilterButton 
              active={filters.cpu === ""} 
              onClick={() => handleFilterChange("cpu", "")}
            >
              All CPUs
            </FilterButton>
            <FilterButton
              active={filters.cpu === "i5"}
              onClick={() => handleFilterChange("cpu", "i5")}
            >
              Intel i5
            </FilterButton>
            <FilterButton
              active={filters.cpu === "i7"}
              onClick={() => handleFilterChange("cpu", "i7")}
            >
              Intel i7
            </FilterButton>
            <FilterButton
              active={filters.cpu === "i9"}
              onClick={() => handleFilterChange("cpu", "i9")}
            >
              Intel i9
            </FilterButton>
          </div>
        </div>

        {/* RAM Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-3 text-indigo-900 font-medium">
            <DeveloperBoardIcon className="mr-2 text-indigo-600" fontSize="small" />
            <h4 className="text-sm">RAM Memory</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <FilterButton
              active={filters.ram === ""}
              onClick={() => handleFilterChange("ram", "")}
            >
              All RAM
            </FilterButton>
            <FilterButton
              active={filters.ram === "8"}
              onClick={() => handleFilterChange("ram", "8")}
            >
              8GB
            </FilterButton>
            <FilterButton
              active={filters.ram === "16"}
              onClick={() => handleFilterChange("ram", "16")}
            >
              16GB
            </FilterButton>
            <FilterButton
              active={filters.ram === "32"}
              onClick={() => handleFilterChange("ram", "32")}
            >
              32GB
            </FilterButton>
          </div>
        </div>

        {/* Storage Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-3 text-indigo-900 font-medium">
            <StorageIcon className="mr-2 text-indigo-600" fontSize="small" />
            <h4 className="text-sm">Storage</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <FilterButton
              active={filters.storage === ""}
              onClick={() => handleFilterChange("storage", "")}
            >
              All Storage
            </FilterButton>
            <FilterButton
              active={filters.storage === "256"}
              onClick={() => handleFilterChange("storage", "256")}
            >
              256GB
            </FilterButton>
            <FilterButton
              active={filters.storage === "512"}
              onClick={() => handleFilterChange("storage", "512")}
            >
              512GB
            </FilterButton>
            <FilterButton
              active={filters.storage === "1024"}
              onClick={() => handleFilterChange("storage", "1024")}
            >
              1TB
            </FilterButton>
          </div>
        </div>

        {/* Screen Size Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-3 text-indigo-900 font-medium">
            <MonitorIcon className="mr-2 text-indigo-600" fontSize="small" />
            <h4 className="text-sm">Screen Size</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <FilterButton
              active={filters.screenSize === ""}
              onClick={() => handleFilterChange("screenSize", "")}
            >
              All Screens
            </FilterButton>
            <FilterButton
              active={filters.screenSize === "13"}
              onClick={() => handleFilterChange("screenSize", "13")}
            >
              13&quot; 
            </FilterButton>
            <FilterButton
              active={filters.screenSize === "14"}
              onClick={() => handleFilterChange("screenSize", "14")}
            >
              14&quot;
            </FilterButton>
            <FilterButton
              active={filters.screenSize === "15"}
              onClick={() => handleFilterChange("screenSize", "15")}
            >
              15&quot;
            </FilterButton>
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <div className="flex items-center mb-3 text-indigo-900 font-medium">
            <CheckCircleOutlineIcon className="mr-2 text-indigo-600" fontSize="small" />
            <h4 className="text-sm">Status</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <FilterButton
              active={filters.status === ""}
              onClick={() => handleFilterChange("status", "")}
            >
              All Status
            </FilterButton>
            <FilterButton
              active={filters.status === "Available"}
              onClick={() => handleFilterChange("status", "Available")}
            >
              Available
            </FilterButton>
            <FilterButton
              active={filters.status === "Borrowed"}
              onClick={() => handleFilterChange("status", "Borrowed")}
            >
              Borrowed
            </FilterButton>
            <FilterButton
              active={filters.status === "Damaged"}
              onClick={() => handleFilterChange("status", "Damaged")}
            >
              Damaged
            </FilterButton>
          </div>
        </div>

        {/* Reset All */}
        {activeFilterCount > 0 && (
          <button
            onClick={() => onFilterChange({
              screenSize: "",
              status: "",
              cpu: "",
              ram: "",
              storage: "",
            })}
            className="w-full py-2 mt-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 text-xs font-medium flex items-center justify-center"
          >
            <FilterListIcon fontSize="small" className="mr-1.5" />
            Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
};

FiltersSidebar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  currentFilters: PropTypes.object
};

export default FiltersSidebar;
