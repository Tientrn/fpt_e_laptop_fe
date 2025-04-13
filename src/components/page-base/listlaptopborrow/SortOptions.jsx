import { useState } from "react";
import SortIcon from "@mui/icons-material/Sort";
import PropTypes from "prop-types";

const SortOptions = ({ onSort, className }) => {
  const [sortValue, setSortValue] = useState("default");

  const handleSortChange = (e) => {
    setSortValue(e.target.value);
    onSort(e.target.value);
  };

  return (
    <div className={`${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none">
          <SortIcon className="text-indigo-500" fontSize="small" />
        </div>
        
        <select
          value={sortValue}
          onChange={handleSortChange}
          className="pl-9 pr-6 py-1.5 bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-lg
            shadow-sm transition-all duration-200
            text-indigo-800 text-xs font-medium cursor-pointer
            focus:ring-1 focus:ring-amber-400 focus:border-amber-400
            appearance-none"
        >
          <option value="default">Sort By</option>
          <option value="ram-high-to-low">RAM: High to Low</option>
          <option value="ram-low-to-high">RAM: Low to High</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <div className="absolute right-3 pointer-events-none">
          <svg 
            className="w-3 h-3 text-indigo-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

SortOptions.propTypes = {
  onSort: PropTypes.func.isRequired,
  className: PropTypes.string
};

SortOptions.defaultProps = {
  className: ""
};

export default SortOptions;
