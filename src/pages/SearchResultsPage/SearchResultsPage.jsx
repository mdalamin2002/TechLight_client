import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, Grid3x3, List, ChevronLeft, Loader2, Tag } from "lucide-react";
import useProductSearch from "@/hooks/useProductSearch";
import LaptopCard from "@/Components/Cards/LaptopCard/LaptopCard";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { getCategoryDisplayName, getNoProductsInCategoryMessage } from "@/utils/categoryMapping";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("relevance");
  const [hasSearched, setHasSearched] = useState(false);
  
  // State for category-based search
  const [categoryResults, setCategoryResults] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [categoryError, setCategoryError] = useState(null);

  // Use standard search hook for text-based search
  const { results: textResults, loading: textLoading, error: textError, hasMore, total: textTotal, loadMore } = useProductSearch(queryParam);

  // Fetch category-based results
  useEffect(() => {
    const fetchCategoryResults = async () => {
      if (!categoryParam) {
        setCategoryResults([]);
        setCategoryLoading(false);
        return;
      }

      try {
        setCategoryLoading(true);
        setCategoryError(null);
        
        const response = await axiosPublic.get('/products/search', {
          params: {
            category: categoryParam,
            q: queryParam || undefined, // Include text search if present
            limit: 100,
          },
        });

        setCategoryResults(response.data.data || []);
        setCategoryTotal(response.data.total || 0);
        setHasSearched(true);
      } catch (err) {
        console.error('Category search error:', err);
        setCategoryError(err.message || 'Failed to load category results');
        setCategoryResults([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryResults();
  }, [categoryParam, queryParam, axiosPublic]);

  // Determine which results to use
  const results = categoryParam ? categoryResults : textResults;
  const loading = categoryParam ? categoryLoading : textLoading;
  const error = categoryParam ? categoryError : textError;
  const total = categoryParam ? categoryTotal : textTotal;

  // Sync local state with URL params
  useEffect(() => {
    setSearchQuery(queryParam);
    if (queryParam || categoryParam) {
      setHasSearched(true);
    }
  }, [queryParam, categoryParam]);

  // Handle search submission
  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      // Clear category filter when doing text search
      setSearchParams({ q: searchQuery.trim() });
    }
  };
  
  // Handle category clear
  const clearCategoryFilter = () => {
    if (queryParam) {
      setSearchParams({ q: queryParam });
    } else {
      setSearchParams({});
    }
  };

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "relevance":
      default:
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Back Button & Title */}
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Search Results</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="pl-12 pr-4 h-12 rounded-xl"
              />
            </div>
          </form>

          {/* Results Info & Controls */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {(queryParam || categoryParam) && (
                <>
                  {loading ? (
                    <span>Searching{categoryParam ? ` in ${getCategoryDisplayName(categoryParam)}` : ''}...</span>
                  ) : (
                    <span>
                      Found <strong className="text-foreground">{total}</strong> result
                      {total !== 1 ? "s" : ""}
                      {queryParam && <> for "<strong className="text-foreground">{queryParam}</strong>"</>}
                      {categoryParam && (
                        <span className="inline-flex items-center ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {getCategoryDisplayName(categoryParam)}
                          <button 
                            onClick={clearCategoryFilter}
                            className="ml-1 hover:text-primary/80"
                            aria-label="Clear category filter"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* View & Sort Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-10">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 rounded-none"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10 rounded-none border-l border-border"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Searching products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg">
            <p className="font-medium">Error loading results</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* No Results - Only show if search was actually performed */}
        {!loading && (queryParam || categoryParam) && hasSearched && results.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              {categoryParam ? getNoProductsInCategoryMessage(categoryParam, 'english').split('.')[0] : "No products found"}
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              {categoryParam ? (
                <>{getNoProductsInCategoryMessage(categoryParam, 'english')}</>
              ) : (
                <>We couldn't find any products matching "{queryParam}". Try different keywords or check the spelling.</>
              )}
            </p>
            {categoryParam && (
              <Button onClick={clearCategoryFilter} variant="outline" className="mt-4">
                Clear Category Filter
              </Button>
            )}
          </div>
        )}

        {/* Results Grid/List */}
        {!loading && results.length > 0 && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {sortedResults.map((product) => (
                <LaptopCard
                  key={product._id}
                  product={product}
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              ))}
            </div>

            {/* Load More Button - Only for text search, not category */}
            {hasMore && !categoryParam && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  size="lg"
                  className="px-8"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Products"
                  )}
                </Button>
              </div>
            )}

            {/* End of Results Message */}
            {!hasMore && results.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You've reached the end of search results</p>
              </div>
            )}
          </>
        )}

        {/* Empty State (no query) */}
        {!queryParam && !categoryParam && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Start your search</h2>
            <p className="text-muted-foreground">
              Enter a search term to find products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
