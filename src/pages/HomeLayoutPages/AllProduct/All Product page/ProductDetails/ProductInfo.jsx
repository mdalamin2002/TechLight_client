import React, { useState, useEffect } from "react";
import { Star, Check, Minus, Plus, ShoppingCart, Heart, Truck, RefreshCw, MapPin, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";

const ProductInfo = ({ product, quantity, setQuantity, handleBuyNow, reviewsStats }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist, isLoading } = useWishlist();
  const { user, userData } = useAuth();

  // Check if user is a customer (user role)
  const isCustomer = userData?.role === "user";

  // Check wishlist state
  useEffect(() => {
    if (!isLoading && wishlist?.length > 0) {
      const exists = wishlist.some((item) => item.productId === product._id);
      setIsFavorite(exists);
    }
  }, [wishlist, product._id, isLoading]);

  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity((prev) => prev + 1);
    else if (type === "decrement" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!user?.email) {
      toast.warning("Please login first!");
      navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!isCustomer) {
      toast.warning("Only customers can use this feature");
      return;
    }

    const cartData = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.main,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      model: product.model,
      productCode: product.productCode,
      regularPrice: product.regularPrice,
      rating: product.rating,
      totalReviews: product.totalReviews,
      status: product.status,
      keyFeatures: product.keyFeatures,
      specifications: product.specifications,
      description: product.description,
      images: product.images,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    // Check if item already exists in cart
    const exists = cart?.some((item) => item.productId === product._id);

    if (exists) {
      toast.info(`${product.name} is already in your cart.`);
    } else {
      addToCart(cartData, {
        onSuccess: () => {
          toast.success(`${product.name} added to cart!`);
        },
        onError: () => {
          toast.error("Failed to add to cart");
        }
      });
    }
  };

  const handleAddToWishlist = () => {
    if (!user?.email) {
      toast.warning("Please login first!");
      navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!isCustomer) {
      toast.warning("Only customers can use this feature");
      return;
    }

    const wishlistData = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.main,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      model: product.model,
      productCode: product.productCode,
      regularPrice: product.regularPrice,
      rating: product.rating,
      totalReviews: product.totalReviews,
      status: product.status,
      keyFeatures: product.keyFeatures,
      specifications: product.specifications,
      description: product.description,
      images: product.images,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    const wishlistItem = wishlist?.find((item) => item.productId === product._id);
    const wishlistId = wishlistItem?._id;

    if (!isFavorite) {
      addToWishlist(wishlistData, {
        onSuccess: () => {
          toast.success(`${product.name} added to wishlist!`);
          setIsFavorite(true);
        },
        onError: () => {
          toast.error("Failed to add to wishlist");
        }
      });
    } else if (wishlistId) {
      removeFromWishlist(wishlistId, {
        onSuccess: () => {
          toast.info(`${product.name} removed from wishlist.`);
          setIsFavorite(false);
        },
        onError: () => {
          toast.error("Failed to remove from wishlist");
        }
      });
    }
  };

  const isInWishlist = isFavorite;

  // Calculate dynamic rating and total reviews from reviewsStats
  const dynamicRating = reviewsStats?.averageRating || product?.rating || 0;
  const totalReviews = reviewsStats?.totalReviews || product?.totalReviews || 0;
  const satisfactionPercentage = dynamicRating > 0 ? Math.round((dynamicRating * 100) / 5) : 0;

  return (
    <div className="lg:col-span-5 space-y-4">
      {/* Brand & Status */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
          {product.brand}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${
            product.stock === "in stock" || product.status === "approved"
              ? "text-emerald-600 bg-emerald-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          <Check className="w-3 h-3" />
          {product.stock === "in stock" ? "In Stock" : product.status === "approved" ? "In Stock" : "Out of Stock"}
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
                className={`w-3.5 h-3.5 ${i < Math.floor(dynamicRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">{dynamicRating.toFixed(1)}</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <span className="text-xs text-muted-foreground">{totalReviews} Reviews</span>
        <div className="h-3 w-px bg-border" />
        <span className="text-xs text-muted-foreground">{satisfactionPercentage}% Satisfaction</span>
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
          <button onClick={handleBuyNow} className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground py-3.5 px-6 rounded-lg text-base font-semibold hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-2">
            Buy Now
          </button>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-muted text-foreground py-2 px-3 rounded-md text-xs font-medium hover:bg-primary/10 transition-all duration-300 border border-border"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add to Cart</span>
          </button>

          <button
            onClick={handleAddToWishlist}
            className={`p-2.5 rounded-md border-2 transition-all duration-300 ${
              isInWishlist ? "bg-red-50 border-red-500 text-red-500" : "border-border hover:border-primary hover:bg-muted"
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
