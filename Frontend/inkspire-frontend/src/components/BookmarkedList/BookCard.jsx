import React from 'react';
import '../../styles/BookmarkedListCard.css';

export const BookCard = ({ book, isSelected, onSelect, onRemove, view }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className={`book-card ${view} ${isSelected ? 'selected' : ''}`}>
      <div className="book-select">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={onSelect}
          aria-label={`Select ${book.title}`}
        />
      </div>
      
      {view === 'grid' ? (
        // Grid view
        <>
          <div className="book-cover-container">
            <img 
              src={book.coverImage} 
              alt={`Cover of ${book.title}`} 
              className="book-cover"
            />
            {book.discountPercentage > 0 && (
              <span className="book-discount">-{book.discountPercentage}%</span>
            )}
            {book.format === 'signed' && (
              <span className="book-badge signed">Signed</span>
            )}
            {book.format === 'limited' && (
              <span className="book-badge limited">Limited</span>
            )}
          </div>
          
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>
            
            <div className="book-price-container">
              {book.originalPrice !== book.price ? (
                <>
                  <span className="book-price-original">{formatPrice(book.originalPrice)}</span>
                  <span className="book-price">{formatPrice(book.price)}</span>
                </>
              ) : (
                <span className="book-price">{formatPrice(book.price)}</span>
              )}
            </div>
            
            <div className="book-format-availability">
              <span className="book-format">{book.format}</span>
              <span className={`book-availability ${book.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {book.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <p className="book-date-added">Added: {formatDate(book.dateAdded)}</p>
            
            <div className="book-actions">
              <button className="btn-remove" onClick={onRemove}>
                Remove
              </button>
              <button className="btn-view">View Details</button>
            </div>
          </div>
        </>
      ) : (
        // List view
        <>
          <div className="book-cover-container">
            <img 
              src={book.coverImage} 
              alt={`Cover of ${book.title}`} 
              className="book-cover"
            />
            {book.discountPercentage > 0 && (
              <span className="book-discount">-{book.discountPercentage}%</span>
            )}
          </div>
          
          <div className="book-info">
            <div className="book-header">
              <div>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
              </div>
              <div className="book-price-container">
                {book.originalPrice !== book.price ? (
                  <>
                    <span className="book-price-original">{formatPrice(book.originalPrice)}</span>
                    <span className="book-price">{formatPrice(book.price)}</span>
                  </>
                ) : (
                  <span className="book-price">{formatPrice(book.price)}</span>
                )}
              </div>
            </div>
            
            <div className="book-details">
              <div className="book-badges">
                {book.format === 'signed' && (
                  <span className="book-badge signed">Signed</span>
                )}
                {book.format === 'limited' && (
                  <span className="book-badge limited">Limited</span>
                )}
                <span className="book-format">{book.format}</span>
                <span className={`book-availability ${book.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {book.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <p className="book-genre">{book.genre}</p>
              <p className="book-date-added">Added: {formatDate(book.dateAdded)}</p>
            </div>
          </div>
          
          <div className="book-actions">
            <button className="btn-remove" onClick={onRemove}>
              Remove
            </button>
            <button className="btn-view">View Details</button>
          </div>
        </>
      )}
    </div>
  );
};