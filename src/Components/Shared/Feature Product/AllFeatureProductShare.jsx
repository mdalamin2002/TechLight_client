import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import StarRating from "@/pages/HomeLayoutPages/HomePage/components/Top Products/StarRating";
import useWishlist from "@/hooks/useWishlist";

const AllFeatureProductShare = ({ product, onAddToCart, onAddToFavorites }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { wishlist, isLoading } = useWishlist();

  // Check if product is in wishlist
  useEffect(() => {
    if (!isLoading && wishlist?.length > 0 && (product?._id || product?.id)) {
      const productId = product._id || product.id;
      const exists = wishlist.some((item) => item.productId === productId);
      setIsFavorite(exists);
    } else if (!isLoading && (!wishlist || wishlist.length === 0)) {
      setIsFavorite(false);
    }
  }, [wishlist, product?._id, product?.id, isLoading]);

  const handleViewDetails = () => {
    // Navigate to product details page with the product ID
    const productId = product._id || product.id;
    if (productId) {
      navigate(`/allProduct/${productId}`);
    }
  };

  const handleFavoriteClick = () => {
    onAddToFavorites(product);
  };

  // Handle cases where product data might be missing
  const productImage =
    product.images?.main ||
    (product.images && product.images.gallery && product.images.gallery[0]) ||
    (product.images && product.images.main) ||
    product.image ||
    "https://via.placeholder.com/400x300?text=No+Image";

  const productName = product.name || "Unnamed Product";
  const productDescription = product.description || "No description available";
  // Ensure productPrice is a number
  const productPrice =
    typeof product.price === "number"
      ? product.price
      : product.price && !isNaN(parseFloat(product.price))
      ? parseFloat(product.price)
      : 0;
  const productRating =
    typeof product.rating === "number"
      ? product.rating
      : product.rating && !isNaN(parseFloat(product.rating))
      ? parseFloat(product.rating)
      : 0;

  return (
    <div className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image with Hover Icons */}
      <div className="relative overflow-hidden bg-muted h-48">
        <img
        onClick={handleViewDetails}
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=Image+Error";
          }}
        />

        {/* Discount Badge */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{product.discountPercentage}%
          </div>
        )}

        {/* Hover Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Heart */}
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full shadow-md transition-all duration-200
      ${isFavorite ? "bg-red-100" : "bg-white/90 hover:bg-red-100"}
    `}
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 transition-colors
        ${
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-gray-700 hover:text-red-500"
        }
      `}
            />
          </button>

          {/* Eye */}
          <button
            onClick={handleViewDetails}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 hover:bg-blue-100"
            aria-label="View details"
          >
            <Eye className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <h4 onClick={handleViewDetails} className="font-semibold cursor-pointer hover:text-primary text-foreground mb-2 line-clamp-1">
          {productName}
        </h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[40px]">
          {productDescription}
        </p>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={productRating} />
        </div>

        {/* Price + Add to Cart in one line */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary/90">
              ${productPrice.toFixed(2)}
            </span>
            {product.regularPrice && product.regularPrice > productPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.regularPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllFeatureProductShare;
