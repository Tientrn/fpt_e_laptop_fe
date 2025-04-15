import { useState, useRef, useEffect } from "react";
import SortIcon from "@mui/icons-material/Sort";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";

const SortOptions = ({ onSort, currentSort = "default", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const sortOptions = [
    { id: "default", label: "Default" },
    { id: "price-high-to-low", label: "Price: High to Low" },
    { id: "price-low-to-high", label: "Price: Low to High" },
    { id: "ram-high-to-low", label: "RAM: High to Low" },
    { id: "ram-low-to-high", label: "RAM: Low to High" },
    { id: "newest", label: "Newest First" },
    { id: "oldest", label: "Oldest First" }
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(option => option.id === currentSort);
    return option ? option.label : "Default";
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (sortId) => {
    onSort(sortId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg border border-blue-200 
                 bg-white hover:bg-blue-50/80 text-blue-800 text-xs font-medium 
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <SortIcon fontSize="small" className="text-blue-600" />
        <span className="hidden md:inline">Sort: {getCurrentSortLabel()}</span>
        <span className="md:hidden">Sort</span>
        {isOpen ? (
          <ExpandLessIcon fontSize="small" className="text-blue-600" />
        ) : (
          <KeyboardArrowDownIcon fontSize="small" className="text-blue-600" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-blue-100 
                      py-2 z-40 transform origin-top-right transition-all duration-150 animate-fadeIn">
          <div className="text-xs text-blue-400 px-3 py-1.5 uppercase font-medium border-b border-blue-50 mb-1">
            Sort Options
          </div>
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSortChange(option.id)}
                className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-blue-50 transition-colors
                          ${currentSort === option.id ? 'text-blue-800 font-medium' : 'text-gray-700'}`}
              >
                {option.label}
                {currentSort === option.id && (
                  <CheckIcon fontSize="small" className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

SortOptions.propTypes = {
  onSort: PropTypes.func.isRequired,
  currentSort: PropTypes.string,
  className: PropTypes.string
};

export default SortOptions;
