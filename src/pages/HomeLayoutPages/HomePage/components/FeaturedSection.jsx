import OutlineButton from "@/Components/Shared/Buttots/OutlineButton";
import AllFeatureProductShare from "@/Components/Shared/Feature Product/AllFeatureProductShare";
import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FcViewDetails } from "react-icons/fc";

const products = [
  {
    id: 1,
    name: "4K Smart TV",
    price: "$899",
    image: "https://i.ibb.co.com/W4N2qq64/O9FG5V0.jpg",
    description: "Ultra HD 55-inch Smart TV with HDR10 and voice control.",
    rating: 4.6,
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    price: "$149",
    image: "https://i.ibb.co.com/hFNZ14Vd/high-angle-smart-speaker-home.jpg",
    description: "Portable waterproof Bluetooth speaker with deep bass.",
    rating: 4.3,
  },
  {
    id: 3,
    name: "DSLR Camera Pro",
    price: "$1299",
    image: "https://i.ibb.co.com/mr4ZPFTw/photo-camera-still-life.jpg",
    description: "Professional DSLR with 24MP sensor and 4K video recording.",
    rating: 4.9,
  },

  {
    id: 4,
    name: "Gaming Console Z",
    price: "$499",
    image: "https://i.ibb.co.com/nqdMmt5d/high-angle-controller-vr-glasses.jpg",
    description: "Next-gen gaming console with ultra-fast loading and 1TB SSD.",
    rating: 4.7,
  },
];

const FeaturedSection = () => {
  const handleAddToCart = (name) => alert(`${name} added View Details`);
  const handleWishlist = (name) => alert(`${name} added to wishlist!`);
  const handleQuickView = (name) => alert(`Quick view for ${name}`);
  return (
    <section className="section bg-background">
      <div className="">
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-12">
          <h2>Featured Section</h2>
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

export default FeaturedSection;
