import React, { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import StarRating from "@/pages/HomeLayoutPages/HomePage/components/Top Products/StarRating";
import { motion } from "framer-motion";

const AllFeatureProductShare = ({ product, onAddToCart, onAddToFavorites }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(``);
  };

  const handleFavoriteClick = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onAddToFavorites(product, newState);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image with Hover Icons */}
      <div className="relative overflow-hidden bg-muted h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Hover Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Heart */}
          <motion.button
            onClick={handleFavoriteClick}
            whileTap={{ scale: 0.8 }}
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
          </motion.button>

          {/* Eye */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleViewDetails}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 hover:bg-blue-100"
            aria-label="View details"
          >
            <Eye className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors" />
          </motion.button>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <h4 className="font-semibold text-foreground mb-2 line-clamp-1">
          {product.name}
        </h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={product.rating} />
        </div>

        {/* Price + Add to Cart in one line */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary/90">
            ${product.price}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AllFeatureProductShare;
