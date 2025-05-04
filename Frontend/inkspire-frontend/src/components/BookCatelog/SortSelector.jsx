import React from "react";
import { ArrowDownAZ, Calendar, TrendingUp, DollarSign } from "lucide-react";
import "../../styles/SortSelector.css";

const SortSelector = ({ sortBy, setSortBy }) => {
  const sortOptions = [
    { id: "popularity", label: "Most Popular", icon: <TrendingUp size={16} /> },
    { id: "title", label: "Title", icon: <ArrowDownAZ size={16} /> },
    {
      id: "publication-date",
      label: "Publication Date",
      icon: <Calendar size={16} />,
    },
    {
      id: "price-low",
      label: "Price: Low to High",
      icon: <DollarSign size={16} />,
    },
    {
      id: "price-high",
      label: "Price: High to Low",
      icon: <DollarSign size={16} />,
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
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelector;
