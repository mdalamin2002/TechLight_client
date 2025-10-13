import React from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import WishlistHeader from "./WishlistHeader";
import WishlistItem from "./WishlistItem";
import WishlistSummary from "./WishlistSummary";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router";

const Wishlists = () => {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Single item add to cart
  const handleAddToCart = (item) => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const exists = cart?.some((c) => c.productId === item._id);
    if (exists) {
      toast.info(`${item.name} is already in your cart.`);
      return;
    }

    const cartData = {
      productId: item._id,
      category: item.category,
      subcategory: item.subcategory,
      name: item.name,
      brand: item.brand,
      model: item.model,
      productCode: item.productCode,
      image: item.image,
      rating: item.rating,
      price: item.price,
      regularPrice: item.regularPrice,
      quantity: 1,
      status: item.status,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    addToCart(cartData, {
      onSuccess: () => {
        toast.success(`${item.name} added to your cart!`);

        const wishlistItem = wishlist.find((w) => w.productId === item._id);
        if (wishlistItem) removeFromWishlist(wishlistItem._id);

        navigate("/addToCart");
      },
      onError: () => {
        toast.error("Failed to add item to cart.");
      },
    });
  };

  // Add all items to cart
  const handleAddAllToCart = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    if (wishlist.length === 0) {
      return Swal.fire({
        icon: "info",
        title: "Wishlist Empty!",
        text: "You have no items to add to the cart.",
      });
    }

    const result = await Swal.fire({
      title: "Add All to Cart?",
      text: "Do you want to add all wishlist items to your cart?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, add all!",
    });

    if (result.isConfirmed) {
      try {
        for (const item of wishlist) {
          const exists = cart?.some((c) => c.productId === item._id);
          if (exists) continue;

          const cartData = {
            productId: item._id,
            category: item.category,
            subcategory: item.subcategory,
            name: item.name,
            brand: item.brand,
            model: item.model,
            productCode: item.productCode,
            image: item.image,
            rating: item.rating,
            price: item.price,
            regularPrice: item.regularPrice,
            quantity: 1,
            status: item.status,
            userEmail: user.email,
            createdAt: new Date().toISOString(),
          };

          await new Promise((resolve) =>
            addToCart(cartData, {
              onSuccess: resolve,
              onError: resolve,
            })
          );
        }

        Swal.fire({
          icon: "success",
          title: "All items added!",
          text: "All wishlist items have been added to your cart.",
          timer: 1500,
          showConfirmButton: false,
        });

        toast.success("All wishlist items added to cart!");
        navigate("/addToCart");
      } catch (error) {
        console.error(error);
        toast.error("Some items could not be added.");
      }
    }
  };

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
                  addToCart={() => handleAddToCart(item)}
                />
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            <WishlistSummary
              totalItems={wishlist.length}
              totalValue={totalValue}
              totalSavings={totalSavings}
              handleAddAllToCart={handleAddAllToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlists;
