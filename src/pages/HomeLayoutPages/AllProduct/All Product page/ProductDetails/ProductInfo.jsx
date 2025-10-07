import React, { useState } from "react";
import { Star, Check, Minus, Plus, ShoppingCart, Heart, Truck, RefreshCw, MapPin, Shield, Clock } from "lucide-react";

const ProductInfo = ({ product, quantity, setQuantity }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity((prev) => prev + 1);
    else if (type === "decrement" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="lg:col-span-5 space-y-4">
      {/* Brand & Status */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
          {product.brand}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${
            product.status === "In Stock"
              ? "text-emerald-600 bg-emerald-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          <Check className="w-3 h-3" />
          {product.status}
        </span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">
          {product.name}
        </h1>
        <p className="text-xs text-muted-foreground">
          Model: <span className="text-foreground font-medium">{product.model}</span> | Code:{" "}
          <span className="text-foreground font-medium">{product.productCode}</span>
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">{product.rating}</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <span className="text-xs text-muted-foreground">{product.totalReviews} Reviews</span>
      </div>

      {/* Price */}
      <div className="py-2">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-2xl md:text-3xl font-bold text-primary">
            ৳{product.price.toLocaleString()}
          </span>
          {product.regularPrice > product.price && (
            <span className="text-lg text-muted-foreground line-through">
              ৳{product.regularPrice.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Tax included. Shipping calculated at checkout.</p>
      </div>

      {/* Key Features */}
      <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-2">Key Features</h3>
        <div className="grid grid-cols-1 gap-1.5">
          {product.keyFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-foreground leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">Quantity:</span>
          <div className="flex items-center border-2 border-border rounded-lg overflow-hidden bg-card">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-4 py-2 font-semibold text-sm min-w-[50px] text-center border-x-2 border-border">
              {quantity}
            </span>
            <button onClick={() => handleQuantityChange("increment")} className="p-2 hover:bg-muted transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground py-3.5 px-6 rounded-lg text-base font-semibold hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-2">
            Buy Now
          </button>

          <button className="flex items-center justify-center gap-2 bg-muted text-foreground py-2 px-3 rounded-md text-xs font-medium hover:bg-primary/10 transition-all duration-300 border border-border">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add to Cart</span>
          </button>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2.5 rounded-md border-2 transition-all duration-300 ${
              isFavorite ? "bg-red-50 border-red-500 text-red-500" : "border-border hover:border-primary hover:bg-muted"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
