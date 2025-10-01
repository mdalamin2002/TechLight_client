import React from "react";
import { ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AllFeatureProductShare from "@/Components/Shared/Feature Product/AllFeatureProductShare";

// Mock product data
const topProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description:
      "High-quality sound with active noise cancellation for immersive experience",
    price: 299.99,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    description:
      "Track your fitness goals with advanced health monitoring features",
    price: 399.99,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    description:
      "Premium comfort for long work hours with adjustable lumbar support",
    price: 449.99,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "4K Ultra HD Camera",
    description:
      "Capture stunning moments with professional-grade image quality",
    price: 899.99,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop",
  },
];

const TopProducts = () => {
  const handleAddToCart = (product) => {
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${product.name} has been added to your cart.`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  const handleAddToFavorites = (product, isAdding) => {
    Swal.fire({
      icon: isAdding ? "success" : "info",
      title: isAdding ? "Added to Favorites!" : "Removed from Favorites!",
      text: `${product.name} has been ${
        isAdding ? "added to" : "removed from"
      } your favorites.`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  const handleViewAll = () => {
    Swal.fire({
      icon: "info",
      title: "Redirecting...",
      text: "Going to the Top Products page",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  return (
    <section className="section bg-background ">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10">
          {/* Title with vertical line */}
          <div className="flex items-center gap-4">
            <div className="w-1 h-12 bg-primary rounded"></div>{" "}
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Top Selling Products
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map((product) => (
            <AllFeatureProductShare
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToFavorites={handleAddToFavorites}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProducts;
