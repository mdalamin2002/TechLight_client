import React from "react";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const products = [
  {
    id: 1,
    name: "Smartphone X200",
    price: "$699",
    image: "https://i.ibb.co.com/h1Bm9YKW/330788-P9-NVVS-165.jpg",
    description: "High-performance smartphone with 5G and 128GB storage.",
    rating: 4.5
  },
  {
    id: 2,
    name: "Gaming Laptop Pro",
    price: "$1199",
    image: "https://i.ibb.co.com/6JPFHv1b/c9e100cb-9265-43f6-9142-ba4e46f4c003.jpg",
    description: "Powerful laptop with RTX graphics and 16GB RAM.",
    rating: 4.8
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: "$199",
    image: "https://i.ibb.co/W48n2kWQ/headphones-displayed-against-dark-background.jpg",
    description: "Noise-canceling headphones with 30h battery life.",
    rating: 4.2
  },
  {
    id: 4,
    name: "Smartwatch Z3",
    price: "$249",
    image: "https://i.ibb.co.com/svd0VLbf/rendering-smart-home-device.jpg",
    description: "Stylish smartwatch with health adsf aalk;dj dlas f;afldas fakfl;af kfl;dasf",
    rating: 4.0
  }
];

// Rating Component
const Rating = ({ value }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push(<AiFillStar key={i} className="text-yellow-400" />);
    else if (i === fullStars && halfStar) stars.push(<AiFillStar key={i} className="text-yellow-400 opacity-50" />);
    else stars.push(<AiOutlineStar key={i} className="text-yellow-400" />);
  }

  return <div className="flex items-center gap-1 mt-1">{stars}</div>;
};

const TopProducts = () => {
  const handleAddToCart = (name) => alert(`${name} added to cart!`);
  const handleWishlist = (name) => alert(`${name} added to wishlist!`);
  const handleQuickView = (name) => alert(`Quick view for ${name}`);

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
              <div className="relative cursor-pointer w-full h-54 sm:h-54 md:h-54 lg:h-54">
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
                    className="p-2 rounded-full bg-white shadow hover:bg-red-400 hover:bg-accent hover:text-primary transition"
                    aria-label="Wishlist"
                  >
                    <FiHeart size={18} />
                  </button>
                  <button
                    onClick={() => handleQuickView(product.name)}
                    className="p-2 rounded-full bg-white shadow hover:bg-green-200 hover:bg-accent hover:text-primary transition"
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
                <div className="flex items-center mt-2 gap-2">
                  <Rating value={product.rating} /><span className="text-[11px]">420</span>
                </div>

                {/* Price + Cart */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-dark">{product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product.name)}
                    
                    className=" flex items-center gap-2 px-3 py-2 bg-[#3749BB] text-[#FFFFFF] text-sm font-medium rounded-lg hover:opacity-90 transition"
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

export default TopProducts;
