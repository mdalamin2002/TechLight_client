import React, { useState } from "react";
import { Quote, Verified, ThumbsUp, TrendingUp } from "lucide-react";
import StarRating from "./StarRating";

const ReviewCard = ({ review }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.helpful);

  const handleLike = () => {
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  return (
    <div className="group relative bg-card rounded-2xl border border-border p-6 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
        <Quote className="w-6 h-6 text-white" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300"
            />
            {review.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-card">
                <Verified className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {review.name}
            </h5>
            <p className="text-xs text-muted-foreground">{review.role}</p>
          </div>
        </div>
        <div className="text-right">
          <StarRating rating={review.rating} />
          <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
        </div>
      </div>

      {/* Product Tag */}
      <div className="mb-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
          <TrendingUp className="w-3 h-3" />
          {review.product}
        </span>
      </div>

      {/* Review Text */}
      <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
        "{review.review}"
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isLiked
              ? "bg-primary/10 text-primary"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-primary" : ""}`} />
          <span className="text-sm">Helpful ({likeCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
