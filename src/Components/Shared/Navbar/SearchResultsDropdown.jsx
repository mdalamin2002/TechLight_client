import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Package, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/Components/ui/card";

export default function SearchResultsDropdown({ 
  results, 
  loading, 
  query, 
  isOpen, 
  onClose,
  total 
}) {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/allProduct/${productId}`);
    onClose();
  };

  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="max-h-[70vh] overflow-hidden shadow-2xl border border-border bg-background">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Searching products...</span>
                </div>
              )}

              {/* No Results */}
              {!loading && query && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Search className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-semibold mb-1">No products found</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Try searching with different keywords or check the spelling
                  </p>
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
                  {/* Results Header */}
                  <div className="sticky top-0 bg-background border-b border-border px-4 py-3 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        Found {total} result{total !== 1 ? 's' : ''} for "{query}"
                      </span>
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="divide-y divide-border">
                    {results.slice(0, 8).map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                        className="flex items-center gap-4 p-4 hover:bg-accent/50 cursor-pointer transition-colors group"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          {product.image || product.images?.[0] ? (
                            <img
                              src={product.image || product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1 text-foreground transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {product.category && (
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {product.category}
                              </span>
                            )}
                            {product.brand && (
                              <span className="text-xs text-muted-foreground">
                                {product.brand}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0 text-right">
                          <div className="font-semibold text-primary">
                            ${product.price?.toFixed(2) || '0.00'}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-xs text-muted-foreground line-through">
                              ${product.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>

                        {/* Arrow Icon */}
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors" />
                      </div>
                    ))}
                  </div>

                  {/* View All Button */}
                  {total > 8 && (
                    <div className="border-t border-border p-3">
                      <button
                        onClick={handleViewAllResults}
                        className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        View all {total} results
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
