import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import StarRating from '@/pages/HomeLayoutPages/HomePage/components/Top Products/StarRating';


const AllFeatureProductShare = ({ product, onAddToCart, onAddToFavorites }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Navigate to dynamic product page
  const handleViewDetails = () => {
    navigate(``);
  };

  return (
    <div
      className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Favorite */}
      <div className="relative overflow-hidden bg-muted h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <button
          onClick={() => onAddToFavorites(product)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 hover:scale-110"
          aria-label="Add to favorites"
        >
          <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Details */}
      <div className="p-5">
        <h4 className="font-semibold text-foreground mb-2 line-clamp-1">{product.name}</h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[40px]">{product.description}</p>
        <div className="mb-3">
          <StarRating rating={product.rating} />
        </div>
        <div className="mb-4 ">
          <span className="text-2xl font-bold text-primary/90">${product.price}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={handleViewDetails}
            className="flex items-center justify-center px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-all duration-200 hover:shadow-md"
            aria-label="View details"
          >
            <Eye className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllFeatureProductShare;
