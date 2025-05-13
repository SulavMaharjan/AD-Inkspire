import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  fetchGenres,
  fetchAuthors,
  fetchPublishers,
  fetchLanguages,
  fetchFormats,
} from "../../context/bookApiService";
import "../../styles/FilterSidebar.css";

const FilterSidebar = ({ setShowFilters, initialFilters, onApplyFilters }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);

  const MAX_PRICE = 1000;

  //states of dynamic filter options
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [formats, setFormats] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [publishers, setPublishers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  //initialize with initial filters
  useEffect(() => {
    if (initialFilters) {
      setMinPrice(initialFilters.minPrice || 0);
      setMaxPrice(initialFilters.maxPrice || MAX_PRICE);

      setSelectedGenres(initialFilters.selectedGenres || []);
      setSelectedAuthors(initialFilters.selectedAuthors || []);
      setSelectedFormats(initialFilters.selectedFormats || []);
      setSelectedLanguages(initialFilters.selectedLanguages || []);
      setSelectedPublishers(initialFilters.selectedPublishers || []);
      setRatingFilter(initialFilters.ratingFilter || 0);

      console.log("Initialized filters:", initialFilters);
    }
  }, [initialFilters]);

  //filter options from API
  useEffect(() => {
    const loadFilterOptions = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [
          genresData,
          authorsData,
          formatsData,
          languagesData,
          publishersData,
        ] = await Promise.all([
          fetchGenres(),
          fetchAuthors(),
          fetchFormats(),
          fetchLanguages(),
          fetchPublishers(),
        ]);

        setGenres(genresData);
        setAuthors(authorsData);
        setFormats(formatsData);
        setLanguages(languagesData);
        setPublishers(publishersData);
      } catch (error) {
        console.error("Failed to load filter options:", error);
        setLoadError("Failed to load filter options. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

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

  const handleMinPriceChange = (e) => {
    const value = Math.max(0, Math.min(Number(e.target.value), MAX_PRICE));
    setMinPrice(Math.min(value, maxPrice));
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(0, Math.min(Number(e.target.value), MAX_PRICE));
    setMaxPrice(Math.max(value, minPrice));
  };

  const handleMinSliderChange = (e) => {
    const value = Number(e.target.value);
    setMinPrice(Math.min(value, maxPrice));
  };

  const handleMaxSliderChange = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(Math.max(value, minPrice));
  };

  const handleRatingChange = (rating) => {
    setRatingFilter(rating === ratingFilter ? 0 : rating);
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
    setMinPrice(0);
    setMaxPrice(MAX_PRICE);
    setRatingFilter(0);

    console.log("All filters cleared");
  };

  const applyFilters = () => {
    const filterData = {
      minPrice: minPrice,
      maxPrice: maxPrice,
      selectedGenres,
      selectedAuthors,
      selectedFormats,
      selectedLanguages,
      selectedPublishers,
      ratingFilter,
    };

    console.log("Applying filters from sidebar:", filterData);

    if (onApplyFilters) {
      onApplyFilters(filterData);
    }

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
        {isLoading ? (
          <div className="filter-loading">
            <div className="spinner"></div>
            <p>Loading filter options...</p>
          </div>
        ) : loadError ? (
          <div className="filter-error">
            <p>{loadError}</p>
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        ) : (
          <>
            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-range-inputs">
                <div className="price-input">
                  <label>Min ($)</label>
                  <input
                    type="number"
                    min="0"
                    max={MAX_PRICE}
                    value={minPrice}
                    onChange={handleMinPriceChange}
                  />
                </div>
                <div className="price-input">
                  <label>Max ($)</label>
                  <input
                    type="number"
                    min="0"
                    max={MAX_PRICE}
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                  />
                </div>
              </div>
              <div className="price-range-slider">
                <input
                  type="range"
                  min="0"
                  max={MAX_PRICE}
                  step="5"
                  value={minPrice}
                  onChange={handleMinSliderChange}
                  className="price-slider"
                />
                <input
                  type="range"
                  min="0"
                  max={MAX_PRICE}
                  step="5"
                  value={maxPrice}
                  onChange={handleMaxSliderChange}
                  className="price-slider"
                />
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

            {genres.length > 0 && (
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
            )}

            {authors.length > 0 && (
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
            )}

            {formats.length > 0 && (
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
            )}

            {languages.length > 0 && (
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
            )}

            {publishers.length > 0 && (
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
            )}
          </>
        )}
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
