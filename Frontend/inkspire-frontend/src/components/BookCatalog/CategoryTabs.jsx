import React from "react";
import "../../styles/CategoryTabs.css";

const CategoryTabs = ({
  activeCategory,
  setActiveCategory,
  onCategoryChange,
}) => {
  const categories = [
    { id: "all", label: "All Books" },
    { id: "bestsellers", label: "Bestsellers" },
    { id: "new-releases", label: "New Releases" },
    { id: "award-winners", label: "Award Winners" },
    { id: "deals", label: "Deals & Discounts" },
    { id: "new-arrivals", label: "New Arrivals" },
    { id: "coming-soon", label: "Coming Soon" },
  ];

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);

    // Call the callback function if provided
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-tab ${
            activeCategory === category.id ? "active" : ""
          }`}
          onClick={() => handleCategoryChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
