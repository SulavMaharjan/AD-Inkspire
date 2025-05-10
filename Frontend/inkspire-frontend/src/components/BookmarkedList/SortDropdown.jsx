import React, { useState, useRef, useEffect } from 'react';
import '../../styles/SortDropdownBookmark.css';

export const SortDropdown = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const sortOptions = [
    { value: 'title-asc', label: 'Title: A to Z' },
    { value: 'title-desc', label: 'Title: Z to A' },
    { value: 'author-asc', label: 'Author: A to Z' },
    { value: 'author-desc', label: 'Author: Z to A' },
    { value: 'date-added-desc', label: 'Recently Added' },
    { value: 'date-added-asc', label: 'Oldest Added' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' }
  ];
  
  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Sort By';
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle option selection
  const handleSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button 
        className="sort-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{currentSortLabel}</span>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={isOpen ? 'rotated' : ''}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <ul 
          className="sort-options"
          role="listbox"
          aria-activedescendant={currentSort}
        >
          {sortOptions.map(option => (
            <li 
              key={option.value} 
              className={`sort-option ${currentSort === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={currentSort === option.value}
              id={option.value}
            >
              {option.label}
              
              {currentSort === option.value && (
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};