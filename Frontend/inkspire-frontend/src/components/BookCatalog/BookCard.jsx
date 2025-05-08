import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/BookCard.css";

const BookCard = ({ book, onAddToCart, onBookmarkToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    title,
    author,
    price,
    discountedPrice,
    discountPercentage,
    averageRating,
    format,
    stockQuantity,
    isBestseller,
    isAwardWinner,
    coverImagePath,
    isOnSale,
  } = book;

  useEffect(() => {
    console.log(`Book ID ${id} image path:`, coverImagePath);

    // Check if book is already bookmarked when component mounts
    checkBookmarkStatus();
  }, [id]);

  // Check if the book is already bookmarked
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

  const getCoverImageUrl = () => {
    if (imageError || !coverImagePath) {
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

  const discount =
    discountPercentage || (isOnSale && price && discountedPrice)
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

  const handleBookmark = async (e) => {
    e.stopPropagation();

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
          // Call the parent component's onBookmarkToggle function
          if (onBookmarkToggle) {
            onBookmarkToggle(
              `"${title}" removed from your bookmarks`,
              "success"
            );
          }
        } else {
          const errorData = await response.json();
          console.error(`Failed to remove bookmark: ${errorData}`);
          if (onBookmarkToggle) {
            onBookmarkToggle(`Failed to remove from bookmarks`, "error");
          }
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
          // Call the parent component's onBookmarkToggle function
          if (onBookmarkToggle) {
            onBookmarkToggle(`"${title}" added to your bookmarks`, "success");
          }
        } else {
          const errorData = await response.json();
          console.error(`Failed to add bookmark: ${errorData}`);
          if (onBookmarkToggle) {
            onBookmarkToggle(`Failed to bookmark`, "error");
          }
        }
      }
    } catch (error) {
      console.error(`Bookmark operation failed for book ID: ${id}`, error);
      if (onBookmarkToggle) {
        onBookmarkToggle(
          `Bookmark operation failed: ${error.message}`,
          "error"
        );
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(book);
    }
  };

  const handleBookClick = () => {
    console.log(`Navigating to book detail page for ID: ${id}`);
    navigate(`/bookDetail/${id}`);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/bookDetail/${id}`);
  };

  const handleImageError = () => {
    console.error(
      `Failed to load image for book ID: ${id}, Path: ${coverImagePath}`
    );
    setImageError(true);
  };

  return (
    <div className="book-card" onClick={handleBookClick}>
      <div className="book-card-image-container">
        <img
          src={getCoverImageUrl()}
          alt={title}
          className="book-cover"
          onError={handleImageError}
        />

        {isOnSale && discount > 0 && (
          <div className="sale-badge">
            <span>{discount}% OFF</span>
          </div>
        )}

        {isBestseller && <div className="bestseller-badge">Bestseller</div>}
        {isAwardWinner && <div className="award-badge">Award Winner</div>}

        <button
          className={`bookmark-button ${isBookmarked ? "bookmarked" : ""} ${
            bookmarkLoading ? "loading" : ""
          }`}
          onClick={handleBookmark}
          aria-label={
            isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
          }
          disabled={bookmarkLoading}
        >
          <Heart size={18} fill={isBookmarked ? "#8B2131" : "none"} />
        </button>
      </div>

      <div className="book-card-details">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">by {author}</p>

        <div className="book-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.floor(averageRating || 0) ? "#D4AF37" : "none"}
              color="#D4AF37"
            />
          ))}
          <span className="rating-value">
            {averageRating?.toFixed(1) || "N/A"}
          </span>
        </div>

        <div className="book-format-availability">
          <span className="book-format">{format || "Paperback"}</span>
          <span
            className={`book-availability ${
              stockQuantity > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {stockQuantity > 0 ? `${stockQuantity} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="book-price-container">
          {discountedPrice ? (
            <>
              <span className="book-price">
                ${Number(discountedPrice).toFixed(2)}
              </span>
              <span className="book-original-price">
                ${Number(price).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="book-price">${Number(price || 0).toFixed(2)}</span>
          )}
        </div>

        <div className="book-card-actions">
          <button
            className="add-to-cart-button"
            onClick={handleAddToCartClick}
            disabled={stockQuantity <= 0}
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>

          <button className="view-details-button" onClick={handleViewDetails}>
            <Eye size={16} />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
