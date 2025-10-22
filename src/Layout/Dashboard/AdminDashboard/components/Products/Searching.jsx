import { Search, X, Filter } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const Searching = ({
  placeholder = "Search products...",
  onSearch,
  onClear,
  showFilter = false,
  filterOptions = [],
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(
    filterOptions[0]?.value || ""
  );
  const inputRef = useRef(null);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (onSearch) onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    if (onFilterChange) onFilterChange(value);
    setShowFilters(false);
  };

  return (
    <div className="relative w-full md:w-1/2">
      <div className="relative">
        <div className="flex items-center bg-card border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-sm">
          <Search className="w-5 h-5 mr-3 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-foreground w-full placeholder:text-muted-foreground"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {showFilter && filterOptions.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {showFilters && filterOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
          <div className="p-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedFilter === option.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Searching;
