import React from "react";
import {
  ArrowDownAZ,
  Calendar,
  TrendingUp,
  DollarSign,
  Star,
} from "lucide-react";
import "../../styles/SortSelector.css";

const SortSelector = ({ sortBy, setSortBy }) => {
  const sortOptions = [
    {
      id: "popularity",
      label: "Most Popular",
      icon: <TrendingUp size={16} />,
      description: "Sort by number of books sold",
    },
    {
      id: "title",
      label: "Title (A-Z)",
      icon: <ArrowDownAZ size={16} />,
      description: "Sort alphabetically by book title",
    },
    {
      id: "publication-date-newest",
      label: "Publication Date (Newest)",
      icon: <Calendar size={16} />,
      description: "Sort by most recently published",
    },
    {
      id: "publication-date-oldest",
      label: "Publication Date (Oldest)",
      icon: <Calendar size={16} />,
      description: "Sort by oldest publications",
    },
    {
      id: "price-low",
      label: "Price: Low to High",
      icon: <DollarSign size={16} />,
      description: "Sort by lowest to highest price",
    },
    {
      id: "price-high",
      label: "Price: High to Low",
      icon: <DollarSign size={16} />,
      description: "Sort by highest to lowest price",
    },
    {
      id: "rating",
      label: "Customer Ratings",
      icon: <Star size={16} />,
      description: "Sort by highest rated books",
    },
  ];

  return (
    <div className="sort-selector">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id} title={option.description}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelector;
