import React from "react";
import { Heart, Share2 } from "lucide-react";

const WishlistHeader = ({ itemCount }) => (
  <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border/50">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h1 className="flex items-center justify-center sm:justify-start gap-2 text-xl sm:text-2xl font-semibold">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {itemCount} items saved
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-primary/90 text-primary-foreground rounded-lg hover:opacity-90 transition w-full sm:w-auto">
          <Share2 className="w-4 h-4" />
          <span>Share List</span>
        </button>
      </div>
    </div>
  </div>
);

export default WishlistHeader;
