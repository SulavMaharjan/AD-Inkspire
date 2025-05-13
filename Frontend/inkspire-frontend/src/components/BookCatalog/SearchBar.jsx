import React, { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import "../../styles/SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery || "");

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  //submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (window.searchDebounceTimer) {
      clearTimeout(window.searchDebounceTimer);
    }

    console.log("Search form submitted with query:", inputValue);
    setSearchQuery(inputValue);
  };

  //search handler
  const debouncedSearch = useCallback(
    (value) => {
      if (window.searchDebounceTimer) {
        clearTimeout(window.searchDebounceTimer);
      }

      window.searchDebounceTimer = setTimeout(() => {
        console.log("Debounced search triggered with:", value);
        setSearchQuery(value);
      }, 500);
    },
    [setSearchQuery]
  );

  //input change handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  //clear search handler
  const handleClearSearch = () => {
    setInputValue("");

    if (window.searchDebounceTimer) {
      clearTimeout(window.searchDebounceTimer);
    }

    console.log("Search cleared");
    setSearchQuery("");
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
          aria-label="Search books"
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
