import React, { useState, useEffect } from "react";
import { BookList } from "../components/BookmarkedList/BookList";
import { EmptyBookmarkState } from "../components/BookmarkedList/EmptyBookmarkState";
import { SortDropdown } from "../components/BookmarkedList/SortDropdown";
import { BookmarkPageHeader } from "../components/BookmarkedList/BookmarkPageHeader";
import { getBookmarkedBooks } from "../data/bookApi";
import "../styles/BookmarkedList.css";
import Footer from "../components/Landing/Footer";
import Navbar from "../components/Navigation/Navbar";

const BookmarkedList = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [sortOption, setSortOption] = useState("title-asc");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState([]);

  // Fetch bookmarked books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const books = await getBookmarkedBooks();
        setBookmarkedBooks(books);
      } catch (error) {
        console.error("Error fetching bookmarked books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle removing a book from bookmarks
  const handleRemoveBookmark = (bookId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this book from your bookmarks?"
      )
    ) {
      setBookmarkedBooks(bookmarkedBooks.filter((book) => book.id !== bookId));
    }
  };

  // Handle removing multiple books
  const handleRemoveSelected = () => {
    if (selectedBooks.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to remove ${selectedBooks.length} books from your bookmarks?`
      )
    ) {
      setBookmarkedBooks(
        bookmarkedBooks.filter((book) => !selectedBooks.includes(book.id))
      );
      setSelectedBooks([]);
    }
  };

  // Handle selecting a book
  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  // Handle select all books
  const handleSelectAll = () => {
    if (selectedBooks.length === bookmarkedBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(bookmarkedBooks.map((book) => book.id));
    }
  };

  // Sort books based on current sort option
  const getSortedBooks = () => {
    return [...bookmarkedBooks].sort((a, b) => {
      switch (sortOption) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "author-asc":
          return a.author.localeCompare(b.author);
        case "author-desc":
          return b.author.localeCompare(a.author);
        case "date-added-desc":
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case "date-added-asc":
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
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
        <BookmarkPageHeader
          bookCount={bookmarkedBooks.length}
          selectedCount={selectedBooks.length}
          onRemoveSelected={handleRemoveSelected}
          onSelectAll={handleSelectAll}
          allSelected={
            selectedBooks.length === bookmarkedBooks.length &&
            bookmarkedBooks.length > 0
          }
        />

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
                  <BookList
                    books={sortedBooks}
                    onRemoveBookmark={handleRemoveBookmark}
                    selectedBooks={selectedBooks}
                    onSelectBook={handleSelectBook}
                  />
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
