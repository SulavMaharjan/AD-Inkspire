import React from "react";
import "../../styles/EmptyBookmarkState.css";

export const EmptyBookmarkState = () => {
  return (
    <div className="empty-bookmark-state">
      <div className="empty-icon">
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2>Your bookmark list is empty</h2>
      <p>Save your favorite books to easily find them later.</p>
      <div className="empty-actions">
        <button className="primary-button">Browse Books</button>
        <button className="secondary-button">View Bestsellers</button>
      </div>
    </div>
  );
};
