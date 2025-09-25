import React from "react";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import AllFeatureProductShare from "@/Components/Shared/Feature Product/AllFeatureProductShare";
import OutlineButton from "@/Components/Shared/Buttots/OutlineButton";

const products = [
  {
    id: 1,
    name: "Smartphone X200",
    price: "$699",
    image: "https://i.ibb.co.com/h1Bm9YKW/330788-P9-NVVS-165.jpg",
    description: "High-performance smartphone with 5G and 128GB storage.",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Gaming Laptop Pro",
    price: "$1199",
    image:
      "https://i.ibb.co.com/6JPFHv1b/c9e100cb-9265-43f6-9142-ba4e46f4c003.jpg",
    description: "Powerful laptop with RTX graphics and 16GB RAM.",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: "$199",
    image:
      "https://i.ibb.co/W48n2kWQ/headphones-displayed-against-dark-background.jpg",
    description: "Noise-canceling headphones with 30h battery life.",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Smartwatch Z3",
    price: "$249",
    image: "https://i.ibb.co.com/svd0VLbf/rendering-smart-home-device.jpg",
    description:
      "Stylish smartwatch with health adsf aalk;dj dlas f;afldas fakfl;af kfl;dasf",
    rating: 4.0,
  },
];

const TopProducts = () => {
  const handleAddToCart = (name) => alert(`${name} added to cart!`);
  const handleWishlist = (name) => alert(`${name} added to wishlist!`);
  const handleQuickView = (name) => alert(`Quick view for ${name}`);

  return (
    <section className="container mx-auto bg-background mt-30">
      <div className="">
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-12">
          <h2>Top Selling Electronics</h2>
          <OutlineButton>View All</OutlineButton>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <AllFeatureProductShare
              key={p.id}
              product={p}
              handleAddToCart={handleAddToCart}
              handleWishlist={handleWishlist}
              handleQuickView={handleQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProducts;
