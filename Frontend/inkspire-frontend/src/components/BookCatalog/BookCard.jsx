import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/BookCard.css";

const BookCard = ({ book, onAddToCart }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);
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
  }, [id, coverImagePath]);

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

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    console.log(
      `${isBookmarked ? "Removing" : "Adding"} bookmark for book ID: ${id}`
    );
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
          className={`bookmark-button ${isBookmarked ? "bookmarked" : ""}`}
          onClick={handleBookmark}
          aria-label={
            isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
          }
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
          
          <button
            className="view-details-button"
            onClick={handleViewDetails}
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;