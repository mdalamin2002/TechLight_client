import React, { useState, useMemo } from "react";
import {
  Grid3x3,
  Rows3,
  X,
  SlidersHorizontal,
  Star,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Home,
  Usb,
  Package,
  TrendingUp,
  Zap,
} from "lucide-react";
import AllProductCardShare from "@/Components/Shared/All Product/AllProductCardShare";

// Sample product data
const allProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 149999,
    category: "Smartphones",
    brand: "Apple",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    badge: "Trending",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 134999,
    category: "Smartphones",
    brand: "Samsung",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    badge: "Hot",
  },
  {
    id: 3,
    name: 'iPad Pro 12.9"',
    price: 109999,
    category: "Tablets",
    brand: "Apple",
    rating: 4.7,
    image: "https://i.ibb.co.com/67t0ntbf/image.png",
  },
  {
    id: 4,
    name: "MacBook Pro M3",
    price: 189999,
    category: "Laptops",
    brand: "Apple",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    badge: "Trending",
  },
  {
    id: 5,
    name: "Dell XPS 15",
    price: 159999,
    category: "Laptops",
    brand: "Dell",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
  },
  {
    id: 6,
    name: "Logitech MX Master 3S",
    price: 8999,
    category: "Keyboards & Mouse",
    brand: "Logitech",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
  },
  {
    id: 7,
    name: "Apple Watch Series 9",
    price: 42999,
    category: "Smart Watches",
    brand: "Apple",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
    badge: "Hot",
  },
  {
    id: 8,
    name: "Sony WH-1000XM5",
    price: 29999,
    category: "Headphones",
    brand: "Sony",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400",
    badge: "Trending",
  },
  {
    id: 9,
    name: "AirPods Pro 2",
    price: 24999,
    category: "Earbuds",
    brand: "Apple",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
  },
  {
    id: 10,
    name: "JBL Flip 6",
    price: 11999,
    category: "Speakers",
    brand: "JBL",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
  },
  {
    id: 11,
    name: "PS5 Console",
    price: 54999,
    category: "PlayStation & Xbox",
    brand: "Sony",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    badge: "Hot",
  },
  {
    id: 12,
    name: "Meta Quest 3",
    price: 49999,
    category: "VR Headsets",
    brand: "Meta",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400",
  },
  {
    id: 13,
    name: "Anker PowerCore 20K",
    price: 3999,
    category: "Power Banks",
    brand: "Anker",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
  },
  {
    id: 14,
    name: "SanDisk 1TB SSD",
    price: 8999,
    category: "Storage Devices",
    brand: "SanDisk",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400",
  },
  {
    id: 15,
    name: "Philips Hue Starter Kit",
    price: 12999,
    category: "Smart Lights",
    brand: "Philips",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  },
  {
    id: 16,
    name: "Ring Video Doorbell",
    price: 14999,
    category: "Security Cameras",
    brand: "Ring",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400",
  },
  {
    id: 17,
    name: "Keychron K8 Pro",
    price: 9999,
    category: "Keyboards & Mouse",
    brand: "Keychron",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
  },
  {
    id: 18,
    name: "Amazon Echo Dot",
    price: 4999,
    category: "Voice Assistants",
    brand: "Amazon",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
  },
];

const categoryGroups = [
  {
    group: "Mobile",
    icon: Smartphone,
    categories: ["Smartphones", "Tablets", "Mobile Accessories"],
    color: "bg-primary/10",
  },
  {
    group: "Computing",
    icon: Laptop,
    categories: ["Laptops", "Desktops", "Keyboards & Mouse"],
    color: "bg-primary/10",
  },
  {
    group: "Wearables",
    icon: Watch,
    categories: ["Smart Watches", "Fitness Bands"],
    color: "bg-primary/10",
  },
  {
    group: "Audio",
    icon: Headphones,
    categories: ["Headphones", "Earbuds", "Speakers"],
    color: "bg-primary/10",
  },
  {
    group: "Gaming",
    icon: Gamepad2,
    categories: ["PlayStation & Xbox", "VR Headsets", "Accessories"],
    color: "bg-primary/10",
  },
  {
    group: "Smart Home",
    icon: Home,
    categories: ["Smart Lights", "Security Cameras", "Voice Assistants"],
    color: "bg-primary/10",
  },
  {
    group: "Accessories",
    icon: Usb,
    categories: ["Power Banks", "Cables & Chargers", "Storage Devices"],
    color: "bg-primary/10",
  },
];

const brands = [
  "Apple",
  "Samsung",
  "Dell",
  "Logitech",
  "Sony",
  "JBL",
  "Meta",
  "Anker",
  "SanDisk",
  "Philips",
  "Ring",
  "Keychron",
  "Amazon",
];

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

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-foreground font-semibold">Filters</h3>
        </div>
        {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 transition font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Groups */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Package className="w-4 h-4" />
          Categories
        </h4>
        <div className="space-y-2">
          {categoryGroups.map((group) => {
            const Icon = group.icon;
            const isExpanded = expandedGroups.includes(group.group);

            return (
              <div
                key={group.group}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition group"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg bg-gradient-to-br ${group.color} bg-opacity-10`}
                    >
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition">
                      {group.group}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-2 bg-muted/30">
                    {group.categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 cursor-pointer group pl-8"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
                        />
                        <span className="text-sm text-foreground/80 group-hover:text-primary transition">
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
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Price Range
        </h4>
        <div className="space-y-4 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border">
          <input
            type="range"
            min="0"
            max="200000"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                Min
              </label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="pt-5 text-muted-foreground">-</div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                Max
              </label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value) || 200000,
                  ])
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-primary">
              ৳{priceRange[0].toLocaleString()} - ৳
              {priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Brands
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer group p-2 hover:bg-muted/50 rounded-lg transition"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition font-medium">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-xl border-b border-border/50  shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <h1 className="text-foreground text-2xl sm:text-3xl lg:text-4xl">
              All Products
            </h1>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground text-sm sm:text-base transition"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition font-medium text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden xs:inline">Filters</span>
                </button>

                {/* View Mode */}
                <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 sm:p-2.5 rounded-lg transition ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 sm:p-2.5 rounded-lg transition ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Rows3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="hidden sm:block px-3 sm:px-4 py-2.5 bg-muted border border-border rounded-xl text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium text-sm transition hover:bg-muted/80"
                >
                  <option value="default">Default</option>
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
              className="sm:hidden px-4 py-2.5 bg-muted border border-border rounded-xl text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium text-sm"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Sort: Price Low to High</option>
              <option value="price-high">Sort: Price High to Low</option>
              <option value="rating">Sort: Highest Rated</option>
            </select>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-full text-xs sm:text-sm font-medium border border-primary/20"
                  >
                    {cat}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {selectedBrands.map((brand) => (
                  <div
                    key={brand}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-accent/10 to-accent/5 text-accent rounded-full text-xs sm:text-sm font-medium border border-accent/20"
                  >
                    {brand}
                    <button
                      onClick={() => toggleBrand(brand)}
                      className="hover:bg-accent/20 rounded-full p-0.5 transition"
                    >
                      <X className="w-3 h-3" />
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
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {showMobileFilters && (
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-muted rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <main className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 bg-card/50 rounded-xl p-3 sm:p-4 border border-border/50">
              <p className="text-muted-foreground text-sm sm:text-base">
                Showing{" "}
                <span className="font-bold text-primary text-base sm:text-lg">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            {/* Products */}
            {currentProducts.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 xs:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                      : "flex flex-col gap-3 sm:gap-4"
                  }
                >
                  {currentProducts.map((product) => (
                    <AllProductCardShare
                      key={product.id}
                      {...product}
                      buttonText="Add to Cart"
                      buttonAction={() =>
                        alert(`Added ${product.name} to cart`)
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 flex-wrap">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-muted rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition text-foreground font-medium text-sm"
                    >
                      Previous
                    </button>
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-xl transition font-semibold text-sm ${
                            currentPage === i + 1
                              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-110"
                              : "bg-muted text-foreground hover:bg-muted/80"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-muted rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition text-foreground font-medium text-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-pulse">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                </div>
                <h3 className="text-foreground mb-2 text-lg sm:text-xl font-bold">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md text-sm sm:text-base px-4">
                  We couldn't find any products matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm sm:text-base"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  );
};

export default AllProduct;
