import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import {
  priceLabel,
  toNumber,
} from "@/pages/HomeLayoutPages/AllProduct/All Product page/product";
import { Link, useNavigate } from "react-router-dom";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import { toast } from "react-toastify";

const AllProductCardShare = ({
  id,
  name,
  image,
  brand,
  subcategory,
  rating = 0,
  price = 0,
  regularPrice = 0,
  status = "In Stock",
  keyFeatures = [],
  buttonText = "Add to Cart",
  variant = "grid",
  userEmail,
}) => {
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    adding,
    removing,
    isLoading,
  } = useWishlist();
  const { cart, addToCart } = useCart();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  const priceNum = toNumber(price);
  const regularPriceNum = toNumber(regularPrice);
  const discount =
    regularPriceNum > 0
      ? Math.round(((regularPriceNum - priceNum) / regularPriceNum) * 100)
      : 0;

  // Check if already in wishlist on mount or wishlist update
  useEffect(() => {
    if (!isLoading && wishlist?.length > 0) {
      const exists = wishlist.some((item) => item.productId === id);
      setIsWishlisted(exists);
    }
  }, [wishlist, id, isLoading]);

  //  Wishlist button handler
  const handleWishlist = () => {
    const wishlistData = {
      productId: id,
      name,
      image,
      brand,
      subcategory,
      price,
      regularPrice,
      status,
      userEmail: userEmail || "guest@example.com",
      createdAt: new Date().toISOString(),
    };

    const wishlistItem = wishlist?.find((item) => item.productId === id);
    const wishlistId = wishlistItem?._id;

    if (!isWishlisted) {
      addToWishlist(wishlistData, {
        onSuccess: () => {
          toast.success(`${name} added to Wishlist!`);
          setIsWishlisted(true);
        },
      });
    } else if (wishlistId) {
      removeFromWishlist(wishlistId, {
        onSuccess: () => {
          toast.info(`${name} removed from Wishlist.`);
          setIsWishlisted(false);
        },
      });
    }
  };


  // Cart handler
  const handleAddToCart = () => {
    const cartData = {
      productId: id,
      name,
      image,
      brand,
      subcategory,
      price,
      regularPrice,
      quantity: 1,
      status,
      userEmail: userEmail || "guest@example.com",
      createdAt: new Date().toISOString(),
    };

    const exists = cart?.some((item) => item.productId === id);

    if (exists) {
      toast.info(`${name} is already in your cart.`);
    } else {
      addToCart(cartData, {
        onSuccess: () => {
          toast.success(`${name} added to your cart!`);
          navigate("/addToCart");
        },
        onError: () => {
          toast.error("Failed to add item to cart.");
        },
      });
    }
  };

  return (
    <div
      className={[
        "group relative bg-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-border/50 hover:border-primary/30",
        variant === "list" ? "md:flex md:items-stretch" : "",
      ].join(" ")}
    >
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-destructive text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          -{discount}%
        </div>
      )}

      <div className="absolute top-3 right-3 z-10 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
        {status}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        disabled={adding || removing}
        className={`absolute cursor-pointer top-14 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 ${
          isWishlisted ? "bg-red-100" : "hover:bg-red-100"
        }`}
      >
        <Heart
          size={18}
          className={`transition-colors ${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-700 hover:text-red-500"
          }`}
        />
      </button>

      {/* View Button */}
      <Link
        to={id}
        className="absolute cursor-pointer top-28 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 delay-75 hover:bg-blue-100"
      >
        <Eye className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors" />
      </Link>

      {/* Product Image */}
      <Link to={id}>
        <div
          className={
            variant === "list"
              ? "relative cursor-pointer bg-muted/30 overflow-hidden md:w-56 md:h-56 flex-shrink-0"
              : "relative cursor-pointer bg-muted/30 overflow-hidden aspect-square"
          }
        >
          <img
            src={image}
            alt={name}
            className={
              variant === "list"
                ? "w-full h-full object-cover"
                : "w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            }
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 space-y-3 flex-1">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">{subcategory}</span>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium w-fit">
            {brand}
          </span>
        </div>

        <Link to={id}>
          <h4 className="font-semibold cursor-pointer text-foreground text-base leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary/90 transition-colors">
            {name}
          </h4>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? "#FFA500" : "none"}
                stroke={i < Math.floor(rating) ? "#FFA500" : "#CBD5E1"}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {rating}
          </span>
        </div>

        <div className="pt-3 space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {priceLabel(price)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {priceLabel(regularPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={18} />
            <span>{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllProductCardShare;
