import React, { useState } from "react";
import FormField from "./FormField";
import ToggleSwitch from "./ToggleSwitch";
import { Book } from "lucide-react";

const AddBookForm = () => {
  const initialFormData = {
    title: "",
    isbn: "",
    author: "",
    publisher: "",
    publicationDate: "",
    price: "",
    stockQuantity: "",
    genre: "",
    language: "",
    format: "",
    description: "",
    availableInLibrary: false,
    isBestseller: false,
    isAwardWinner: false,
    isComingSoon: false,
    coverImageUrl: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genreOptions = [
    { value: "Fiction", label: "Fiction" },
    { value: "Non-Fiction", label: "Non-Fiction" },
    { value: "Mystery", label: "Mystery" },
    { value: "Science Fiction", label: "Science Fiction" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Romance", label: "Romance" },
    { value: "Thriller", label: "Thriller" },
    { value: "Horror", label: "Horror" },
    { value: "Historical", label: "Historical" },
    { value: "Biography", label: "Biography" },
    { value: "Self-Help", label: "Self-Help" },
    { value: "Business", label: "Business" },
    { value: "Children", label: "Children" },
    { value: "Young Adult", label: "Young Adult" },
    { value: "Poetry", label: "Poetry" },
    { value: "Travel", label: "Travel" },
    { value: "Cooking", label: "Cooking" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Russian", label: "Russian" },
    { value: "Japanese", label: "Japanese" },
    { value: "Chinese", label: "Chinese" },
    { value: "Arabic", label: "Arabic" },
  ];

  const formatOptions = [
    { value: "Paperback", label: "Paperback" },
    { value: "Hardcover", label: "Hardcover" },
    { value: "E-Book", label: "E-Book" },
    { value: "Audiobook", label: "Audiobook" },
    { value: "Limited Edition", label: "Limited Edition" },
    { value: "Signed Copy", label: "Signed Copy" },
    { value: "First Edition", label: "First Edition" },
    { value: "Collector's Edition", label: "Collector's Edition" },
    { value: "Deluxe Edition", label: "Deluxe Edition" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.publisher.trim())
      newErrors.publisher = "Publisher is required";
    if (!formData.publicationDate)
      newErrors.publicationDate = "Publication date is required";

    // Price validation
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    // Stock validation
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = "Stock quantity is required";
    } else if (
      isNaN(Number(formData.stockQuantity)) ||
      Number(formData.stockQuantity) < 0
    ) {
      newErrors.stockQuantity = "Stock quantity must be a non-negative number";
    }

    if (!formData.genre) newErrors.genre = "Genre is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.format) newErrors.format = "Format is required";

    // ISBN format validation (simple validation for demo)
    const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    if (formData.isbn && !isbnRegex.test(formData.isbn.replace(/-/g, ""))) {
      newErrors.isbn = "Invalid ISBN format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to add the book
      console.log("Submitting book data:", formData);

      // Mock successful submission
      setTimeout(() => {
        alert("Book added successfully!");
        setFormData(initialFormData);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding book:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-book-form-container">
      <form className="add-book-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section basic-info">
            <h2 className="section-title">Basic Information</h2>

            <FormField
              label="Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
              error={errors.title}
            />

            <FormField
              label="ISBN"
              name="isbn"
              type="text"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN (e.g., 978-3-16-148410-0)"
              required
              error={errors.isbn}
            />

            <FormField
              label="Author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
              error={errors.author}
            />

            <FormField
              label="Publisher"
              name="publisher"
              type="text"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Enter publisher name"
              required
              error={errors.publisher}
            />

            <FormField
              label="Publication Date"
              name="publicationDate"
              type="date"
              value={formData.publicationDate}
              onChange={handleChange}
              required
              error={errors.publicationDate}
            />
          </div>

          <div className="form-section details">
            <h2 className="section-title">Details</h2>

            <FormField
              label="Genre"
              name="genre"
              type="text"
              value={formData.genre}
              onChange={handleChange}
              as="select"
              options={genreOptions}
              required
              error={errors.genre}
            />

            <FormField
              label="Language"
              name="language"
              type="text"
              value={formData.language}
              onChange={handleChange}
              as="select"
              options={languageOptions}
              required
              error={errors.language}
            />

            <FormField
              label="Format"
              name="format"
              type="text"
              value={formData.format}
              onChange={handleChange}
              as="select"
              options={formatOptions}
              required
              error={errors.format}
            />

            <FormField
              label="Price ($)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
              error={errors.price}
            />

            <FormField
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              min="0"
              value={formData.stockQuantity}
              onChange={handleChange}
              placeholder="0"
              required
              error={errors.stockQuantity}
            />
          </div>

          <div className="form-section description">
            <h2 className="section-title">Description & Image</h2>

            <FormField
              label="Description"
              name="description"
              type="text"
              as="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              rows={6}
            />

            <FormField
              label="Cover Image URL"
              name="coverImageUrl"
              type="url"
              value={formData.coverImageUrl}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
            />

            {formData.coverImageUrl && (
              <div className="cover-preview">
                <p className="preview-label">Cover Preview:</p>
                <div className="image-preview-container">
                  <img
                    src={formData.coverImageUrl}
                    alt="Book cover preview"
                    className="image-preview"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150x200?text=Invalid+URL";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-section flags">
            <h2 className="section-title">Special Flags</h2>

            <div className="toggles-container">
              <ToggleSwitch
                label="Available in Library"
                name="availableInLibrary"
                checked={formData.availableInLibrary}
                onChange={handleToggleChange}
              />

              <ToggleSwitch
                label="Bestseller"
                name="isBestseller"
                checked={formData.isBestseller}
                onChange={handleToggleChange}
              />

              <ToggleSwitch
                label="Award Winner"
                name="isAwardWinner"
                checked={formData.isAwardWinner}
                onChange={handleToggleChange}
              />

              <ToggleSwitch
                label="Coming Soon"
                name="isComingSoon"
                checked={formData.isComingSoon}
                onChange={handleToggleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding Book..." : "Add Book"}
            {!isSubmitting && <Book size={18} className="btn-icon" />}
          </button>
        </div>
      </form>

      <div className="form-preview">
        <div className="preview-header">
          <h2 className="preview-title">Book Preview</h2>
          <p className="preview-subtitle">
            Preview how the book will appear in the catalog
          </p>
        </div>

        <div className="book-card-preview">
          <div className="book-card-cover">
            {formData.coverImageUrl ? (
              <img
                src={formData.coverImageUrl}
                alt={formData.title || "Book cover"}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/150x200?text=Cover";
                }}
              />
            ) : (
              <div className="placeholder-cover">
                <Book size={40} />
                <span>No Cover</span>
              </div>
            )}
          </div>

          <div className="book-card-details">
            <h3 className="book-title">{formData.title || "Book Title"}</h3>
            <p className="book-author">
              {formData.author ? `by ${formData.author}` : "Author Name"}
            </p>

            <div className="book-metadata">
              {formData.genre && (
                <span className="book-genre">{formData.genre}</span>
              )}
              {formData.format && (
                <span className="book-format">{formData.format}</span>
              )}
            </div>

            <p className="book-price">
              {formData.price
                ? `$${parseFloat(formData.price).toFixed(2)}`
                : "$0.00"}
            </p>

            <div className="book-flags">
              {formData.isBestseller && (
                <span className="book-flag bestseller">Bestseller</span>
              )}
              {formData.isAwardWinner && (
                <span className="book-flag award-winner">Award Winner</span>
              )}
              {formData.isComingSoon && (
                <span className="book-flag coming-soon">Coming Soon</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookForm;
