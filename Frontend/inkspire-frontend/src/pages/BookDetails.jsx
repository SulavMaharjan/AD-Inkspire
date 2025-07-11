import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, X } from "lucide-react";
import "../styles/BookDetails.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Landing/Footer";
import { fetchBookById } from "../context/bookApiService";
import { CartContext } from "../context/CartContext";
import { addToCart } from "../context/cartService";
import { reviewService } from "../context/authService";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useContext(CartContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Quantity modal state
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

  // Check if book is already bookmarked when component mounts
  const checkBookmarkStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `https://localhost:7039/api/bookmarks/check/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const isBookmarked = await response.json();
        setIsBookmarked(isBookmarked);
      }
    } catch (error) {
      console.error(
        `Failed to check bookmark status for book ID: ${id}`,
        error
      );
    }
  };

  // Fetch book reviews
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const bookReviews = await reviewService.getBookReviews(id);
      setReviews(bookReviews);
      
      // Check if user has already reviewed this book
      const userReviews = await reviewService.getUserReviews();
      const existingReview = userReviews.find(review => review.bookId === id);
      if (existingReview) {
        setUserReview(existingReview);
      }
      
      // Check if user can review this book
      const canReview = await reviewService.checkReviewEligibility(id);
      setCanReview(canReview && !existingReview);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        setLoading(true);
        const bookData = await fetchBookById(id);
        setBook(bookData);
        setLoading(false);

        // Check bookmark status after book data is loaded
        checkBookmarkStatus();
        
        // Fetch reviews
        await fetchReviews();
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
        setLoading(false);
      }
    };

    if (id) {
      getBookDetails();
    }
  }, [id]);

  const getCoverImageUrl = (coverImagePath) => {
    if (!coverImagePath) {
      return "/placeholder-book-cover.jpg";
    }

    if (coverImagePath.startsWith("http")) {
      return coverImagePath;
    }

    const normalizedPath = coverImagePath.startsWith("/")
      ? coverImagePath
      : `/${coverImagePath}`;

    return `https://localhost:7039${normalizedPath}`;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (book && value > 0 && value <= book.stockQuantity) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (book) {
      setQuantity((prev) => Math.min(book.stockQuantity, prev + 1));
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCartClick = () => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      // Navigate to login page with return info
      window.location.href = `/login?returnUrl=${encodeURIComponent(
        window.location.pathname
      )}&action=addToCart&bookId=${book.id}`;
      return;
    }

    setShowQuantityModal(true);
    setQuantity(1);
  };

  const handleAddToCartConfirm = async () => {
    if (!book || quantity < 1 || quantity > book.stockQuantity) {
      return;
    }

    try {
      setIsAddingToCart(true);
      console.log(
        `Adding book ID: ${book.id} to cart with quantity ${quantity}`
      );

      // Call the API to add to cart
      const result = await addToCart(book.id, quantity);

      // Show success message
      showToast(`Added ${quantity} "${book.title}" to your cart!`, "success");

      // Update cart in context
      if (fetchCart) {
        fetchCart();
      }

      // Close the modal
      setShowQuantityModal(false);
    } catch (error) {
      console.error("Failed to add to cart:", error);

      // Show error message
      showToast(
        error.message === "Authentication required"
          ? "Please log in to add items to your cart"
          : `Failed to add "${book.title}" to cart: ${error.message}`,
        "error"
      );

      // If authentication error, redirect to login
      if (error.message === "Authentication required") {
        window.location.href = `/login?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}&action=addToCart&bookId=${book.id}`;
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if not authenticated
      navigate(
        `/login?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}&action=bookmark&bookId=${id}`
      );
      return;
    }

    setBookmarkLoading(true);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(
          `https://localhost:7039/api/bookmarks/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setIsBookmarked(false);
          showToast(`"${book.title}" removed from your bookmarks`, "success");
        } else {
          const errorData = await response.json();
          console.error(`Failed to remove bookmark: ${errorData}`);
          showToast(`Failed to remove from bookmarks`, "error");
        }
      } else {
        // Add bookmark
        const response = await fetch("https://localhost:7039/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId: id,
          }),
        });

        if (response.ok) {
          setIsBookmarked(true);
          showToast(`"${book.title}" added to your bookmarks`, "success");
        } else {
          const errorData = await response.json();
          console.error(`Failed to add bookmark: ${errorData}`);
          showToast(`Failed to bookmark`, "error");
        }
      }
    } catch (error) {
      console.error(`Bookmark operation failed for book ID: ${id}`, error);
      showToast(`Bookmark operation failed: ${error.message}`, "error");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      showToast("Please select a rating", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      await reviewService.createReview(id, reviewRating, reviewComment);
      showToast("Review submitted successfully!", "success");
      
      await fetchReviews();
      
      setReviewRating(0);
      setReviewComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast(`Failed to submit review: ${error.message}`, "error");
    }
  };

  if (loading) {
    return (
      <div className="bdp-container">
        <Navbar />
        <div className="bdp-book-container">
          <div className="bdp-loading">Loading book details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bdp-container">
        <Navbar />
        <div className="bdp-book-container">
          <div className="bdp-error">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bdp-container">
        <Navbar />
        <div className="bdp-book-container">
          <div className="bdp-error">Book not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage =
    book.discountPercentage ||
    (book.isOnSale && book.price && book.discountedPrice)
      ? Math.round(((book.price - book.discountedPrice) / book.price) * 100)
      : 0;

  return (
    <div className="bdp-container">
      <Navbar />
      <div className="bdp-book-container">
        <div className="bdp-wrapper">
          <div className="bdp-image-section">
            <div className="bdp-image-container">
              <img
                src={getCoverImageUrl(book.coverImagePath)}
                alt={book.title}
                className="bdp-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${book.coverImagePath}`);
                  e.target.src = "/placeholder-book-cover.jpg";
                }}
              />
              <div className="bdp-badges-container">
                {book.isAwardWinner && (
                  <span className="bdp-award-badge">AWARD WINNER</span>
                )}
                {book.isOnSale && discountPercentage > 0 && (
                  <span className="bdp-sale-badge">{discountPercentage}% OFF</span>
                )}
              </div>

              <button
                className={`bdp-bookmark-button ${
                  isBookmarked ? "bdp-bookmarked" : ""
                } ${bookmarkLoading ? "bdp-loading" : ""}`}
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                aria-label={
                  isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
                }
              >
                <Heart size={24} fill={isBookmarked ? "#8B2131" : "none"} />
              </button>
            </div>
          </div>

          <div className="bdp-info-section">
            <h1 className="bdp-title">{book.title}</h1>
            <h2 className="bdp-author">by {book.author}</h2>

            <div className="bdp-rating">
              <div className="bdp-stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(book.averageRating || 0)
                        ? "bdp-star bdp-filled"
                        : "bdp-star"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="bdp-rating-value">
                {book.averageRating?.toFixed(1) || "N/A"}
              </span>
              <span className="bdp-review-count">({reviews.length} reviews)</span>
            </div>

            <div className="bdp-price-section">
              {book.discountedPrice ? (
                <>
                  <span className="bdp-original-price">
                    ${Number(book.price).toFixed(2)}
                  </span>
                  <span className="bdp-sale-price">
                    ${Number(book.discountedPrice).toFixed(2)}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="bdp-discount-percentage">
                      Save {discountPercentage}%
                    </span>
                  )}
                </>
              ) : (
                <span className="bdp-price">
                  ${Number(book.price || 0).toFixed(2)}
                </span>
              )}
            </div>

            <div className="bdp-availability">
              <span
                className={`bdp-availability-status ${
                  book.stockQuantity > 0 ? "bdp-in-stock" : "bdp-out-of-stock"
                }`}
              >
                {book.stockQuantity > 0
                  ? `In Stock (${book.stockQuantity} available)`
                  : "Out of Stock"}
              </span>
            </div>

            <div className="bdp-purchase-options">
              <div className="bdp-quantity-selector">
                <label htmlFor="bdp-quantity">Quantity:</label>
                <input
                  type="number"
                  id="bdp-quantity"
                  name="bdp-quantity"
                  min="1"
                  max={book.stockQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={book.stockQuantity <= 0}
                />
              </div>
              <button
                className="bdp-add-to-cart-button"
                onClick={handleAddToCartClick}
                disabled={book.stockQuantity <= 0}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="bdp-details">
              <h3>Book Details</h3>
              <div className="bdp-details-grid">
                <div className="bdp-detail-item">
                  <span className="bdp-detail-label">Format:</span>
                  <span className="bdp-detail-value">
                    {book.format || "Not specified"}
                  </span>
                </div>
                <div className="bdp-detail-item">
                  <span className="bdp-detail-label">ISBN:</span>
                  <span className="bdp-detail-value">
                    {book.isbn || "Not available"}
                  </span>
                </div>
                <div className="bdp-detail-item">
                  <span className="bdp-detail-label">Publisher:</span>
                  <span className="bdp-detail-value">
                    {book.publisher || "Not specified"}
                  </span>
                </div>
                <div className="bdp-detail-item">
                  <span className="bdp-detail-label">Publication Date:</span>
                  <span className="bdp-detail-value">
                    {book.publicationDate || "Not specified"}
                  </span>
                </div>
                <div className="bdp-detail-item">
                  <span className="bdp-detail-label">Language:</span>
                  <span className="bdp-detail-value">
                    {book.language || "Not specified"}
                  </span>
                </div>
                <div className="bdp-detail-item">
                  <span className="bdp-detail-label">Pages:</span>
                  <span className="bdp-detail-value">
                    {book.pages || "Not specified"}
                  </span>
                </div>
                <div className="bdp-detail-item">
                  <span className="bdp-detail-label">Genre:</span>
                  <span className="bdp-detail-value">
                    {book.genres
                      ? Array.isArray(book.genres)
                        ? book.genres.join(", ")
                        : book.genres
                      : "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bdp-description">
              <h3>Description</h3>
              <p>{book.description || "No description available."}</p>
            </div>
          </div>
        </div>

        <div className="bdp-reviews-section">
          <h2>Review Average</h2>
          <div className="bdp-reviews-summary">
            <div className="bdp-average-rating">
              {book.averageRating?.toFixed(1) || "0.0"} out of 5
            </div>
            <div className="bdp-total-reviews">{reviews.length} reviews</div>
          </div>

          {reviewsLoading ? (
            <div className="bdp-loading-reviews">Loading reviews...</div>
          ) : (
            <>
              {canReview && (
                <div className="bdp-write-review">
                  <h3>Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="bdp-rating-input">
                      <label>Your Rating:</label>
                      <div className="bdp-star-selector">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < reviewRating ? "bdp-star bdp-filled" : "bdp-star"}
                            onClick={() => setReviewRating(i + 1)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bdp-comment-input">
                      <label htmlFor="bdp-review-comment">Your Review:</label>
                      <textarea
                        id="bdp-review-comment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows="4"
                      ></textarea>
                    </div>
                    <button type="submit" className="bdp-submit-review">
                      Submit Review
                    </button>
                  </form>
                </div>
              )}

              {userReview && (
                <div className="bdp-user-review">
                  <h3>Your Review</h3>
                  <div className="bdp-review-item">
                    <div className="bdp-review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < userReview.rating ? "bdp-star bdp-filled" : "bdp-star"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="bdp-review-comment">
                      <p>{userReview.comment}</p>
                    </div>
                    <div className="bdp-review-date">
                      Reviewed on {new Date(userReview.createdDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              <div className="bdp-reviews-list">
                <h3>Customer Reviews</h3>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bdp-review-item">
                      <div className="bdp-review-header">
                        <span className="bdp-reviewer-name">{review.userName}</span>
                        <span className="bdp-review-date">
                          {new Date(review.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="bdp-review-rating">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? "bdp-star bdp-filled" : "bdp-star"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="bdp-review-comment">
                        <p>{review.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bdp-no-reviews">
                    <p>No reviews yet. Be the first to review this book!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showQuantityModal && book && (
        <div
          className="bdp-quantity-modal-overlay"
          onClick={() => setShowQuantityModal(false)}
        >
          <div className="bdp-quantity-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="bdp-close-modal"
              onClick={() => setShowQuantityModal(false)}
            >
              <X size={20} />
            </button>
            <h3>Select Quantity</h3>
            <p>{book.title}</p>

            <div className="bdp-quantity-selector">
              <button onClick={decrementQuantity} disabled={quantity <= 1}>
                -
              </button>
              <input
                type="number"
                min="1"
                max={book.stockQuantity}
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button
                onClick={incrementQuantity}
                disabled={quantity >= book.stockQuantity}
              >
                +
              </button>
            </div>

            <p className="bdp-stock-info">{book.stockQuantity} available</p>

            <button
              className="bdp-confirm-add-to-cart"
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
        <div className={`bdp-toast-notification bdp-${toast.type}`}>
          <p>{toast.message}</p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookDetails;