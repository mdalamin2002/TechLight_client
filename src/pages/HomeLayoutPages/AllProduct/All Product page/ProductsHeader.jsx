// src/components/product/ProductsHeader.jsx
import React from "react";
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Grid3x3,
  Rows3,
  X,
} from "lucide-react";

const ProductsHeader = ({
  title = "All Products",
  subtitle = "Discover our complete collection",
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  selectedCategories = [],
  selectedBrands = [],
  onRemoveCategory = () => {},
  onRemoveBrand = () => {},
  onOpenFilters = () => {},
}) => {
  const selectedCount = selectedCategories.length + selectedBrands.length;

  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border/50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-2xl shadow-md">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-foreground text-2xl sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-background/80 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 text-foreground text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onOpenFilters}
                className="lg:hidden flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-medium text-sm shadow-md"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {selectedCount > 0 && (
                  <span className="bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {selectedCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1.5 bg-muted/60 rounded-xl p-1.5 shadow-sm border border-border/50">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <Grid3x3 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <Rows3 className="w-4.5 h-4.5" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="hidden sm:block px-4 py-3 bg-muted/60 border border-border rounded-xl text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium text-sm transition-all hover:bg-muted shadow-sm"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="sm:hidden px-4 py-3 bg-muted/60 border border-border rounded-xl text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium text-sm shadow-sm"
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/5 text-primary rounded-full text-xs sm:text-sm font-medium border border-primary/30 shadow-sm hover:shadow-md transition-all"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => onRemoveCategory(cat)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-all hover:scale-110"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selectedBrands.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/15 to-accent/5 text-accent rounded-full text-xs sm:text-sm font-medium border border-accent/30 shadow-sm hover:shadow-md transition-all"
                >
                  <span>{brand}</span>
                  <button
                    onClick={() => onRemoveBrand(brand)}
                    className="hover:bg-accent/20 rounded-full p-0.5 transition-all hover:scale-110"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;
