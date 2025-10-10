import React from "react";
import { Trash2, Plus, Minus, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CartItem = ({
  item,
  updateQuantity,
  removeFromCart,
  moveToWishlist,
  updating = false,
  removing = false,
}) => {
  const discount = Math.round(
    ((item.regularPrice - item.price) / item.regularPrice) * 100
  );

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-border bg-card">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="relative w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={item.images?.main || item.image}
              alt={item.name}
              className="w-full h-full object-contain p-3"
            />
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded text-xs font-bold">
                {discount}% OFF
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                {item.subcategory}
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mt-1 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Code: {item.productCode}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
              <div>
                <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                  <span className="text-lg sm:text-xl font-bold text-foreground">
                    ৳{item.price.toLocaleString()}
                  </span>
                  {item.regularPrice > item.price && (
                    <span className="text-xs sm:text-sm text-muted-foreground line-through">
                      ৳{item.regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-green-600 font-medium">
                  Save ৳
                  {(
                    (item.regularPrice - item.price) *
                    item.quantity
                  ).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item._id, "decrease")}
                    className="p-2 hover:bg-muted transition-colors"
                    disabled={updating || item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-semibold text-foreground text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, "increase")}
                    className="p-2 hover:bg-muted transition-colors"
                    disabled={updating}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-base sm:text-lg font-bold text-foreground">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-3 pt-3 border-t border-border">
              <button
                onClick={() => moveToWishlist(item)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <Heart className="w-4 h-4" /> Wishlist
              </button>

              <button
                onClick={() => removeFromCart(item)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                disabled={removing}
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
