import React, { useState } from "react";
import { BookIcon, Search, SlidersHorizontal } from "lucide-react";
import SearchBar from "../BookCatalog/SearchBar";
import BookCard from "../BookCatalog/BookCard";
import FilterSidebar from "../BookCatalog/FilterSidebar";
import CategoryTabs from "../BookCatalog/CategoryTabs";
import SortSelector from "../BookCatalog/SortSelector";
import { books } from "../../data/books";
import "../../styles/BookListing.css";
import Footer from "../Landing/Footer";

const BookListing = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get books on sale
  const onSaleBooks = books.filter((book) => book.onSale);

  // Filter books by category
  const getBooksByCategory = () => {
    switch (activeCategory) {
      case "bestsellers":
        return filteredBooks.filter((book) => book.bestseller);
      case "award-winners":
        return filteredBooks.filter((book) => book.awardWinner);
      case "new-releases":
        return filteredBooks.filter((book) => book.newRelease);
      case "new-arrivals":
        return filteredBooks.filter((book) => book.newArrival);
      case "coming-soon":
        return filteredBooks.filter((book) => book.comingSoon);
      case "deals":
        return filteredBooks.filter((book) => book.onSale);
      default:
        return filteredBooks;
    }
  };

  // Sort books
  const sortBooks = (books) => {
    switch (sortBy) {
      case "title":
        return [...books].sort((a, b) => a.title.localeCompare(b.title));
      case "publication-date":
        return [...books].sort(
          (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
        );
      case "price-low":
        return [...books].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...books].sort((a, b) => b.price - a.price);
      case "popularity":
      default:
        return [...books].sort((a, b) => b.popularity - a.popularity);
    }
  };

  const displayBooks = sortBooks(getBooksByCategory());

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="book-listing-container">
      <header className="book-listing-header">
        <div className="logo-container">
          <BookIcon size={32} />
          <h1>Inkspire</h1>
        </div>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button className="filter-button" onClick={toggleFilters}>
          <SlidersHorizontal size={20} />
          <span>Filters</span>
        </button>
      </header>

      <div className="book-listing-content">
        {showFilters && <FilterSidebar setShowFilters={setShowFilters} />}

        <main className="book-listing-main">
          <div className="controls-container">
            <CategoryTabs
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {activeCategory === "all" && onSaleBooks.length > 0 && (
            <section className="sale-section">
              <h2>On Sale Books</h2>
              <div className="books-grid">
                {onSaleBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}

          <section className="all-books-section">
            <h2>
              {activeCategory === "all"
                ? "All Books"
                : getBooksByCategory().length > 0
                ? `${activeCategory
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())} (${
                    displayBooks.length
                  })`
                : "No books found"}
            </h2>
            {displayBooks.length > 0 ? (
              <div className="books-grid">
                {displayBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="no-books-message">
                <p>No books found matching your criteria.</p>
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default BookListing;
