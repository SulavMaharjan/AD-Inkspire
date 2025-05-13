import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMoreVertical } from 'react-icons/fi';
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
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountData, setDiscountData] = useState({
    discountPercentage: 10,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [formData, setFormData] = useState({
    id:'',
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

  const toggleDropdown = (bookId) => {
    setActiveDropdown(activeDropdown === bookId ? null : bookId);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
    setActiveDropdown(null);
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

  const handleDiscountInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountData({
      ...discountData,
      [name]: value
    });
  };
  
  const handleAddDiscount = async (e) => {
    e.preventDefault();
    
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
  
      const discountDto = {
        discountPercentage: parseFloat(discountData.discountPercentage),
        startDate: new Date(discountData.startDate).toISOString(),
        endDate: new Date(discountData.endDate).toISOString()
      };
  
      const response = await fetch(`${API_BASE_URL}/api/Books/${currentBook.id}/discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(discountDto)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add discount: ${response.status} ${errorText}`);
      }
  
      fetchBooks();
      setShowDiscountModal(false);
      showNotification('Discount added successfully', 'success');
      
    } catch (err) {
      setError(err.message);
      console.error('Error adding discount:', err);
      showNotification(`Failed to add discount: ${err.message}`, 'error');
    }
  };
  
  const handleShowDiscountModal = (book) => {
    setCurrentBook(book);
    setShowDiscountModal(true);
    setActiveDropdown(null);
  };

  return (
    <div className="bookmgmt-container">
      {notification.show && (
        <div className={`bookmgmt-notification bookmgmt-${notification.type}`}>
          <span className="bookmgmt-notification-message">{notification.message}</span>
          <button 
            className="bookmgmt-notification-close"
            onClick={() => setNotification(prev => ({...prev, show: false}))}
          >
            &times;
          </button>
        </div>
      )}

      <div className="bookmgmt-header">
        <h1>Book Management</h1>
      </div>
      
      <div className="bookmgmt-search-container">
        <form onSubmit={handleSearch} className="bookmgmt-search-form">
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bookmgmt-search-input"
          />
          <button type="submit" className="bookmgmt-btn-secondary">Search</button>
        </form>
      </div>

      {error && (
        <div className="bookmgmt-error-message">
          <span className="bookmgmt-error-icon">!</span> {error}
        </div>
      )}
      
      {showForm && (
        <div className="bookmgmt-modal-overlay">
          <div className="bookmgmt-modal-container">
            <form className="bookmgmt-book-form" onSubmit={handleSubmit}>
              <div className="bookmgmt-form-header">
                <h2>Edit Book</h2>
                <button 
                  type="button" 
                  className="bookmgmt-btn-close"
                  onClick={() => setShowForm(false)}
                >
                  &times;
                </button>
              </div>

              <div className="bookmgmt-form-grid">
                <div className="bookmgmt-form-group">
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

                <div className="bookmgmt-form-group">
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

                <div className="bookmgmt-form-group">
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

                <div className="bookmgmt-form-group">
                  <label htmlFor="publisher">Publisher</label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bookmgmt-form-group">
                  <label htmlFor="publicationDate">Publication Date</label>
                  <input
                    type="date"
                    id="publicationDate"
                    name="publicationDate"
                    value={formData.publicationDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bookmgmt-form-group">
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

                <div className="bookmgmt-form-group">
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

                <div className="bookmgmt-form-group">
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

                <div className="bookmgmt-form-group">
                  <label htmlFor="language">Language</label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bookmgmt-form-group">
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

                <div className="bookmgmt-form-group bookmgmt-checkbox-group">
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

                <div className="bookmgmt-form-group bookmgmt-checkbox-group">
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

                <div className="bookmgmt-form-group bookmgmt-checkbox-group">
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

              <div className="bookmgmt-form-group bookmgmt-full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                />
              </div>

              <div className="bookmgmt-form-group bookmgmt-full-width">
                <label htmlFor="coverImagePath">Cover Image</label>
                <div className="bookmgmt-file-input-container">
                  <input
                    type="file"
                    id="coverImagePath"
                    name="coverImagePath"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {currentBook && currentBook.coverImagePath && (
                    <div className="bookmgmt-current-image-info">
                      <span>Current: </span>
                      <img 
                        src={`${API_BASE_URL}${currentBook.coverImagePath}`} 
                        alt="Current cover" 
                        className="bookmgmt-thumbnail-preview" 
                      />
                    </div>
                  )}
                </div>
                <p className="bookmgmt-help-text">Leave blank to keep the current image</p>
              </div>

              <div className="bookmgmt-form-actions">
                <button 
                  type="button" 
                  className="bookmgmt-btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bookmgmt-btn-primary"
                >
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bookmgmt-content-wrapper">
        {loading ? (
          <div className="bookmgmt-loading-container">
            <div className="bookmgmt-loader"></div>
            <p>Loading books...</p>
          </div>
        ) : books.items && books.items.length === 0 ? (
          <div className="bookmgmt-empty-state">
            <div className="bookmgmt-empty-icon">📚</div>
            <p>No books found. Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <div className="bookmgmt-table-container">
              <table className="bookmgmt-books-table">
                <thead>
                  <tr>
                    <th className="bookmgmt-cover-column">Cover</th>
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
                    <tr key={book.id} className="bookmgmt-table-row">
                      <td className="bookmgmt-cover-column">
                        <img 
                          src={book.coverImagePath ? `${API_BASE_URL}${book.coverImagePath}` : `${API_BASE_URL}/images/books/default-cover.jpg`} 
                          alt={`Cover of ${book.title}`} 
                          className="bookmgmt-book-cover-thumbnail" 
                        />
                      </td>
                      <td className="bookmgmt-title-cell">
                        <div className="bookmgmt-title-wrapper">
                          {book.title}
                        </div>
                      </td>
                      <td className="bookmgmt-author-cell">
                        <div className="bookmgmt-author-wrapper">
                          {book.author}
                        </div>
                      </td>
                      <td className="bookmgmt-isbn-cell">
                        <div className="bookmgmt-isbn-wrapper">
                          {book.isbn}
                        </div>
                      </td>
                      <td className="bookmgmt-genre-cell">
                        <div className="bookmgmt-genre-wrapper">
                          {book.genre}
                        </div>
                      </td>
                      <td className="bookmgmt-price-cell">
                        <div className="bookmgmt-price-wrapper">
                          {book.isOnSale && book.discountedPrice !== null ? (
                            <>
                              <span className="bookmgmt-original-price">{formatPrice(book.price)}</span>
                              <span className="bookmgmt-discounted-price">{formatPrice(book.discountedPrice)}</span>
                              <span className="bookmgmt-discount-tag">{book.discountPercentage}% off</span>
                            </>
                          ) : (
                            formatPrice(book.price)
                          )}
                        </div>
                      </td>
                      <td className={`bookmgmt-stock-cell ${book.stockQuantity <= 5 ? 'bookmgmt-low-stock' : ''}`}>
                        <div className="bookmgmt-stock-wrapper">
                          {book.stockQuantity}
                        </div>
                      </td>
                      <td className="bookmgmt-status-cell">
                        <div className="bookmgmt-status-tags">
                          {book.isOnSale && (
                            <span className="bookmgmt-status-tag bookmgmt-sale-tag">On Sale</span>
                          )}
                          {book.isBestseller && (
                            <span className="bookmgmt-status-tag bookmgmt-bestseller-tag">Bestseller</span>
                          )}
                          {book.isAwardWinner && (
                            <span className="bookmgmt-status-tag bookmgmt-award-tag">Award Winner</span>
                          )}
                          {book.stockQuantity === 0 && (
                            <span className="bookmgmt-status-tag bookmgmt-outofstock-tag">Out of Stock</span>
                          )}
                        </div>
                      </td>
                      <td className="bookmgmt-actions-cell">
                        <div className="bookmgmt-actions-wrapper">
                          <div className="bookmgmt-dropdown">
                            <button 
                              className="bookmgmt-dropdown-toggle"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(book.id);
                              }}
                            >
                              <FiMoreVertical />
                            </button>
                            
                            {activeDropdown === book.id && (
                              <div className="bookmgmt-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  className="bookmgmt-dropdown-item"
                                  onClick={() => navigate(`/bookDetail/${book.id}`)}
                                >
                                  View Details
                                </button>
                                <button 
                                  className="bookmgmt-dropdown-item"
                                  onClick={() => handleEditBook(book)}
                                >
                                  Edit Book
                                </button>
                                <button 
                                  className="bookmgmt-dropdown-item"
                                  onClick={() => handleDeleteBook(book.id)}
                                >
                                  Delete Book
                                </button>
                                {!book.isOnSale && (
                                  <button 
                                    className="bookmgmt-dropdown-item"
                                    onClick={() => handleShowDiscountModal(book)}
                                  >
                                    Add Discount
                                  </button>
                                )}
                                {book.isOnSale && (
                                  <button 
                                    className="bookmgmt-dropdown-item"
                                    onClick={() => handleRemoveDiscount(book.id)}
                                  >
                                    Remove Discount
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="bookmgmt-modal-overlay">
          <div className="bookmgmt-modal-container">
            <form className="bookmgmt-book-form" onSubmit={handleAddDiscount}>
              <div className="bookmgmt-form-header">
                <h2>Add Discount to {currentBook?.title}</h2>
                <button 
                  type="button" 
                  className="bookmgmt-btn-close"
                  onClick={() => setShowDiscountModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="bookmgmt-form-group">
                <label htmlFor="discountPercentage">Discount Percentage</label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  min="1"
                  max="100"
                  value={discountData.discountPercentage}
                  onChange={handleDiscountInputChange}
                  required
                />
              </div>

              <div className="bookmgmt-form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={discountData.startDate}
                  onChange={handleDiscountInputChange}
                  required
                />
              </div>

              <div className="bookmgmt-form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={discountData.endDate}
                  onChange={handleDiscountInputChange}
                  required
                />
              </div>

              <div className="bookmgmt-form-actions">
                <button 
                  type="button" 
                  className="bookmgmt-btn-secondary"
                  onClick={() => setShowDiscountModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bookmgmt-btn-primary"
                >
                  Apply Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;