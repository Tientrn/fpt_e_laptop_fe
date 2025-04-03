import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative flex items-center">
        {/* Ô tìm kiếm */}
        <input
          type="text"
          className="w-full p-3 pl-10 bg-white border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-amber-600 focus:border-amber-600
            transition-all duration-300 hover:border-gray-400
            placeholder-gray-500 text-black"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* Icon tìm kiếm */}
        <svg
          className="absolute left-3 w-5 h-5 text-gray-500"
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

        {/* Nút tìm kiếm */}
        <button
          onClick={handleSearchSubmit}
          className="absolute right-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white 
            font-medium rounded-md transition-all duration-300 flex items-center"
        >
          <span>Tìm</span>
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
