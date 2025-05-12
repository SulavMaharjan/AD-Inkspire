import React, { useState, useEffect, useContext } from "react";
import {
  BookIcon,
  SlidersHorizontal,
  AlertTriangle,
  RefreshCw,
  X,
} from "lucide-react";
import SearchBar from "../BookCatalog/SearchBar";
import BookCard from "../BookCatalog/BookCard";
import FilterSidebar from "../BookCatalog/FilterSidebar";
import CategoryTabs from "../BookCatalog/CategoryTabs";
import SortSelector from "../BookCatalog/SortSelector";
import Footer from "../Landing/Footer";
import { CartContext } from "../../context/CartContext";
import { addToCart } from "../../context/cartService";
import {
  checkApiAvailability,
  fetchBooks,
  fetchOnSale,
  fetchBestsellers,
  fetchNewReleases,
  fetchAwardWinners,
  fetchNewArrivals,
  fetchComingSoon,
  fetchTopRated,
  fetchMostPopular,
  fetchBooksLowToHigh,
  fetchBooksHighToLow,
  searchBooks,
} from "../../context/bookApiService";
import "../../styles/BookListing.css";

const BookListing = () => {
  const { fetchCart } = useContext(CartContext);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [onSaleBooks, setOnSaleBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 12,
  });

  const MAX_PRICE = 1000;

  //filter state
  const [activeFilters, setActiveFilters] = useState({
    minPrice: 0,
    maxPrice: MAX_PRICE,
    selectedGenres: [],
    selectedAuthors: [],
    selectedFormats: [],
    selectedLanguages: [],
    selectedPublishers: [],
    ratingFilter: 0,
  });

  //quantity modal state
  const [selectedBook, setSelectedBook] = useState(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [toast, setToast] = useState(null);

  //toast messages
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  //bookmark toggle toast
  const handleBookmarkToggle = (message, type) => {
    showToast(message, type);
  };

  //checking if API is available
  useEffect(() => {
    const checkApi = async () => {
      const isAvailable = await checkApiAvailability();
      setApiAvailable(isAvailable);
      if (!isAvailable) {
        setError(
          "API server is not available. Please ensure the backend service is running."
        );
        setLoading(false);
      }
    };

    checkApi();
  }, [retryCount]);

  //reset pagination
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [activeCategory, searchQuery, activeFilters]);

  const mapSortByToApi = (sortOption) => {
    return sortOption;
  };

  //books based on active category and filters
  useEffect(() => {
    if (!apiAvailable) return;

    const loadBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        const filters = {
          pageNumber: pagination.currentPage,
          pageSize: pagination.pageSize,
          searchTerm: searchQuery.trim(),
          sortBy: mapSortByToApi(sortBy),
          sortAscending: sortBy === "title",

          // Price filters
          ...(activeFilters.minPrice > 0 && {
            priceMin: activeFilters.minPrice,
          }),
          ...(activeFilters.maxPrice < MAX_PRICE && {
            priceMax: activeFilters.maxPrice,
          }),

          // Collection filters
          ...(activeFilters.selectedGenres.length > 0 && {
            genre: activeFilters.selectedGenres.join(","),
          }),
          ...(activeFilters.selectedAuthors.length > 0 && {
            author: activeFilters.selectedAuthors.join(","),
          }),
          ...(activeFilters.selectedFormats.length > 0 && {
            format: activeFilters.selectedFormats.join(","),
          }),
          ...(activeFilters.selectedLanguages.length > 0 && {
            language: activeFilters.selectedLanguages.join(","),
          }),
          ...(activeFilters.selectedPublishers.length > 0 && {
            publisher: activeFilters.selectedPublishers.join(","),
          }),

          // Rating filter
          ...(activeFilters.ratingFilter > 0 && {
            minRating: activeFilters.ratingFilter,
          }),

          // Category filters
          ...(activeCategory === "bestsellers" && { bestseller: true }),
          ...(activeCategory === "new-releases" && { newRelease: true }),
          ...(activeCategory === "award-winners" && { awardWinner: true }),
          ...(activeCategory === "new-arrivals" && { newArrival: true }),
          ...(activeCategory === "coming-soon" && { comingSoon: true }),
          ...(activeCategory === "deals" && { onSale: true }),
        };

        if (searchQuery.trim()) {
          response = await fetchBooks(filters);
        } else {
          // For all categories including 'all', use the main fetchBooks with filters
          response = await fetchBooks(filters);
        }

        if (response && response.items) {
          setBooks(response.items);
          setPagination({
            currentPage: response.pageNumber || 1,
            totalPages: response.totalPages || 1,
            totalItems: response.totalCount || 0,
            pageSize: response.pageSize || 12,
          });

          if (activeCategory === "all" && !searchQuery) {
            try {
              const saleResponse = await fetchOnSale(1, 4);
              setOnSaleBooks(saleResponse.items || []);
            } catch (saleErr) {
              console.error("Failed to load sale books:", saleErr);
              setOnSaleBooks([]);
            }
          } else {
            setOnSaleBooks([]);
          }
        } else {
          setBooks([]);
          setOnSaleBooks([]);
        }
      } catch (err) {
        console.error("Failed to load books:", err);
        setError(`Failed to load books: ${err.message}`);
        setBooks([]);
        setOnSaleBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [
    apiAvailable,
    activeCategory,
    sortBy,
    searchQuery,
    pagination.currentPage,
    pagination.pageSize,
    activeFilters,
  ]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      window.scrollTo(0, 0);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRetry = () => {
    setRetryCount((prevCount) => prevCount + 1);
    setLoading(true);
    setApiAvailable(true);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setSearchQuery("");
  };

  //filter application
  const handleApplyFilters = (filterData) => {
    console.log("Applying filters with data:", filterData);

    // Apply all filters directly without conditional checks
    setActiveFilters({
      minPrice: filterData.minPrice,
      maxPrice: filterData.maxPrice,
      selectedGenres: filterData.selectedGenres,
      selectedAuthors: filterData.selectedAuthors,
      selectedFormats: filterData.selectedFormats,
      selectedLanguages: filterData.selectedLanguages,
      selectedPublishers: filterData.selectedPublishers,
      ratingFilter: filterData.ratingFilter,
    });

    // Reset to page 1 when applying new filters
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setShowFilters(false);
  };

  //adding to cart
  const handleAddToCart = (book) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = `/login?returnUrl=${encodeURIComponent(
        window.location.pathname
      )}&action=addToCart&bookId=${book.id}`;
      return;
    }

    setSelectedBook(book);
    setQuantity(1);
    setShowQuantityModal(true);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && selectedBook) {
      setQuantity(Math.max(1, Math.min(selectedBook.stockQuantity, value)));
    }
  };

  const incrementQuantity = () => {
    if (selectedBook) {
      setQuantity((prev) => Math.min(selectedBook.stockQuantity, prev + 1));
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const closeQuantityModal = () => {
    setShowQuantityModal(false);
    setSelectedBook(null);
  };

  const handleAddToCartConfirm = async () => {
    if (
      !selectedBook ||
      quantity < 1 ||
      quantity > selectedBook.stockQuantity
    ) {
      return;
    }

    try {
      setIsAddingToCart(true);
      console.log(
        `Adding book ID: ${selectedBook.id} to cart with quantity ${quantity}`
      );

      //API to add to cart
      const result = await addToCart(selectedBook.id, quantity);

      showToast(
        `Added ${quantity} "${selectedBook.title}" to your cart!`,
        "success"
      );

      //update cart in context
      if (fetchCart) {
        fetchCart();
      }

      //close the modal
      closeQuantityModal();
    } catch (error) {
      console.error("Failed to add to cart:", error);

      showToast(
        error.message === "Authentication required"
          ? "Please log in to add items to your cart"
          : `Failed to add "${selectedBook.title}" to cart: ${error.message}`,
        "error"
      );

      if (error.message === "Authentication required") {
        window.location.href = `/login?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}&action=addToCart&bookId=${selectedBook.id}`;
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="book-listing-container">
      <header className="book-listing-header">
        <div className="logo-container">
          <BookIcon size={32} />
          <h1>Inkspire</h1>
        </div>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            console.log("Search query changed:", query);
            setSearchQuery(query);
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
          }}
        />
        <button className="filter-button" onClick={toggleFilters}>
          <SlidersHorizontal size={20} />
          <span>Filters</span>
        </button>
      </header>

      <div className="book-listing-content">
        {showFilters && (
          <FilterSidebar
            setShowFilters={setShowFilters}
            initialFilters={{
              minPrice: activeFilters.minPrice,
              maxPrice: activeFilters.maxPrice,
              selectedGenres: activeFilters.selectedGenres,
              selectedAuthors: activeFilters.selectedAuthors,
              selectedFormats: activeFilters.selectedFormats,
              selectedLanguages: activeFilters.selectedLanguages,
              selectedPublishers: activeFilters.selectedPublishers,
              ratingFilter: activeFilters.ratingFilter,
            }}
            onApplyFilters={handleApplyFilters}
          />
        )}

        <main className="book-listing-main">
          <div className="controls-container">
            <CategoryTabs
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onCategoryChange={handleCategoryChange}
            />
            <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {/* active filters summary */}
          {(activeFilters.minPrice > 0 ||
            activeFilters.maxPrice < MAX_PRICE ||
            activeFilters.selectedGenres.length > 0 ||
            activeFilters.selectedAuthors.length > 0 ||
            activeFilters.selectedFormats.length > 0 ||
            activeFilters.selectedLanguages.length > 0 ||
            activeFilters.selectedPublishers.length > 0 ||
            activeFilters.ratingFilter > 0) && (
            <div className="active-filters-summary">
              <h3>Active Filters:</h3>
              <div className="filter-tags">
                {(activeFilters.minPrice > 0 ||
                  activeFilters.maxPrice < MAX_PRICE) && (
                  <span className="filter-tag">
                    Price: ${activeFilters.minPrice} - ${activeFilters.maxPrice}
                    <button
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          minPrice: 0,
                          maxPrice: MAX_PRICE,
                        })
                      }
                    >
                      ✕
                    </button>
                  </span>
                )}

                {activeFilters.ratingFilter > 0 && (
                  <span className="filter-tag">
                    Rating: {activeFilters.ratingFilter}+ stars
                    <button
                      onClick={() =>
                        setActiveFilters({ ...activeFilters, ratingFilter: 0 })
                      }
                    >
                      ✕
                    </button>
                  </span>
                )}

                {activeFilters.selectedGenres.map((genre) => (
                  <span key={genre} className="filter-tag">
                    Genre: {genre}
                    <button
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          selectedGenres: activeFilters.selectedGenres.filter(
                            (g) => g !== genre
                          ),
                        })
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}

                {activeFilters.selectedAuthors.map((author) => (
                  <span key={author} className="filter-tag">
                    Author: {author}
                    <button
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          selectedAuthors: activeFilters.selectedAuthors.filter(
                            (a) => a !== author
                          ),
                        })
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}

                {activeFilters.selectedFormats.map((format) => (
                  <span key={format} className="filter-tag">
                    Format: {format}
                    <button
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          selectedFormats: activeFilters.selectedFormats.filter(
                            (f) => f !== format
                          ),
                        })
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}

                {activeFilters.selectedLanguages.map((language) => (
                  <span key={language} className="filter-tag">
                    Language: {language}
                    <button
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          selectedLanguages:
                            activeFilters.selectedLanguages.filter(
                              (l) => l !== language
                            ),
                        })
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}

                {activeFilters.selectedPublishers.map((publisher) => (
                  <span key={publisher} className="filter-tag">
                    Publisher: {publisher}
                    <button
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          selectedPublishers:
                            activeFilters.selectedPublishers.filter(
                              (p) => p !== publisher
                            ),
                        })
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}

                <button
                  className="clear-all-filters"
                  onClick={() =>
                    setActiveFilters({
                      minPrice: 0,
                      maxPrice: MAX_PRICE,
                      selectedGenres: [],
                      selectedAuthors: [],
                      selectedFormats: [],
                      selectedLanguages: [],
                      selectedPublishers: [],
                      ratingFilter: 0,
                    })
                  }
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading books...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <AlertTriangle size={48} color="#e74c3c" />
              <h3>Connection Error</h3>
              <p>{error}</p>
              <div className="error-details">
                <p>Possible solutions:</p>
                <ul>
                  <li>Make sure your .NET backend API server is running</li>
                  <li>Verify the API URL is correct in bookApiService.js</li>
                  <li>Check network connectivity and CORS settings</li>
                  <li>Look for error messages in your server logs</li>
                </ul>
              </div>
              <button className="retry-button" onClick={handleRetry}>
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {activeCategory === "deals" && onSaleBooks.length > 0 && (
                <section className="sale-section">
                  <h2>On Sale Books</h2>
                  <div className="books-grid">
                    {onSaleBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onAddToCart={() => handleAddToCart(book)}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section className="all-books-section">
                <h2>
                  {activeCategory === "all"
                    ? "All Books"
                    : `${activeCategory
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())} (${
                        pagination.totalItems
                      })`}
                </h2>

                {books.length > 0 ? (
                  <>
                    <div className="books-grid">
                      {books.map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          onAddToCart={() => handleAddToCart(book)}
                          onBookmarkToggle={handleBookmarkToggle}
                        />
                      ))}
                    </div>

                    {pagination.totalPages > 1 && (
                      <div className="pagination-controls">
                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={pagination.currentPage === 1}
                          className="pagination-button"
                        >
                          Previous
                        </button>

                        <div className="pagination-info">
                          Page {pagination.currentPage} of{" "}
                          {pagination.totalPages}
                        </div>

                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage >= pagination.totalPages
                          }
                          className="pagination-button"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-books-message">
                    <p>No books found matching your criteria.</p>
                    {searchQuery && (
                      <p>Try adjusting your search or filter settings.</p>
                    )}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Quantity Modal */}
      {showQuantityModal && selectedBook && (
        <div className="quantity-modal-overlay" onClick={closeQuantityModal}>
          <div className="quantity-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeQuantityModal}>
              <X size={20} />
            </button>
            <h3>Select Quantity</h3>
            <p>{selectedBook.title}</p>

            <div className="quantity-selector">
              <button onClick={decrementQuantity} disabled={quantity <= 1}>
                -
              </button>
              <input
                type="number"
                min="1"
                max={selectedBook.stockQuantity}
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button
                onClick={incrementQuantity}
                disabled={quantity >= selectedBook.stockQuantity}
              >
                +
              </button>
            </div>

            <p className="stock-info">{selectedBook.stockQuantity} available</p>

            <button
              className="confirm-add-to-cart"
              onClick={handleAddToCartConfirm}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "Adding..." : `Add ${quantity} to Cart`}
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <p>{toast.message}</p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookListing;
