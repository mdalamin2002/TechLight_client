// src/pages/AllProduct.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import ProductsHeader from "./ProductsHeader";
import FiltersPanel from "./FiltersPanel";
import ProductCard from "./ProductCard";

import { normalizeProduct, toNumber } from "./product";
import Pagination from "./Pagination";

const AllProduct = () => {
  const axiosPublic = useAxiosPublic();

  // UI states
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const productsPerPage = 12;

  // Fetch products
  const {
    data: allProductsRaw,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/products");
      const arr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.items)
        ? res.data.items
        : [];
      return arr.map(normalizeProduct);
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const allProducts = allProductsRaw ?? [];

  // Derive filters meta
  const { categoryGroups, brands, minPrice, maxPrice } = useMemo(() => {
    const categoryMap = new Map();
    const brandSet = new Set();
    let minP = Infinity;
    let maxP = 0;

    allProducts.forEach((p) => {
      const price = toNumber(p.price);
      minP = Math.min(minP, price);
      maxP = Math.max(maxP, price);

      if (p.brand) brandSet.add(p.brand);
      if (p.category && p.subcategory) {
        if (!categoryMap.has(p.category))
          categoryMap.set(p.category, new Set());
        categoryMap.get(p.category).add(p.subcategory);
      }
    });

    return {
      categoryGroups: Array.from(categoryMap.entries()).map(
        ([group, subs]) => ({
          group,
          categories: Array.from(subs).sort(),
        })
      ),
      brands: Array.from(brandSet).sort(),
      minPrice: isFinite(minP) ? minP : 0,
      maxPrice: maxP || 200000,
    };
  }, [allProducts]);

  // Keep price range within data bounds
  useEffect(() => {
    if (allProducts.length) {
      setPriceRange((prev) => [
        Math.max(minPrice, prev[0] ?? minPrice),
        Math.min(maxPrice, prev[1] ?? maxPrice),
      ]);
    }
  }, [minPrice, maxPrice, allProducts.length]);

  // Handlers
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
    setPriceRange([minPrice || 0, maxPrice || 200000]);
    setSortBy("default");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePriceChange = (type, value) => {
    const num = parseInt(value, 10) || 0;
    if (type === "min") setPriceRange(([_, max]) => [Math.min(num, max), max]);
    else setPriceRange(([min]) => [min, Math.max(num, min)]);
    setCurrentPage(1);
  };

  const handleQuickRange = (min, max) => {
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  // Filter + sort + paginate
  const filteredProducts = useMemo(() => {
    let list = allProducts;

    if (searchQuery) {
      const q = searchQuery.toLowerCase().replace(/\s+/g, "");
      list = list.filter((p) => {
        const name = p.name?.toLowerCase().replace(/\s+/g, "");
        const brand = p.brand?.toLowerCase().replace(/\s+/g, "");
        const subcategory = p.subcategory?.toLowerCase().replace(/\s+/g, "");
        return (
          name?.includes(q) || brand?.includes(q) || subcategory?.includes(q)
        );
      });
    }

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.subcategory));
    }
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    list = list.filter((p) => {
      const price = toNumber(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price-low":
        list = [...list].sort((a, b) => toNumber(a.price) - toNumber(b.price));
        break;
      case "price-high":
        list = [...list].sort((a, b) => toNumber(b.price) - toNumber(a.price));
        break;
      case "rating":
        list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    return list;
  }, [
    allProducts,
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="min-h-screen bg-background -mt-7">
      <ProductsHeader
        title="All Products"
        subtitle="Discover our complete collection"
        searchQuery={searchQuery}
        onSearchChange={(v) => {
          setSearchQuery(v);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={(v) => {
          setSortBy(v);
          setCurrentPage(1);
        }}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        onRemoveCategory={toggleCategory}
        onRemoveBrand={toggleBrand}
        onOpenFilters={() => setShowMobileFilters(true)}
      />

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex gap-4 lg:gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-lg">
              <FiltersPanel
                categoryGroups={categoryGroups}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                brands={brands}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                priceRange={priceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
                onQuickRange={handleQuickRange}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </aside>

          {/* Mobile Filters Drawer */}
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

                <FiltersPanel
                  categoryGroups={categoryGroups}
                  selectedCategories={selectedCategories}
                  toggleCategory={(c) => {
                    toggleCategory(c);
                  }}
                  brands={brands}
                  selectedBrands={selectedBrands}
                  toggleBrand={(b) => {
                    toggleBrand(b);
                  }}
                  priceRange={priceRange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceChange}
                  onQuickRange={handleQuickRange}
                  clearAllFilters={clearAllFilters}
                />
              </div>
            </div>
          )}

          {/* Main */}
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

            {isError ? (
              <div className="py-16 text-center text-destructive font-semibold">
                Failed to load products. Please try again.
              </div>
            ) : isLoading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                    : "flex flex-col gap-3 sm:gap-4"
                }
              >
                {[...Array(productsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-muted/40 animate-pulse rounded-2xl border border-border"
                  />
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                      : "flex flex-col gap-3 sm:gap-4"
                  }
                >
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      buttonText="Add to Cart"
                      buttonAction={() =>
                        alert(`Added ${product.name} to cart`)
                      }
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center shadow-2xl">
                    <Search className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <h3 className="text-foreground mb-3 text-2xl font-bold">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md text-base px-4 leading-relaxed">
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
