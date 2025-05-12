import React, { useState, useRef } from "react";
import FormField from "./FormField";
import ToggleSwitch from "./ToggleSwitch";
import { Book, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddBookForm = () => {
  const { currentRole } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
    isNewArrival: true,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [CoverImagePath, setCoverImagePath] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          CoverImagePath: "Image must be less than 5MB",
        }));
        return;
      }

      //file type
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          CoverImagePath: "Only JPEG and PNG formats are allowed",
        }));
        return;
      }

      setCoverImagePath(file);

      //preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      if (errors.CoverImagePath) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.CoverImagePath;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.publisher.trim())
      newErrors.publisher = "Publisher is required";
    if (!formData.publicationDate)
      newErrors.publicationDate = "Publication date is required";
    if (!CoverImagePath) newErrors.CoverImagePath = "Cover image is required";

    //price validation
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a number";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    //stock validation
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = "Stock quantity is required";
    } else if (isNaN(Number(formData.stockQuantity))) {
      newErrors.stockQuantity = "Stock quantity must be a number";
    } else if (Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = "Stock quantity must be 0 or greater";
    }

    if (!formData.genre) newErrors.genre = "Genre is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.format) newErrors.format = "Format is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formDataToSend = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        formDataToSend.append(
          key,
          typeof value === "boolean" ? value.toString() : value
        );
      }

      formDataToSend.append("CoverImagePath", CoverImagePath);

      const response = await axios.post(
        "https://localhost:7039/api/Books/addBooks",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book added successfully!");
      setFormData(initialFormData);
      setCoverImagePath(null);
      setPreviewImage(null);

    } catch (error) {
      console.error("Error adding book:", error);

      const errorMessage =
        error.response?.data ||
        error.response?.data?.message ||
        error.message ||
        "Failed to add book. Please try again.";

      setSubmitError(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (currentRole === "SuperAdmin") {
      navigate("/admin-dashboard/books");
    }
  };

  return (
    <div className="add-book-form-container">
      <form className="add-book-form" onSubmit={handleSubmit}>
        {submitError && <div className="form-error-message">{submitError}</div>}

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

            <div className="file-upload-section">
              <div className="file-upload-field">
                <label htmlFor="CoverImagePath">Cover Image *</label>
                <div className="file-upload-container">
                  <div
                    className="upload-area"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {previewImage ? (
                      <div className="image-preview-wrapper">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="image-preview"
                        />
                        <div className="image-overlay">
                          <Upload size={24} />
                          <span>Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={24} />
                        <p>Click to upload cover image</p>
                        <p className="file-requirements">
                          (JPEG, PNG, max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="CoverImagePath"
                    name="CoverImagePath"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                    className="file-input"
                    hidden
                  />
                  {CoverImagePath && (
                    <div className="file-info">
                      <span>{CoverImagePath.name}</span>
                      <span>{Math.round(CoverImagePath.size / 1024)} KB</span>
                    </div>
                  )}
                  {errors.CoverImagePath && (
                    <div className="error-message">{errors.CoverImagePath}</div>
                  )}
                </div>
              </div>
            </div>
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

              <ToggleSwitch
                label="New Arrival"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleToggleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
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
            {previewImage ? (
              <img src={previewImage} alt={formData.title || "Book cover"} />
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
              {formData.isNewArrival && (
                <span className="book-flag new-arrival">New Arrival</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookForm;
