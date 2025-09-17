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
    rating: 4.6
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    price: "$149",
    image: "https://i.ibb.co.com/hFNZ14Vd/high-angle-smart-speaker-home.jpg",
    description: "Portable waterproof Bluetooth speaker with deep bass.",
    rating: 4.3
  },
  {
    id: 3,
    name: "DSLR Camera Pro",
    price: "$1299",
    image: "https://i.ibb.co.com/mr4ZPFTw/photo-camera-still-life.jpg",
    description: "Professional DSLR with 24MP sensor and 4K video recording.",
    rating: 4.9
  },
  


  {
    id: 4,
    name: "Gaming Console Z",
    price: "$499",
    image: "https://i.ibb.co.com/nqdMmt5d/high-angle-controller-vr-glasses.jpg",
    description: "Next-gen gaming console with ultra-fast loading and 1TB SSD.",
    rating: 4.7
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

const FeaturedSection = () => {

  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-dark">Featured Section</h2>
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
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  loading="lazy"
                />
              </div>

              
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
