import React from "react";
import {
  Filter,
  X,
  Package,
  ChevronDown,
  ChevronUp,
  Tag,
  TrendingUp,
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
  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-xl shadow-sm">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-lg">Filters</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Refine your search
            </p>
          </div>
        </div>
        {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 transition font-semibold flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Category Groups */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-primary" />
          Categories
        </h4>
        <div className="space-y-2">
          {categoryGroups.map((group) => {
            const Icon = group.icon;
            const isExpanded = expandedGroups.includes(group.group);

            return (
              <div
                key={group.group}
                className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 group-hover:from-primary/25 group-hover:to-primary/10 transition-all">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {group.group}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCategories.some((cat) =>
                      group.categories.includes(cat)
                    ) && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-1.5 bg-muted/20">
                    {group.categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer group pl-9 py-2 rounded-lg hover:bg-background/60 transition-colors"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="peer sr-only"
                          />
                          <div className="w-4.5 h-4.5 border-2 border-muted-foreground/30 rounded-md peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                            {selectedCategories.includes(category) && (
                              <svg
                                className="w-3 h-3 text-primary-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
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
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-600" />
          Price Range
        </h4>
        <div className="space-y-4 p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-gray-200 shadow-sm">
          <div className="relative pt-2">
            <input
              type="range"
              min="0"
              max="200000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-2 block font-bold">
                Min
              </label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <div className="pt-6 text-gray-400 font-bold">—</div>
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-2 block font-bold">
                Max
              </label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value) || 200000])
                }
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/90 rounded-xl shadow-lg">
              <span className="text-sm font-bold text-white">
                ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          Brands
        </h4>
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer group p-3 hover:bg-muted/40 rounded-lg transition-all"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="peer sr-only"
                />
                <div className="w-4.5 h-4.5 border-2 border-muted-foreground/30 rounded-md peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                  {selectedBrands.includes(brand) && (
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-foreground group-hover:text-primary transition-colors font-medium">
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
