import React, { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import "../../styles/BookCard.css";

const BookCard = ({ book }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    title,
    author,
    coverImage,
    price,
    originalPrice,
    onSale,
    discount,
    rating,
    format,
    availability,
    bestseller,
    awardWinner,
  } = book;

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    alert(`Added ${title} to cart!`);
  };

  // Calculate discount percentage if not provided
  const discountPercentage =
    discount || Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <div className="book-card">
      <div className="book-card-image-container">
        <img src={coverImage} alt={title} className="book-cover" />

        {onSale && (
          <div className="sale-badge">
            <span>{discountPercentage}% OFF</span>
          </div>
        )}

        {bestseller && <div className="bestseller-badge">Bestseller</div>}
        {awardWinner && <div className="award-badge">Award Winner</div>}

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
              fill={i < Math.floor(rating) ? "#D4AF37" : "none"}
              color="#D4AF37"
            />
          ))}
          <span className="rating-value">{rating}</span>
        </div>

        <div className="book-format-availability">
          <span className="book-format">{format}</span>
          <span
            className={`book-availability ${
              availability > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {availability > 0 ? `${availability} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="book-price-container">
          <span className="book-price">${price.toFixed(2)}</span>
          {onSale && (
            <span className="book-original-price">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={availability <= 0}
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default BookCard;
