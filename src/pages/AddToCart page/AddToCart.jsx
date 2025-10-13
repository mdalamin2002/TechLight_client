import React, { useState } from "react";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import CartHeader from "./CartHeader";
import CartItem from "./CartItem";
import AddressCard from "./AddressCard";
import OrderSummary from "./OrderSummary";
import AddressModal from "./AddressModal";
import { Card } from "@/Components/ui/card";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import useAddress from "@/hooks/useAddress";
import GlobalLoading from "@/Components/Shared/Loading/GlobalLoading";
import Swal from "sweetalert2";

const AddToCart = () => {
  const { user } = useAuth();
  const [addressModal, setAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const {
    addresses,
    defaultAddress,
    isLoading: loadingAddresses,
    refetch,
    refetchDefault,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddress();

  const {
    cart,
    isLoading,
    updateQuantity: updateQuantityMutation,
    removeFromCart: removeFromCartMutation,
    updating,
    removing,
  } = useCart();

  const {
    wishlist,
    addToWishlist,
    removing: removingWishlist,
    adding: addingWishlist,
  } = useWishlist();

  // Quantity update
  const handleUpdateQuantity = (id, action) => {
    if (action < 1) return;
    updateQuantityMutation({ id, action: action });
  };

  // Remove item
  const handleRemove = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Remove "${item.name}" from cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCartMutation(item._id, {
          onSuccess: () => toast.info(`${item.name} removed`),
          onError: () => toast.error(`Failed to remove "${item.name}"`),
        });
      }
    });
  };

  // Move to wishlist
  const handleMoveToWishlist = (item) => {
    const isInWishlist = wishlist.some((w) => w.productId === item.productId);
    if (isInWishlist) {
      toast.info(`${item.name} already in wishlist`);
      return;
    }

    addToWishlist(item, {
      onSuccess: () => {
        toast.success(`${item.name} added to wishlist`);
        removeFromCartMutation(item._id);
      },
    });
  };

  // Handle Address Save
  const handleAddressSubmit = async (data) => {
    try {
      if (editingAddress?._id) {
        await updateAddress.mutateAsync({
          id: editingAddress._id,
          updatedData: data,
        });
      } else {
        await addAddress.mutateAsync(data);
      }
      toast.success("Address saved successfully!");
      setAddressModal(false);
      setEditingAddress(null);
      await refetch();
      await refetchDefault();
    } catch (err) {
      toast.error("Failed to save address");
      console.error(err);
    }
  };

  // Cart calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = cart.reduce(
    (sum, item) => sum + (item.regularPrice - item.price) * item.quantity,
    0
  );
  const shippingCost = subtotal > 100000 ? 0 : 500;
  const total = subtotal + shippingCost;

  if (!user) {
    return (
      <Card className="p-10 sm:p-12 text-center border-border">
        <ShoppingCart className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
          Please login to view your cart
        </h3>
      </Card>
    );
  }

  if (isLoading) return <GlobalLoading />;

  return (
    <div className="min-h-screen bg-background -mt-7">
      <CartHeader itemCount={cart.length} />

      <div className="container mx-auto px-3 sm:px-4 py-8">
        {cart.length === 0 ? (
          <Card className="p-10 sm:p-12 text-center border-border">
            <ShoppingCart className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Add some products to get started!
            </p>
            <Link
              to={"/allProduct"}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 text-sm sm:text-base"
            >
              Start Shopping
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const isInWishlist = wishlist.some(
                  (w) => w.productId === item.productId
                );
                return (
                  <CartItem
                    key={item._id}
                    item={item}
                    updateQuantity={handleUpdateQuantity}
                    removeFromCart={() => handleRemove(item)}
                    moveToWishlist={() => handleMoveToWishlist(item)}
                    updating={updating}
                    removing={removing}
                    addingToWishlist={addingWishlist}
                    isInWishlist={isInWishlist}
                  />
                );
              })}
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="sticky top-24 space-y-4">
                <AddressCard
                  savedAddress={defaultAddress}
                  onEdit={() => {
                    setEditingAddress(defaultAddress);
                    setAddressModal(true);
                  }}
                />

                {loadingAddresses && <GlobalLoading />}

                <OrderSummary
                  cartItems={cart}
                  subtotal={subtotal}
                  totalSavings={totalSavings}
                  shippingCost={shippingCost}
                  total={total}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        open={addressModal}
        onOpenChange={setAddressModal}
        onSave={handleAddressSubmit}
        editingAddress={editingAddress}
        addresses={addresses}
        addAddress={addAddress}
        updateAddress={updateAddress}
        deleteAddress={deleteAddress}
        refetch={refetch}
        refetchDefault={refetchDefault}
      />
    </div>
  );
};

export default AddToCart;
