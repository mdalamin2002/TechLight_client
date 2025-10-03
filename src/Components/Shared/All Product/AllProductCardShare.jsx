import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const AllProductCardShare = ({
  id,
  title,
  image,
  brand,
  category,
  rating,
  price,
  badge,
  onAddToCart = () => {}
}) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Badge */}
      {badge && (
        <span
          className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-lg text-white ${
            badge === "Hot"
              ? "bg-purple-600"
              : badge === "Trending"
              ? "bg-rose-500"
              : "bg-blue-500"
          }`}
        >
          {badge}
        </span>
      )}

      {/* Image */}
      <Link to={`/products/${id}`} className="block overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-300"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col">
        {/* Title */}
        <Link
          to={`/products/${id}`}
          className="font-semibold text-gray-800 text-[16px] group-hover:text-blue-600 transition line-clamp-1"
        >
          {title}
        </Link>

        {/* Brand & Category */}
        <p className="text-gray-500 text-sm mt-1">
          {brand} • {category}
        </p>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mt-2 text-yellow-500 text-sm">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
            <span className="text-gray-600 text-xs ml-1">({rating})</span>
          </div>
        )}

        {/* Price */}
        <p className="text-lg font-bold text-rose-600 mt-3">{price}৳</p>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          className="mt-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl transition-all"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default AllProductCardShare;
