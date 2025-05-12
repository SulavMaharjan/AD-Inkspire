import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../styles/BookManagement.css";

const BookManagement = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info' 
  });

  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    author: '',
    publisher: '',
    publicationDate: '',
    price: 0,
    stockQuantity: 0,
    genre: '',
    language: '',
    format: '',
    description: '',
    availableInLibrary: false,
    isBestseller: false,
    isAwardWinner: false,
    coverImagePath: null
  });

  const API_BASE_URL = 'https://localhost:7039'; 

  const getAuthToken = () => {
    let authToken = token;
    
    if (!authToken) {
      authToken = localStorage.getItem('token');
    }
    
    return authToken;
  };

  const showNotification = (message, type = 'info') => {
    setNotification({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 5000);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      
      const response = await fetch(`${API_BASE_URL}/api/Books/getbooks?${params}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch books: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userRole = currentUser?.role || localStorage.getItem("role");
    
    if (!userRole || 
        (userRole !== "SuperAdmin" && userRole !== "Staff")) {
      navigate('/unauthorized');
      return;
    }
    
    fetchBooks();
  }, [currentUser, navigate, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        coverImagePath: file
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      isbn: '',
      author: '',
      publisher: '',
      publicationDate: '',
      price: 0,
      stockQuantity: 0,
      genre: '',
      language: '',
      format: '',
      description: '',
      availableInLibrary: false,
      isBestseller: false,
      isAwardWinner: false,
      coverImagePath: null
    });
    setEditMode(false);
    setCurrentBook(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleEditBook = (book) => {
    const formattedDate = book.publicationDate ? book.publicationDate.split('T')[0] : '';
    
    setFormData({
      title: book.title || '',
      isbn: book.isbn || '',
      author: book.author || '',
      publisher: book.publisher || '',
      publicationDate: formattedDate,
      price: book.price || 0,
      stockQuantity: book.stockQuantity || 0,
      genre: book.genre || '',
      language: book.language || '',
      format: book.format || '',
      description: book.description || '',
      availableInLibrary: book.availableInLibrary || false,
      isBestseller: book.isBestseller || false,
      isAwardWinner: book.isAwardWinner || false,
      coverImagePath: null,
      existingCoverImagePath: book.coverImagePath
    });
    
    setEditMode(true);
    setCurrentBook(book);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataObj = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'coverImagePath') {
          formDataObj.append(key, formData[key]);
        }
      });
  
      if (formData.coverImagePath instanceof File) {
        formDataObj.append('coverImagePath', formData.coverImagePath);
      } else if (currentBook?.coverImagePath) {
        formDataObj.append('existingCoverImagePath', currentBook.coverImagePath);
      }
  
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
  
      const response = await fetch(`${API_BASE_URL}/api/Books/${currentBook.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataObj
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update book: ${response.status} ${errorText}`);
      }
  
      fetchBooks();
      setShowForm(false);
      resetForm();
      showNotification('Book updated successfully', 'success');
      
    } catch (err) {
      setError(err.message);
      console.error('Error updating book:', err);
      showNotification(`Failed to update book: ${err.message}`, 'error');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/Books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete book: ${response.status} ${errorText}`);
      }

      fetchBooks();
      showNotification("Book deleted successfully", 'success');
      
    } catch (err) {
      setError(err.message);
      console.error('Error deleting book:', err);
      showNotification(`Failed to delete book: ${err.message}`, 'error');
    }
  };

  const handleAddDiscount = async (id) => {
    navigate(`/admin/books/${id}/discount`);
  };

  const handleRemoveDiscount = async (id) => {
    if (!window.confirm('Are you sure you want to remove this discount?')) {
      return;
    }
    
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/Books/${id}/discount`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove discount: ${response.status} ${errorText}`);
      }

      fetchBooks();
      showNotification("Discount removed successfully", 'success');
      
    } catch (err) {
      setError(err.message);
      console.error('Error removing discount:', err);
      showNotification(`Failed to remove discount: ${err.message}`, 'error');
    }
  };

  const addNewBook = () => {
    navigate('/admin/books/add');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bm-container">
      {notification.show && (
        <div className={`bm-notification bm-${notification.type}`}>
          <span className="bm-notification-message">{notification.message}</span>
          <button 
            className="bm-notification-close"
            onClick={() => setNotification(prev => ({...prev, show: false}))}
          >
            &times;
          </button>
        </div>
      )}

      <div className="bm-header">
        <h1>Book Management</h1>
        <button className="bm-btn-primary" onClick={addNewBook}>
          Add New Book
        </button>
      </div>
      
      <div className="bm-search-container">
        <form onSubmit={handleSearch} className="bm-search-form">
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bm-search-input"
          />
          <button type="submit" className="bm-btn-secondary">Search</button>
        </form>
      </div>

      {error && (
        <div className="bm-error-message">
          <span className="bm-error-icon">!</span> {error}
        </div>
      )}
      
      {showForm && (
        <div className="bm-modal-overlay">
          <div className="bm-modal-container">
            <form className="bm-book-form" onSubmit={handleSubmit}>
              <div className="bm-form-header">
                <h2>Edit Book</h2>
                <button 
                  type="button" 
                  className="bm-btn-close"
                  onClick={() => setShowForm(false)}
                >
                  &times;
                </button>
              </div>

              <div className="bm-form-grid">
                <div className="bm-form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="bm-form-group">
                  <label htmlFor="isbn">ISBN</label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="bm-form-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="bm-form-group">
                  <label htmlFor="publisher">Publisher</label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bm-form-group">
                  <label htmlFor="publicationDate">Publication Date</label>
                  <input
                    type="date"
                    id="publicationDate"
                    name="publicationDate"
                    value={formData.publicationDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bm-form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div className="bm-form-group">
                  <label htmlFor="stockQuantity">Stock Quantity</label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div className="bm-form-group">
                  <label htmlFor="genre">Genre</label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Biography">Biography</option>
                    <option value="History">History</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Business">Business</option>
                    <option value="Children">Children</option>
                    <option value="Young Adult">Young Adult</option>
                  </select>
                </div>

                <div className="bm-form-group">
                  <label htmlFor="language">Language</label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bm-form-group">
                  <label htmlFor="format">Format</label>
                  <select
                    id="format"
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Format</option>
                    <option value="Hardcover">Hardcover</option>
                    <option value="Paperback">Paperback</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Audiobook">Audiobook</option>
                  </select>
                </div>

                <div className="bm-form-group bm-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="availableInLibrary"
                      checked={formData.availableInLibrary}
                      onChange={handleInputChange}
                    />
                    Available in Library
                  </label>
                </div>

                <div className="bm-form-group bm-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isBestseller"
                      checked={formData.isBestseller}
                      onChange={handleInputChange}
                    />
                    Bestseller
                  </label>
                </div>

                <div className="bm-form-group bm-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isAwardWinner"
                      checked={formData.isAwardWinner}
                      onChange={handleInputChange}
                    />
                    Award Winner
                  </label>
                </div>
              </div>

              <div className="bm-form-group bm-full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                />
              </div>

              <div className="bm-form-group bm-full-width">
                <label htmlFor="coverImagePath">Cover Image</label>
                <div className="bm-file-input-container">
                  <input
                    type="file"
                    id="coverImagePath"
                    name="coverImagePath"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {currentBook && currentBook.coverImagePath && (
                    <div className="bm-current-image-info">
                      <span>Current: </span>
                      <img 
                        src={`${API_BASE_URL}${currentBook.coverImagePath}`} 
                        alt="Current cover" 
                        className="bm-thumbnail-preview" 
                      />
                    </div>
                  )}
                </div>
                <p className="bm-help-text">Leave blank to keep the current image</p>
              </div>

              <div className="bm-form-actions">
                <button 
                  type="button" 
                  className="bm-btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bm-btn-primary"
                >
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bm-content-wrapper">
        {loading ? (
          <div className="bm-loading-container">
            <div className="bm-loader"></div>
            <p>Loading books...</p>
          </div>
        ) : books.items && books.items.length === 0 ? (
          <div className="bm-empty-state">
            <div className="bm-empty-icon">📚</div>
            <p>No books found. Try adjusting your search or adding new books.</p>
            <button 
              className="bm-btn-primary"
              onClick={addNewBook}
            >
              Add a new book
            </button>
          </div>
        ) : (
          <>
            <div className="bm-table-container">
              <table className="bm-books-table">
                <thead>
                  <tr>
                    <th className="bm-cover-column">Cover</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Genre</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.items && books.items.map((book) => (
                    <tr key={book.id}>
                      <td className="bm-cover-column">
                        <img 
                          src={book.coverImagePath ? `${API_BASE_URL}${book.coverImagePath}` : `${API_BASE_URL}/images/books/default-cover.jpg`} 
                          alt={`Cover of ${book.title}`} 
                          className="bm-book-cover-thumbnail" 
                        />
                      </td>
                      <td className="bm-title-cell">{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.isbn}</td>
                      <td>{book.genre}</td>
                      <td>
                        {book.isOnSale && book.discountedPrice !== null ? (
                          <>
                            <span className="bm-original-price">{formatPrice(book.price)}</span>
                            <span className="bm-discounted-price">{formatPrice(book.discountedPrice)}</span>
                            <span className="bm-discount-tag">{book.discountPercentage}% off</span>
                          </>
                        ) : (
                          formatPrice(book.price)
                        )}
                      </td>
                      <td className={book.stockQuantity <= 5 ? 'bm-low-stock' : ''}>
                        {book.stockQuantity}
                      </td>
                      <td>
                        <div className="bm-status-tags">
                          {book.isOnSale && (
                            <span className="bm-status-tag">On Sale</span>
                          )}
                          {book.isBestseller && (
                            <span className="bm-status-tag">Bestseller</span>
                          )}
                          {book.isAwardWinner && (
                            <span className="bm-status-tag">Award Winner</span>
                          )}
                          {book.stockQuantity === 0 && (
                            <span className="bm-status-tag">Out of Stock</span>
                          )}
                        </div>
                      </td>
                      <td className="bm-actions-cell">
                        <button 
                          className="bm-btn-secondary"
                          onClick={() => navigate(`/books/${book.id}`)}
                          title="View Book Details"
                        >
                          View
                        </button>
                        <button 
                          className="bm-btn-secondary"
                          onClick={() => handleEditBook(book)}
                          title="Edit Book"
                        >
                          Edit
                        </button>
                        <button 
                          className="bm-btn-danger"
                          onClick={() => handleDeleteBook(book.id)}
                          title="Delete Book"
                        >
                          Delete
                        </button>
                        {book.isOnSale ? (
                          <button 
                            className="bm-btn-secondary"
                            onClick={() => handleRemoveDiscount(book.id)}
                            title="Remove Discount"
                          >
                            Remove Sale
                          </button>
                        ) : (
                          <button 
                            className="bm-btn-secondary"
                            onClick={() => handleAddDiscount(book.id)}
                            title="Add Discount"
                          >
                            Add Sale
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookManagement;