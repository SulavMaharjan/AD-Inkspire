import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/BookmarkedListCard.css";
import { removeBookmark } from "../../context/bookApiService";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "../../context/cartService";

export const BookmarkCard = ({ book, onRemove }) => {
  const API_BASE_URL = "https://localhost:7039";
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);

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
      setIsRemoving(true);
      const result = await removeBookmark(book?.bookId);

      if (result === true) {
        onRemove(book?.bookId);
      }
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}&action=addToCart&bookId=${book.bookId}`;
        return;
      }

      await addToCart(book.bookId, 1);
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
          <p className="book-date-added">Added: {formatDate(book.createdAt)}</p>
        </div>
      </div>

      <div className="book-actions">
        <button className="btn-add-to-cart" onClick={handleAddToCart}>
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
        <button
          className={`btn-remove ${isRemoving ? "loading" : ""}`}
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? "Removing..." : "Remove"}
        </button>
        <button className="btn-view" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};
