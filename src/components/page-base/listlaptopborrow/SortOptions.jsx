import React from "react";

const SortOptions = ({ onSort }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="p-4 bg-white rounded-lg shadow-md border border-gray-300">
        <div className="flex items-center space-x-2">
          {/* Icon lọc */}
          <svg
            className="w-5 h-5 text-black"
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

          {/* Dropdown */}
          <select
            onChange={(e) => onSort(e.target.value)}
            className="p-2.5 bg-white border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-amber-600 focus:border-amber-600 
              transition-all duration-300 hover:border-gray-400
              text-black font-medium cursor-pointer shadow-sm"
          >
            <option value="default">Sắp xếp theo</option>
            <option value="ram-high-to-low">RAM: Cao đến Thấp</option>
            <option value="processor-high-to-low">CPU: Cao đến Thấp</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;
