import React, { useState } from "react";
import { X } from "lucide-react";
import "../../styles/FilterSidebar.css";

const FilterSidebar = ({ setShowFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Science Fiction",
    "Romance",
    "History",
    "Biography",
    "Fantasy",
    "Horror",
    "Poetry",
  ];
  const authors = [
    "J.K. Rowling",
    "Stephen King",
    "Jane Austen",
    "George Orwell",
    "Agatha Christie",
    "Ernest Hemingway",
    "Leo Tolstoy",
  ];
  const formats = [
    "Hardcover",
    "Paperback",
    "eBook",
    "Audiobook",
    "Limited Edition",
    "Signed Copy",
    "First Edition",
  ];
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Russian",
  ];
  const publishers = [
    "Penguin Random House",
    "HarperCollins",
    "Simon & Schuster",
    "Hachette Book Group",
    "Macmillan Publishers",
  ];

  const handleGenreChange = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleAuthorChange = (author) => {
    if (selectedAuthors.includes(author)) {
      setSelectedAuthors(selectedAuthors.filter((a) => a !== author));
    } else {
      setSelectedAuthors([...selectedAuthors, author]);
    }
  };

  const handleFormatChange = (format) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter((f) => f !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const handleLanguageChange = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handlePublisherChange = (publisher) => {
    if (selectedPublishers.includes(publisher)) {
      setSelectedPublishers(selectedPublishers.filter((p) => p !== publisher));
    } else {
      setSelectedPublishers([...selectedPublishers, publisher]);
    }
  };

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
  };

  const handleRatingChange = (rating) => {
    setRatingFilter(rating);
  };

  const handleClose = () => {
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedAuthors([]);
    setSelectedFormats([]);
    setSelectedLanguages([]);
    setSelectedPublishers([]);
    setPriceRange([0, 100]);
    setRatingFilter(0);
  };

  const applyFilters = () => {
    console.log("Applying filters:", {
      genres: selectedGenres,
      authors: selectedAuthors,
      formats: selectedFormats,
      languages: selectedLanguages,
      publishers: selectedPublishers,
      priceRange,
      minRating: ratingFilter,
    });
    setShowFilters(false);
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h2>Filter Books</h2>
        <button className="close-filter" onClick={handleClose}>
          <X size={24} />
        </button>
      </div>

      <div className="filter-content">
        <div className="filter-section">
          <h3>Price Range</h3>
          <div className="price-range-inputs">
            <div className="price-input">
              <label>Min ($)</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
              />
            </div>
            <div className="price-input">
              <label>Max ($)</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
              />
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Minimum Rating</h3>
          <div className="rating-filter">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className={ratingFilter >= rating ? "active" : ""}
                onClick={() => handleRatingChange(rating)}
              >
                {rating}+
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Genre</h3>
          <div className="checkbox-group">
            {genres.map((genre) => (
              <label key={genre} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Author</h3>
          <div className="checkbox-group">
            {authors.map((author) => (
              <label key={author} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedAuthors.includes(author)}
                  onChange={() => handleAuthorChange(author)}
                />
                {author}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Format</h3>
          <div className="checkbox-group">
            {formats.map((format) => (
              <label key={format} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedFormats.includes(format)}
                  onChange={() => handleFormatChange(format)}
                />
                {format}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Language</h3>
          <div className="checkbox-group">
            {languages.map((language) => (
              <label key={language} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                />
                {language}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Publisher</h3>
          <div className="checkbox-group">
            {publishers.map((publisher) => (
              <label key={publisher} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedPublishers.includes(publisher)}
                  onChange={() => handlePublisherChange(publisher)}
                />
                {publisher}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-actions">
        <button className="clear-filters-btn" onClick={clearAllFilters}>
          Clear All
        </button>
        <button className="apply-filters-btn" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
