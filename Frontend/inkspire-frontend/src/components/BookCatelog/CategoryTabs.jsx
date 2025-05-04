import React from "react";
import "../../styles/CategoryTabs.css";

const CategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: "all", label: "All Books" },
    { id: "bestsellers", label: "Bestsellers" },
    { id: "award-winners", label: "Award Winners" },
    { id: "new-releases", label: "New Releases" },
    { id: "new-arrivals", label: "New Arrivals" },
    { id: "coming-soon", label: "Coming Soon" },
    { id: "deals", label: "Deals" },
  ];

  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-tab ${
            activeCategory === category.id ? "active" : ""
          }`}
          onClick={() => setActiveCategory(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
