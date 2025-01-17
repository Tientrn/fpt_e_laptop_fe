import React from "react";

const FiltersSidebar = () => {
  return (
    <div className="w-1/4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-lg border border-teal-100">
      <h3 className="text-xl font-bold mb-6 text-teal-800 border-b border-teal-200 pb-3 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
      </h3>

      <div className="space-y-6">
        <div className="filter-group">
          <h4 className="font-semibold mb-3 text-teal-700 flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Brand
          </h4>
          <select
            className="w-full p-2.5 bg-white border border-teal-200 rounded-lg 
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
            transition-all duration-300 hover:border-teal-400
            shadow-sm"
          >
            <option value="all">All</option>
            <option value="hp">HP</option>
            <option value="lenovo">Lenovo</option>
            <option value="asus">Asus</option>
          </select>
        </div>

        <div className="filter-group">
          <h4 className="font-semibold mb-3 text-teal-700 flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Price
          </h4>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer 
                accent-teal-500 hover:accent-teal-600"
            />
            <div className="flex justify-between mt-2 text-sm text-teal-600">
              <span>$0</span>
              <span>$10,000</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <h4 className="font-semibold mb-3 text-teal-700 flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Screen Size
          </h4>
          <select
            className="w-full p-2.5 bg-white border border-teal-200 rounded-lg 
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
            transition-all duration-300 hover:border-teal-400
            shadow-sm"
          >
            <option value="all">All</option>
            <option value="15">15 inch</option>
            <option value="13">13 inch</option>
          </select>
        </div>

        <button
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium 
          py-2.5 rounded-lg transition-colors duration-300 
          shadow-sm hover:shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
