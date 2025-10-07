import React from "react";
import { Star } from "lucide-react";

const Reviews = ({ product }) => {
  console.log(product);
  return (
    <div className="bg-card rounded-lg border border-border p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-muted-foreground" />
        </div>
        <h4 className="text-base font-semibold text-foreground mb-2">
          No Reviews Yet
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Be the first to share your experience with this product!
        </p>
        <button className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default Reviews;
