import React, { useState, useEffect } from "react";
import "../styles/BookDetails.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Landing/Footer";

const BookDetails = () => {
  // Sample book data - this would normally come from an API
  const [book, setBook] = useState({
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    ISBN: "9780525559474",
    publisher: "Viking",
    publicationDate: "2020-09-29",
    language: "English",
    format: "Hardcover",
    genre: ["Fiction", "Fantasy", "Contemporary"],
    pages: 304,
    price: 24.99,
    discount: 0,
    rating: 4.5,
    stock: 12,
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
    coverImage:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1627042661l/58613224.jpg",
    isOnSale: false,
    isNewRelease: true,
    isNewArrival: true,
    isAwardWinner: true,
    isBestseller: true,
  });

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

  // Calculate sale price if applicable
  const salePrice = book.isOnSale ? book.price * (1 - book.discount) : null;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= book.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} copy/copies of "${book.title}" to your cart`);
    // In a real app, this would send a request to the server
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
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

  return (
    <div>
      <Navbar />
      <div className="book-details-container">
        <div className="book-details-wrapper">
          <div className="book-image-section">
            <div className="book-image-container">
              <img
                src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1627042661l/58613224.jpg"
                alt={book.title}
                className="book-cover"
              />
              {/* {book.isOnSale && } */}
              <span className="sale-badge">ON SALE</span>
              {book.isNewRelease && (
                <span className="new-release-badge">NEW RELEASE</span>
              )}
              {book.isAwardWinner && (
                <span className="award-badge">AWARD WINNER</span>
              )}
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
                      i < Math.floor(book.rating) ? "star filled" : "star"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-value">{book.rating}</span>
              <span className="review-count">({reviews.length} reviews)</span>
            </div>

            <div className="book-price-section">
              {book.isOnSale ? (
                <>
                  <span className="original-price">
                    ${book.price.toFixed(2)}
                  </span>
                  <span className="sale-price">${salePrice.toFixed(2)}</span>
                  <span className="discount-percentage">
                    Save {(book.discount * 100).toFixed(0)}%
                  </span>
                </>
              ) : (
                <span className="price">${book.price.toFixed(2)}</span>
              )}
            </div>

            <div className="book-availability">
              <span
                className={`availability-status ${
                  book.stock > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                {book.stock > 0
                  ? `In Stock (${book.stock} available)`
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
                  max={book.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
              <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={book.stock === 0}
              >
                Add to Cart
              </button>
            </div>

            <div className="book-details">
              <h3>Book Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Format:</span>
                  <span className="detail-value">{book.format}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">ISBN:</span>
                  <span className="detail-value">{book.ISBN}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Publisher:</span>
                  <span className="detail-value">{book.publisher}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Publication Date:</span>
                  <span className="detail-value">{book.publicationDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Language:</span>
                  <span className="detail-value">{book.language}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pages:</span>
                  <span className="detail-value">{book.pages}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Genre:</span>
                  <span className="detail-value">{book.genre.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
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
