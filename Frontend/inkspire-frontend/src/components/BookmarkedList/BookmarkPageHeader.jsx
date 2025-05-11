import React from "react";
import "../../styles/BookmarkedPageHeader.css";

export const BookmarkPageHeader = ({
  bookCount,
  selectedCount,
  onRemoveSelected,
  onSelectAll,
  allSelected,
}) => {
  return (
    <div className="bookmark-page-header">
      <div className="header-top">
        <h1>My Bookmarked Books</h1>
        <div className="header-actions">
          <button className="btn-add-to-cart" disabled={selectedCount === 0}>
            Add Selected to Cart
          </button>
          <button
            className="btn-remove-selected"
            disabled={selectedCount === 0}
            onClick={onRemoveSelected}
          >
            Remove Selected
          </button>
        </div>
      </div>

      <div className="header-info">
        <div className="book-count">
          <p>
            {bookCount === 0
              ? "No books bookmarked"
              : bookCount === 1
              ? "1 book bookmarked"
              : `${bookCount} books bookmarked`}
          </p>

          {selectedCount > 0 && (
            <p className="selected-count">{selectedCount} selected</p>
          )}
        </div>

        {bookCount > 0 && (
          <button className="btn-select-all" onClick={onSelectAll}>
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>
    </div>
  );
};
