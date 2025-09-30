import OutlineButton from "@/Components/Shared/Buttots/OutlineButton";
import AllFeatureProductShare from "@/Components/Shared/Feature Product/AllFeatureProductShare";
import { ArrowRight } from "lucide-react";
import React from "react";
import Swal from "sweetalert2";

const products = [
  {
    id: 1,
    name: "4K Smart TV",
    price: "899",
    image: "https://i.ibb.co.com/d0nPwJsv/image.png",
    description: "Ultra HD 55-inch Smart TV with HDR10 and voice control.",
    rating: 4.6,
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    price: "149",
    image: "https://i.ibb.co.com/QjFKR9G0/image.png",
    description: "Portable waterproof Bluetooth speaker with deep bass.",
    rating: 4.3,
  },
  {
    id: 3,
    name: "DSLR Camera Pro",
    price: "1299",
    image: "https://i.ibb.co.com/BHwRGztG/image.png",
    description: "Professional DSLR with 24MP sensor and 4K video recording.",
    rating: 4.9,
  },

  {
    id: 4,
    name: "Gaming Console Z",
    price: "499",
    image: "https://i.ibb.co.com/nqdMmt5d/high-angle-controller-vr-glasses.jpg",
    description: "Next-gen gaming console with ultra-fast loading and 1TB SSD.",
    rating: 4.7,
  },
];

const FeaturedSection = () => {
  const handleAddToCart = (product) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${product.name} added to cart!`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleAddToFavorites = (product) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${product.name} added to favorites!`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleViewAll = () => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Redirecting to Top Products...",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  return (
    <section className="container mx-auto section bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        {/* Title with vertical line */}
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-primary rounded-full"></div>{" "}
          {/* vertical line */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Featured Section
          </h2>
        </div>

        {/* View All button */}
        <button
          onClick={handleViewAll}
          className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300 group"
        >
          <span>View All</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <AllFeatureProductShare
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
