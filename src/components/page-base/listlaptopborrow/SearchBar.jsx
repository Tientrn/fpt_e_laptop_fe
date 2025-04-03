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

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSearchSubmit} className="relative">
        {/* Ô tìm kiếm */}
        <input
          type="text"
          className="w-full p-3 pl-12 bg-white border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-amber-600 focus:border-amber-600 
            transition-all duration-300 hover:border-gray-400 
            placeholder-gray-500 text-black"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === "Enter" && onSearch(searchQuery)}
        />

        {/* Icon tìm kiếm (Căn giữa) */}
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
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
  );
};

export default SearchBar;
