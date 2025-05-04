import React from "react";
import { Search, X } from "lucide-react";
import "../../styles/SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by title, author, ISBN or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={handleClearSearch}>
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
