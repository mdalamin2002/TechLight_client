import React from "react";
import { Trash2, ShoppingCart, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Link } from "react-router";

const WishlistItem = ({ item, handleRemove, addToCart }) => {
  const discount = Math.round(((item.regularPrice - item.price) / item.regularPrice) * 100);
  const isOutOfStock = item.stock !== "in stock" && item.status !== "approved";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition border-border bg-card">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <Link to={`/allProduct/${item.productId}`} className="relative w-full sm:w-40 md:w-48 h-48 bg-muted rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {discount}% OFF
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <span className="text-white font-semibold text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex justify-between items-start">
              <Link to={`/allProduct/${item.productId}`}>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {item.subcategory}
                </p>
                <h3 className="text-base sm:text-lg font-semibold line-clamp-2 mt-1">
                  {item.name}
                </h3>
              </Link>

              {/* Delete */}
              <button
                onClick={() => handleRemove(item._id)}
                className="text-muted-foreground hover:text-red-500 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg ml-2"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Rating */}
            <Link to={`/allProduct/${item.productId}`} className="flex items-center gap-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(item.rating || 4)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground font-medium">
                {item.rating || 4}
              </span>
            </Link>
          </div>

          {/* Price and Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
            <Link to={`/allProduct/${item.productId}`}>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-2xl font-bold">
                  ৳{item.price.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base text-muted-foreground line-through">
                  ৳{item.regularPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium">
                Save ৳{(item.regularPrice - item.price).toLocaleString()}
              </p>
            </Link>

            <button
              onClick={() => addToCart(item)}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                !isOutOfStock
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm sm:inline hidden">Add to Cart</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WishlistItem;
