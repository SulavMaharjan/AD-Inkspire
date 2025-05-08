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

  // Quantity modal state
  const [selectedBook, setSelectedBook] = useState(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Handle showing toast messages
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle bookmark toggle toast
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

  //reset pagination when category or search changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [activeCategory, searchQuery]);

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
          searchTerm: searchQuery,
          sortBy: mapSortByToApi(sortBy),
          sortAscending: sortBy === "title" || sortBy === "price-low",
        };

        //books based on active category
        switch (activeCategory) {
          case "bestsellers":
            response = await fetchBestsellers(
              pagination.currentPage,
              pagination.pageSize
            );
            break;
          case "award-winners":
            response = await fetchAwardWinners(
              pagination.currentPage,
              pagination.pageSize
            );
            break;
          case "new-releases":
            response = await fetchNewReleases(
              pagination.currentPage,
              pagination.pageSize
            );
            break;
          case "new-arrivals":
            response = await fetchNewArrivals(
              pagination.currentPage,
              pagination.pageSize
            );
            break;
          case "coming-soon":
            response = await fetchComingSoon(
              pagination.currentPage,
              pagination.pageSize
            );
            break;
          case "deals":
            response = await fetchOnSale(
              pagination.currentPage,
              pagination.pageSize
            );
            break;
          default:
            response = await fetchBooks(filters);
            break;
        }

        setBooks(response.items || []);
        setPagination({
          currentPage: response.pageNumber || 1,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
          pageSize: response.pageSize || 12,
        });

        if (activeCategory === "all" && !searchQuery) {
          const saleResponse = await fetchOnSale(1, 4);
          setOnSaleBooks(saleResponse.items || []);
        } else {
          setOnSaleBooks([]);
        }
      } catch (err) {
        console.error("Failed to load books:", err);

        if (
          err.message.includes("Failed to connect") ||
          err.message.includes("timed out") ||
          err.message.includes("Network Error")
        ) {
          setApiAvailable(false);
          setError(
            "Cannot connect to the book service. Please ensure the backend service is running."
          );
        } else {
          setError(`Failed to load books: ${err.message}`);
        }

        setBooks([]);
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
  ]);

  const mapSortByToApi = (sortOption) => {
    switch (sortOption) {
      case "title":
        return "Title";
      case "publication-date":
        return "PublicationDate";
      case "price-low":
      case "price-high":
        return "Price";
      case "popularity":
      default:
        return "Popularity";
    }
  };

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

  // Handle adding to cart
  const handleAddToCart = (book) => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      // Navigate to login page with return info
      window.location.href = `/login?returnUrl=${encodeURIComponent(
        window.location.pathname
      )}&action=addToCart&bookId=${book.id}`;
      return;
    }

    // Set selected book and show modal
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

      // Call the API to add to cart
      const result = await addToCart(selectedBook.id, quantity);

      // Show success message
      showToast(
        `Added ${quantity} "${selectedBook.title}" to your cart!`,
        "success"
      );

      // Update cart in context
      if (fetchCart) {
        fetchCart();
      }

      // Close the modal
      closeQuantityModal();
    } catch (error) {
      console.error("Failed to add to cart:", error);

      // Show error message
      showToast(
        error.message === "Authentication required"
          ? "Please log in to add items to your cart"
          : `Failed to add "${selectedBook.title}" to cart: ${error.message}`,
        "error"
      );

      // If authentication error, redirect to login
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
              onCategoryChange={handleCategoryChange}
            />
            <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
          </div>

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
