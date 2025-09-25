import React from "react";
import { FiHeart, FiEye, FiShoppingCart } from "react-icons/fi";
import FilledButton from "../Buttots/FilledButton";

// Dummy Rating Component
const Rating = ({ value }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < value ? "text-yellow-500" : "text-gray-300"}>
      ★
    </span>
  ));
  return <div className="flex items-center">{stars}</div>;
};

const AllFeatureProductShare = ({ product, handleWishlist, handleQuickView, handleAddToCart }) => {
  return (
    <article className="bg-primary rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative cursor-pointer w-full h-54 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => handleWishlist(product.name)}
            className="p-2 rounded-full bg-white shadow hover:bg-rose-500 hover:text-white transition"
            aria-label="Wishlist"
          >
            <FiHeart size={18} />
          </button>
          <button
            onClick={() => handleQuickView(product.name)}
            className="p-2 rounded-full bg-white shadow hover:bg-green-500 hover:text-white transition"
            aria-label="Quick View"
          >
            <FiEye size={18} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-semibold text-dark">{product.name}</h3>
          <p className="text-sm text-subtext mt-2 line-clamp-3">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center mt-2 gap-2">
          <Rating value={product.rating} />
          {product.reviewCount && (
            <span className="text-[11px] text-gray-500">{product.reviewCount}</span>
          )}
        </div>

        {/* Price + Button */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-dark">{product.price}</span>
          <FilledButton
            onClick={() => handleAddToCart(product.name)}
            className="flex items-center gap-2 "
          >
            <FiShoppingCart size={16} />
            Add
          </FilledButton>
        </div>
      </div>
    </article>
  );
};

export default AllFeatureProductShare;
