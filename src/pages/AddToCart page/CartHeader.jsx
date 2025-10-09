import React from "react";
import { ShoppingCart } from "lucide-react";

const CartHeader = ({ itemCount }) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <h1 className="flex items-center justify-center sm:justify-start gap-2 text-xl sm:text-2xl font-semibold">
              <ShoppingCart className="w-7 h-7 text-primary" />
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {itemCount} items in your cart
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/90 text-primary-foreground rounded-lg hover:opacity-90 transition w-full sm:w-auto text-sm sm:text-base">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
