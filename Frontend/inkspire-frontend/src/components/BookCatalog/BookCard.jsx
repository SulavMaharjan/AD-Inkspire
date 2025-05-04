import React, { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import "../../styles/BookCard.css";

const BookCard = ({ book }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Handle potentially different property names from API
  const {
    id,
    title,
    author,
    coverImage,
    imageUrl, // API might use imageUrl instead of coverImage
    price,
    originalPrice,
    onSale,
    discountPercentage, // API might provide this directly
    rating,
    format,
    availability,
    stockQuantity, // API might use stockQuantity instead of availability
    bestseller,
    awardWinner,
  } = book;

  // Use the appropriate image property
  const bookCover = coverImage || imageUrl || "/placeholder-book-cover.jpg";

  // Use the appropriate availability property
  const stock = availability !== undefined ? availability : stockQuantity || 0;

  // Calculate discount percentage if not provided directly
  const discount =
    discountPercentage || (onSale && originalPrice && price)
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);

    // Here you could add logic to save bookmark to user profile via API
    console.log(
      `${isBookmarked ? "Removing" : "Adding"} bookmark for book ID: ${id}`
    );
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Here you would integrate with your cart API
    console.log(`Adding book ID: ${id} to cart`);
    alert(`Added ${title} to cart!`);
  };

  const handleBookClick = () => {
    // Navigate to book detail page
    console.log(`Navigating to book detail page for ID: ${id}`);
    // You could use React Router here:
    // navigate(`/books/${id}`);
  };

  return (
    <div className="book-card" onClick={handleBookClick}>
      <div className="book-card-image-container">
        <img
          src={bookCover}
          alt={title}
          className="book-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-book-cover.jpg";
          }}
        />

        {onSale && discount > 0 && (
          <div className="sale-badge">
            <span>{discount}% OFF</span>
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
              fill={i < Math.floor(rating || 0) ? "#D4AF37" : "none"}
              color="#D4AF37"
            />
          ))}
          <span className="rating-value">{rating?.toFixed(1) || "N/A"}</span>
        </div>

        <div className="book-format-availability">
          <span className="book-format">{format || "Paperback"}</span>
          <span
            className={`book-availability ${
              stock > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="book-price-container">
          <span className="book-price">${Number(price || 0).toFixed(2)}</span>
          {onSale && originalPrice && (
            <span className="book-original-price">
              ${Number(originalPrice || 0).toFixed(2)}
            </span>
          )}
        </div>

        <button
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={stock <= 0}
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default BookCard;
