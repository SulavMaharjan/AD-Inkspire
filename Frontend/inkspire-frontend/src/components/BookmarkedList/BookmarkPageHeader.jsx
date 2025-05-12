import React from "react";
import "../../styles/BookmarkedPageHeader.css";

export const BookmarkPageHeader = ({ bookCount }) => {
  return (
    <div className="bookmark-page-header">
      <div className="header-top">
        <h1>My Bookmarked Books</h1>
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
        </div>
      </div>
    </div>
  );
};
