import React from "react";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const FilterSidebar = ({
  categoryGroups,
  brands,
  selectedCategories,
  toggleCategory,
  expandedGroups,
  toggleGroup,
  priceRange,
  setPriceRange,
  selectedBrands,
  toggleBrand,
  clearAllFilters,
}) => {
  const handlePriceChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    if (type === "min") {
      setPriceRange([Math.min(numValue, priceRange[1]), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(numValue, priceRange[0])]);
    }
  };

  const quickPriceRanges = [
    { label: "Under 10K", min: 0, max: 10000 },
    { label: "10K - 50K", min: 10000, max: 50000 },
    { label: "50K - 100K", min: 50000, max: 100000 },
    { label: "Above 100K", min: 100000, max: 200000 },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-5 border-b-2 border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl border border-primary/20 shadow-sm">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-foreground font-bold text-xl">Filters</h3>
        </div>
        {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-destructive hover:text-destructive/80 transition font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-destructive/10 border border-transparent hover:border-destructive/20"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Categories with Groups */}
      <div className="space-y-3">
        <h4 className="text-foreground font-bold text-sm flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
          CATEGORIES
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {categoryGroups.map((group) => {
            const Icon = group.icon;
            const isExpanded = expandedGroups.includes(group.group);
            const hasSelected = selectedCategories.some((cat) =>
              group.categories.includes(cat)
            );

            return (
              <div
                key={group.group}
                className="border border-border/60 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-all">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {group.group}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasSelected && (
                      <span className="px-2 py-0.5 bg-primary/15 text-primary rounded-full text-xs font-bold">
                        {group.categories.filter(cat => selectedCategories.includes(cat)).length}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 space-y-1 bg-muted/20">
                    {group.categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer group/item pl-9 py-2.5 rounded-lg hover:bg-card/80 transition-all"
                      >
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="peer sr-only"
                          />
                          <div className="w-4.5 h-4.5 border-2 border-border rounded-md peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center shadow-sm">
                            {selectedCategories.includes(category) && (
                              <svg
                                className="w-3 h-3 text-primary-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-foreground/80 group-hover/item:text-foreground transition-colors font-medium">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-foreground font-bold text-sm flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
          PRICE RANGE
        </h4>
        <div className="space-y-4 p-4 bg-gradient-to-br from-primary/5 via-accent/5 to-muted/30 rounded-2xl border border-border/60">
          {/* Quick Select Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {quickPriceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setPriceRange([range.min, range.max])}
                className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                  priceRange[0] === range.min && priceRange[1] === range.max
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-foreground hover:bg-muted border border-border"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Price Display */}
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border shadow-sm">
              <span className="text-xs font-bold text-primary">
                ৳{priceRange[0].toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs">—</span>
              <span className="text-xs font-bold text-primary">
                ৳{priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>

          {/* Custom Range Inputs */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="w-full px-2 py-2 bg-card border border-border rounded-lg text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-center"
              placeholder="Min"
              step="1000"
            />
            <div className="text-muted-foreground text-sm">—</div>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="w-full px-2 py-2 bg-card border border-border rounded-lg text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-center"
              placeholder="Max"
              step="1000"
            />
          </div>

          {/* Range Slider */}
          <div className="pt-1">
            <input
              type="range"
              min="0"
              max="200000"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card [&::-webkit-slider-thumb]:cursor-pointer"
              step="5000"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-4">
        <h4 className="text-foreground font-bold text-sm flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
          BRANDS
        </h4>
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer group p-3 hover:bg-muted/60 rounded-lg transition-all border border-transparent hover:border-border/50"
            >
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="peer sr-only"
                />
                <div className="w-4.5 h-4.5 border-2 border-border rounded-md peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center shadow-sm">
                  {selectedBrands.includes(brand) && (
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-foreground/90 group-hover:text-foreground transition-colors font-medium">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
