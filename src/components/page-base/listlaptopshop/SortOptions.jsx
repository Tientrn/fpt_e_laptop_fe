import React from "react";

const SortOptions = ({ onSort }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-md border border-teal-100">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>

          <select
            onChange={(e) => onSort(e.target.value)}
            className="p-2.5 bg-white border border-teal-200 rounded-lg
              focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
              transition-all duration-300 hover:border-teal-400
              text-teal-800 font-medium cursor-pointer
              shadow-sm"
          >
            <option value="default" className="text-teal-800">
              Sort by
            </option>
            <option value="price-low-to-high" className="text-teal-800">
              Price: Low to High
            </option>
            <option value="price-high-to-low" className="text-teal-800">
              Price: High to Low
            </option>
            <option value="newest" className="text-teal-800">
              Newest
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;
