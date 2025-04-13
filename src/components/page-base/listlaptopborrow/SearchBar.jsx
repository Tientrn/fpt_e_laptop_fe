import { useState } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch, className }) => {
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
    <div className={`${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          className="w-full py-3 px-10 bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-lg
            focus:ring-1 focus:ring-amber-400 focus:border-amber-400 shadow-sm
            transition-all duration-200 text-sm
            placeholder-indigo-300 text-indigo-800"
          placeholder="Search by laptop name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400"
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

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string,
};

SearchBar.defaultProps = {
  className: "",
};

export default SearchBar;
