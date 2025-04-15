import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch, className = "" }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full ${className}`}
    >
      <div className="relative group">
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search for laptops by name, specs, or condition..."
          className="w-full py-3 pl-12 pr-10 bg-white text-indigo-900 placeholder-indigo-400 rounded-xl 
                    border border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                    focus:ring-opacity-30 shadow-sm transition-all duration-300 text-sm outline-none"
        />
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <SearchIcon fontSize="small" className="text-indigo-500" />
        </div>
        
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ClearIcon fontSize="small" />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r 
                   from-indigo-600 to-purple-700 text-white text-xs font-medium rounded-lg hover:from-indigo-700 
                   hover:to-purple-800 transition-all duration-300 shadow-sm"
      >
        Search
      </button>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default SearchBar;
