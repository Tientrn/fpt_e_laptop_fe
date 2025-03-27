import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="mb-6">
      <div className="max-w-2xl mx-auto p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-md border border-teal-100">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            className="w-full p-3 pl-10 bg-white border border-teal-200 rounded-l-lg
              focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
              transition-all duration-300 hover:border-teal-400
              placeholder-teal-400 text-teal-800"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <svg
            className="absolute left-3 w-5 h-5 text-teal-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
