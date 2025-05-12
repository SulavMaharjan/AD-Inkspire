import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/BookmarkedListCard.css";
import { removeBookmark } from "../../context/bookApiService";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "../../context/cartService";

export const BookmarkCard = ({ book, onRemove }) => {
  const API_BASE_URL = "https://localhost:7039";
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleRemove = async () => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to remove "${book.bookTitle}" from your bookmarks?`
      );

      if (!confirmDelete) return;

      const success = await removeBookmark(book.bookId);

      if (success) {
        onRemove(book.bookId);
      } else {
        throw new Error("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      alert("Failed to remove bookmark. Please try again.");
    }
  };

  const handleAddToCart = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}&action=addToCart&bookId=${book.bookId}`;
        return;
      }

      // Call the addToCart service
      await addToCart(book.bookId, 1); // Default quantity of 1

      alert(`"${book.bookTitle}" has been added to your cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert(`Failed to add to cart: ${error.message}`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/bookDetail/${book.bookId}`);
  };

  const getImageSrc = () => {
    if (book.coverImagePath) {
      if (book.coverImagePath.startsWith("http")) {
        return book.coverImagePath;
      }
      return `${API_BASE_URL}${book.coverImagePath}`;
    }
    return `${API_BASE_URL}/images/books/default-cover.jpg`;
  };

  return (
    <div className="book-card list">
      <div className="book-cover-container">
        <img
          src={getImageSrc()}
          alt={`Cover of ${book.bookTitle}`}
          className="book-cover"
          onError={(e) => {
            e.target.src = `${API_BASE_URL}/images/books/default-cover.jpg`;
          }}
        />
        {book.discountPercentage > 0 && (
          <span className="book-discount">-{book.discountPercentage}%</span>
        )}
      </div>

      <div className="book-info">
        <div className="book-header">
          <div>
            <h3 className="book-title">{book.bookTitle}</h3>
            <p className="book-author">by {book.author}</p>
          </div>
          <div className="book-price-container">
            {book.discountedPrice ? (
              <>
                <span className="book-price-original">
                  {formatPrice(book.price)}
                </span>
                <span className="book-price">
                  {formatPrice(book.discountedPrice)}
                </span>
              </>
            ) : (
              <span className="book-price">{formatPrice(book.price)}</span>
            )}
          </div>
        </div>

        <div className="book-details">
          <div className="book-badges">
            <span
              className={`book-availability ${
                book.inStock ? "in-stock" : "out-of-stock"
              }`}
            >
              {book.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <p className="book-date-added">Added: {formatDate(book.createdAt)}</p>
        </div>
      </div>

      <div className="book-actions">
        <button className="btn-add-to-cart" onClick={handleAddToCart}>
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
        <button className="btn-remove" onClick={handleRemove}>
          Remove
        </button>
        <button className="btn-view" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};
