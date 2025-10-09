import React from "react";
import Swal from "sweetalert2";
import useWishlist from "@/hooks/useWishlist";
import WishlistHeader from "./WishlistHeader";
import WishlistItem from "./WishlistItem";
import WishlistSummary from "./WishlistSummary";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to remove this item from your wishlist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromWishlist(id, {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Removed!",
              text: "The item was successfully removed from your wishlist.",
              timer: 1800,
              showConfirmButton: false,
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: "Something went wrong while removing the item.",
            });
          },
        });
      }
    });
  };

  const addToCart = (item) => {
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${item.name} added successfully.`,
      timer: 1800,
      showConfirmButton: false,
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg font-medium">
        Loading wishlist...
      </div>
    );

  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlist.reduce(
    (sum, item) => sum + (item.regularPrice - item.price),
    0
  );

  return (
    <div className="min-h-screen bg-background -mt-7">
      <WishlistHeader itemCount={wishlist.length} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {wishlist.length === 0 ? (
              <Card className="p-12 text-center border-border">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-muted-foreground">Start adding items!</p>
              </Card>
            ) : (
              wishlist.map((item) => (
                <WishlistItem
                  key={item._id}
                  item={item}
                  handleRemove={handleRemove}
                  addToCart={addToCart}
                />
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            <WishlistSummary
              totalItems={wishlist.length}
              totalValue={totalValue}
              totalSavings={totalSavings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
