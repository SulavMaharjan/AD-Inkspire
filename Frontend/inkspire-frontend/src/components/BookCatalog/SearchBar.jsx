import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import "../../styles/SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery || "");

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  //handle submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted with query:", inputValue);
    setSearchQuery(inputValue);
  };

  //immediate search as user types
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      console.log("Auto-searching with query:", value);
      setSearchQuery(value);
    }, 500);
  };

  //clear search field
  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    console.log("Search cleared");
  };

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
      data-testid="search-form"
    >
      <div className="search-input-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search by title, author, ISBN..."
          value={inputValue}
          onChange={handleInputChange}
          className="search-input"
          data-testid="search-input"
        />
        {inputValue && (
          <button
            type="button"
            className="clear-search"
            onClick={handleClearSearch}
            aria-label="Clear search"
            data-testid="clear-search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="search-button"
        data-testid="search-button"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
