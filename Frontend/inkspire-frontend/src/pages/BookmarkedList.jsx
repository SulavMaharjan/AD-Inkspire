import React, { useState, useEffect } from "react";
import { EmptyBookmarkState } from "../components/BookmarkedList/EmptyBookmarkState";
import { SortDropdown } from "../components/BookmarkedList/SortDropdown";
import { BookmarkPageHeader } from "../components/BookmarkedList/BookmarkPageHeader";
import { getBookmarkedBooks } from "../context/bookApiService";
import "../styles/BookmarkedList.css";
import Footer from "../components/Landing/Footer";
import Navbar from "../components/Navigation/Navbar";
import { BookmarkCard } from "../components/BookmarkedList/BookmarkCard";

const BookmarkedList = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [sortOption, setSortOption] = useState("title-asc");
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await getBookmarkedBooks(
        pagination.pageNumber,
        pagination.pageSize
      );
      setBookmarkedBooks(response.items);
      setPagination({
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error("Error fetching bookmarked books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [pagination.pageNumber, pagination.pageSize]);

  const getSortedBooks = () => {
    return [...bookmarkedBooks].sort((a, b) => {
      switch (sortOption) {
        case "title-asc":
          return a.bookTitle.localeCompare(b.bookTitle);
        case "title-desc":
          return b.bookTitle.localeCompare(a.bookTitle);
        case "author-asc":
          return a.author.localeCompare(b.author);
        case "author-desc":
          return b.author.localeCompare(a.author);
        case "date-added-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-added-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-asc":
          return (
            (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
          );
        case "price-desc":
          return (
            (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
          );
        default:
          return 0;
      }
    });
  };

  const sortedBooks = getSortedBooks();

  return (
    <div>
      <Navbar />
      <div className="bookmarked-page">
        <BookmarkPageHeader bookCount={pagination.totalCount} />

        {bookmarkedBooks.length > 0 ? (
          <>
            <div className="bookmarked-controls">
              <div className="view-sort-container">
                <SortDropdown
                  currentSort={sortOption}
                  onSortChange={setSortOption}
                />
              </div>
            </div>

            <div className="bookmarked-content">
              <div className="books-container">
                {isLoading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your bookmarked books...</p>
                  </div>
                ) : sortedBooks.length > 0 ? (
                  <div className="book-list">
                    {sortedBooks.map((book) => (
                      <BookmarkCard
                        key={book.bookId}
                        book={book}
                        onRemove={(bookId) => {
                          setBookmarkedBooks((prevBooks) =>
                            prevBooks.filter((book) => book.bookId !== bookId)
                          );
                          setPagination((prev) => ({
                            ...prev,
                            totalCount: prev.totalCount - 1,
                          }));
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <h3>No books found</h3>
                    <p>Try adjusting your sort settings to see more books.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <EmptyBookmarkState />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookmarkedList;
