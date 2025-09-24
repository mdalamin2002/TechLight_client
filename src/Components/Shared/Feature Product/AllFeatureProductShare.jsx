import React from "react";
import { FiHeart, FiEye, FiShoppingCart } from "react-icons/fi";

// Dummy Rating Component for example
const Rating = ({ value }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < value ? "text-yellow-500" : "text-gray-300"}>★</span>
  ));
  return <div className="flex items-center">{stars}</div>;
};

const AllFeatureProductShare = ({
  products,
  handleWishlist,
  handleQuickView,
  handleAddToCart
}) => {
  return (
    <section className="mt-15 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-dark">Top Selling Electronics</h2>
          <button
            type="button"
            className="hidden sm:inline-block text-sm font-medium px-5 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-primary transition"
          >
            View All
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="bg-primary rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group flex flex-col"
            >
              {/* Image */}
              <div className="relative cursor-pointer w-full h-54">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-52 h-52 object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <p className="text-sm text-subtext mt-2 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center mt-2 gap-2">
                  <Rating value={product.rating} />
                  <span className="text-[11px] text-gray-500">{product.reviewCount}</span>
                </div>

                {/* Price + Button */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-dark">{product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product.name)}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 bg-[#3749BB] text-[#FFFFFF] text-sm font-medium rounded-lg hover:opacity-90 transition"
                  >
                    <FiShoppingCart size={16} />
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllFeatureProductShare;
