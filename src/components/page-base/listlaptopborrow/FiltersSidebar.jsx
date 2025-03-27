import React, { useState } from "react";

const FiltersSidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    screenSize: "",
    status: "",
    cpu: "",
    ram: "",
    storage: "",
  });

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters); // Gửi filters mới lên component cha
  };

  return (
    <div className="w-1/4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-lg border border-teal-100">
      <h3 className="text-xl font-bold mb-6 text-teal-800 border-b border-teal-200 pb-3 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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
        {/* CPU Filter */}
        <div className="filter-group">
          <h4 className="font-semibold mb-3 text-teal-700 flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            CPU
          </h4>
          <select
            className="w-full p-2.5 bg-white border border-teal-200 rounded-lg 
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
            transition-all duration-300 hover:border-teal-400
            shadow-sm"
            value={filters.cpu}
            onChange={(e) => handleFilterChange("cpu", e.target.value)}
          >
            <option value="">All CPU</option>
            <option value="i5">Intel Core i5</option>
            <option value="i7">Intel Core i7</option>
            <option value="i9">Intel Core i9</option>
          </select>
        </div>

        {/* RAM Filter */}
        <div className="filter-group">
          <h4 className="font-semibold mb-3 text-teal-700 flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            RAM
          </h4>
          <select
            className="w-full p-2.5 bg-white border border-teal-200 rounded-lg 
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
            transition-all duration-300 hover:border-teal-400
            shadow-sm"
            value={filters.ram}
            onChange={(e) => handleFilterChange("ram", e.target.value)}
          >
            <option value="">All RAM</option>
            <option value="8">8GB</option>
            <option value="16">16GB</option>
            <option value="32">32GB</option>
          </select>
        </div>

        {/* Storage Filter */}
        <div className="filter-group">
          <h4 className="font-semibold mb-3 text-teal-700 flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Storage
          </h4>
          <select
            className="w-full p-2.5 bg-white border border-teal-200 rounded-lg 
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
            transition-all duration-300 hover:border-teal-400
            shadow-sm"
            value={filters.storage}
            onChange={(e) => handleFilterChange("storage", e.target.value)}
          >
            <option value="">All Storage</option>
            <option value="256">256GB</option>
            <option value="512">512GB</option>
            <option value="1024">1TB</option>
          </select>
        </div>

        {/* Screen Size Filter */}
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
            value={filters.screenSize}
            onChange={(e) => handleFilterChange("screenSize", e.target.value)}
          >
            <option value="">All Sizes</option>
            <option value="13.3">13.3 inch</option>
            <option value="15.6">15.6 inch</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <h4 className="font-semibold mb-3 text-teal-700 flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Status
          </h4>
          <select
            className="w-full p-2.5 bg-white border border-teal-200 rounded-lg 
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
            transition-all duration-300 hover:border-teal-400
            shadow-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={() => {
            const defaultFilters = {
              screenSize: "",
              status: "",
              cpu: "",
              ram: "",
              storage: "",
            };
            setFilters(defaultFilters);
            onFilterChange(defaultFilters);
          }}
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium 
          py-2.5 rounded-lg transition-colors duration-300 
          shadow-sm hover:shadow-md"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
