import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/BookDetails.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Landing/Footer";
import { fetchBookById } from "../context/bookApiService"; // Assuming this is where your API functions are

const BookDetails = () => {
  const { id } = useParams(); // Get book ID from URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState([
    {
      id: 1,
      username: "BookLover42",
      rating: 5,
      comment: "This book changed my perspective on life!",
      date: "2024-03-15",
    },
    {
      id: 2,
      username: "LiteraryExplorer",
      rating: 4,
      comment: "Beautiful story with deep meaning. Highly recommended.",
      date: "2024-02-20",
    },
  ]);
  
  // Fetch book details when component mounts or ID changes
  useEffect(() => {
    const getBookDetails = async () => {
      try {
        setLoading(true);
        const bookData = await fetchBookById(id);
        setBook(bookData);
        setLoading(false);
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

  // Handle image retrieval, similar to BookCard component
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

  const handleAddToCart = () => {
    if (book) {
      alert(`Added ${quantity} copy/copies of "${book.title}" to your cart`);
      // In a real app, this would send a request to the server
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      alert("Please select a rating");
      return;
    }
    
    const newReview = {
      id: reviews.length + 1,
      username: "CurrentUser", // In a real app, this would be the logged-in user
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split("T")[0],
    };

    setReviews([newReview, ...reviews]);
    setReviewRating(0);
    setReviewComment("");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="book-details-container">
          <div className="loading">Loading book details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="book-details-container">
          <div className="error">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <Navbar />
        <div className="book-details-container">
          <div className="error">Book not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate discount percentage if not directly provided
  const discountPercentage = book.discountPercentage || 
    (book.isOnSale && book.price && book.discountedPrice) ? 
      Math.round(((book.price - book.discountedPrice) / book.price) * 100) : 0;

  return (
    <div>
      <Navbar />
      <div className="book-details-container">
        <div className="book-details-wrapper">
          <div className="book-image-section">
            <div className="book-image-container">
              <img
                src={getCoverImageUrl(book.coverImagePath)}
                alt={book.title}
                className="bookDetail-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${book.coverImagePath}`);
                  e.target.src = "/placeholder-book-cover.jpg";
                }}
              />
              <div className="badges-container">
                {book.isOnSale && discountPercentage > 0 && (
                  <span className="sale-badge">{discountPercentage}% OFF</span>
                )}
                {book.isNewRelease && (
                  <span className="new-release-badge">NEW</span>
                )}
                {book.isAwardWinner && (
                  <span className="award-badge">AWARD</span>
                )}
                {book.isBestseller && (
                  <span className="bestseller-badge">BESTSELLER</span>
                )}
              </div>
            </div>
          </div>

          <div className="book-info-section">
            <h1 className="book-title">{book.title}</h1>
            <h2 className="book-author">by {book.author}</h2>

            <div className="book-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(book.averageRating || 0) ? "star filled" : "star"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-value">{book.averageRating?.toFixed(1) || "N/A"}</span>
              <span className="review-count">({reviews.length} reviews)</span>
            </div>

            <div className="book-price-section">
              {book.discountedPrice ? (
                <>
                  <span className="original-price">
                    ${Number(book.price).toFixed(2)}
                  </span>
                  <span className="sale-price">${Number(book.discountedPrice).toFixed(2)}</span>
                  {discountPercentage > 0 && (
                    <span className="discount-percentage">
                      Save {discountPercentage}%
                    </span>
                  )}
                </>
              ) : (
                <span className="price">${Number(book.price || 0).toFixed(2)}</span>
              )}
            </div>

            <div className="book-availability">
              <span
                className={`availability-status ${
                  book.stockQuantity > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                {book.stockQuantity > 0
                  ? `In Stock (${book.stockQuantity} available)`
                  : "Out of Stock"}
              </span>
            </div>

            <div className="purchase-options">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={book.stockQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={book.stockQuantity <= 0}
                />
              </div>
              <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={book.stockQuantity <= 0}
              >
                Add to Cart
              </button>
            </div>

            <div className="book-details">
              <h3>Book Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Format:</span>
                  <span className="detail-value">{book.format || "Not specified"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">ISBN:</span>
                  <span className="detail-value">{book.isbn || "Not available"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Publisher:</span>
                  <span className="detail-value">{book.publisher || "Not specified"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Publication Date:</span>
                  <span className="detail-value">{book.publicationDate || "Not specified"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Language:</span>
                  <span className="detail-value">{book.language || "Not specified"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pages:</span>
                  <span className="detail-value">{book.pages || "Not specified"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Genre:</span>
                  <span className="detail-value">
                    {book.genres ? (Array.isArray(book.genres) ? book.genres.join(", ") : book.genres) : "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description || "No description available."}</p>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          <div className="write-review">
            <h3>Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="rating-input">
                <label>Your Rating:</label>
                <div className="star-selector">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < reviewRating ? "star filled" : "star"}
                      onClick={() => setReviewRating(i + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="comment-input">
                <label htmlFor="review-comment">Your Review:</label>
                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="submit-review">
                Submit Review
              </button>
            </form>
          </div>

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">{review.username}</span>
                  <span className="review-date">{review.date}</span>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < review.rating ? "star filled" : "star"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="review-comment">
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookDetails;