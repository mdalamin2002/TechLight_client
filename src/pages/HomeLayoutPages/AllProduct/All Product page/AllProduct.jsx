import React, { useMemo, useState } from "react";
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Grid3x3,
  Rows3,
  X,
} from "lucide-react";
import { allProducts, categoryGroups, brands } from "./data";
import FilterSidebar from "./FilterSidebar";
import Products from "./Products";

const AllProduct = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState([]);

  const productsPerPage = 12;

  const toggleGroup = (group) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 200000]);
    setSortBy("default");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return filtered;
  }, [selectedCategories, selectedBrands, priceRange, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 -mt-7">
          <div className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-2xl shadow-md">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-foreground text-2xl sm:text-3xl lg:text-4xl">
                  All Products
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Discover our complete collection
                </p>
              </div>
            </div>

            {/* Search + Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-background/80 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 text-foreground text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-medium text-sm shadow-md"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                  {selectedCategories.length + selectedBrands.length > 0 && (
                    <span className="bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {selectedCategories.length + selectedBrands.length}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1.5 bg-muted/60 rounded-xl p-1.5 shadow-sm border border-border/50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                    }`}
                  >
                    <Grid3x3 className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
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
                  onChange={(e) => setSortBy(e.target.value)}
                  className="hidden sm:block px-4 py-3 bg-muted/60 border border-border rounded-xl text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium text-sm transition-all hover:bg-muted shadow-sm"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Mobile Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sm:hidden px-4 py-3 bg-muted/60 border border-border rounded-xl text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium text-sm shadow-sm"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/5 text-primary rounded-full text-xs sm:text-sm font-medium border border-primary/30 shadow-sm hover:shadow-md transition-all"
                  >
                    <span>{cat}</span>
                    <button
                      onClick={() => toggleCategory(cat)}
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
                      onClick={() => toggleBrand(brand)}
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

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex gap-4 lg:gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-lg">
              <FilterSidebar
                categoryGroups={categoryGroups}
                brands={brands}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </aside>

          {/* Mobile Sidebar (inline drawer) */}
          {showMobileFilters && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  categoryGroups={categoryGroups}
                  brands={brands}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  expandedGroups={expandedGroups}
                  toggleGroup={toggleGroup}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedBrands={selectedBrands}
                  toggleBrand={toggleBrand}
                  clearAllFilters={clearAllFilters}
                />
              </div>
            </div>
          )}

          {/* Products Section */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6 bg-gradient-to-r from-card to-muted/20 rounded-xl p-4 sm:p-5 border border-border/50 shadow-sm">
              <p className="text-muted-foreground text-sm sm:text-base">
                Showing{" "}
                <span className="font-bold text-primary text-base sm:text-lg">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            {currentProducts.length > 0 ? (
              <Products
                products={currentProducts}
                viewMode={viewMode}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-2xl">
                    <Search className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-gray-900 mb-3 text-2xl font-black">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md text-base px-4 leading-relaxed font-medium">
                  We couldn't find any products matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg flex items-center gap-2"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
