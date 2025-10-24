import React, { useState } from "react";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import useAddress from "@/hooks/useAddress";
import Swal from "sweetalert2";
import useAxiosSecure from "@/utils/useAxiosSecure";
import GlobalLoading from "@/Components/Shared/Loading/GlobalLoading";
import CartHeader from "@/pages/AddToCart page/CartHeader";
import { Card } from "@/Components/ui/card";
import CartItem from "@/pages/AddToCart page/CartItem";
import AddressCard from "@/pages/AddToCart page/AddressCard";
import OrderSummary from "@/pages/AddToCart page/OrderSummary";
import AddressModal from "@/pages/AddToCart page/AddressModal";

const Cart = () => {
  const { user } = useAuth();
  const [addressModal, setAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const axiosSecure = useAxiosSecure();

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
        toast.success("Address updated successfully!");
      } else {
        await addAddress.mutateAsync(data);
        toast.success("Address added successfully!");
      }
      setAddressModal(false);
      setEditingAddress(null);
      await refetch();
      await refetchDefault();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
      console.error(err);
    }
  };

  // Helper 1: Fetch and validate address
  const getDefaultAddress = async (user, axiosSecure) => {
    try {
      const { data } = await axiosSecure.get(`/addresses/default`);
      const address = data?.data || data;

      if (!address || !address._id) {
        throw new Error("No address found. Please add a shipping address first.");
      }
      return address;
    } catch (error) {
      throw new Error(error.response?.data?.message || "No address found. Please add a shipping address first.");
    }
  };

  // Helper 2: Prepare payment data
  const preparePaymentData = (cart, user, address) => ({
    cart: cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image || "https://via.placeholder.com/100",
    })),
    customer: {
      name: user.displayName || user.name || "Unknown User",
      email: user.email,
      phone: address.phone || "N/A",
      address: address.street || "N/A",
      city: address.city || "N/A",
      postal: address.postal || "",
      country: "Bangladesh",
    },
    currency: "BDT",
  });

  // Helper 3: Validate cart
  const validateCart = (paymentData) => {
    const invalidItems = paymentData.cart.filter(
      (item) => !item.productId || !item.name || !item.quantity
    );
    if (invalidItems.length > 0)
      throw new Error("Invalid cart data. Please refresh and try again.");
  };

  // Helper 4: Check product availability
  const checkProductAvailability = async (
    cart,
    axiosSecure,
    removeFromCartMutation
  ) => {
    const productIds = cart.map((item) => item.productId);
    const { data } = await axiosSecure.post("/payments/check-products", {
      productIds,
    });

    if (data.missing?.length > 0) {
      const missingIds = data.missing;

      missingIds.forEach((missingId) => {
        const itemToRemove = cart.find((item) => item.productId === missingId);
        if (itemToRemove) removeFromCartMutation(itemToRemove._id);
      });

      if (missingIds.length === cart.length)
        throw new Error("All products in your cart are no longer available.");

      throw new Error(
        "Some products were removed as they are no longer available."
      );
    }
  };

  // Helper 5: Show confirmation modal
  const showConfirmationModal = async (paymentData) => {
    const totalAmount = paymentData.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const productListHTML = paymentData.cart
      .map(
        (item) => `
      <div style="display: flex; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}"
          style="width: 60px; height: 60px; margin-right: 12px; border-radius: 8px; object-fit: cover;">
        <div style="flex-grow: 1;">
          <strong style="font-size: 15px;">${item.name}</strong>
          <div style="color: #666; font-size: 13px;">${item.quantity} × ${
          item.price
        }৳</div>
        </div>
        <div style="font-weight: bold; font-size: 15px;">
          ${item.price * item.quantity}৳
        </div>
      </div>
    `
      )
      .join("");

    const result = await Swal.fire({
      title: "Confirm Your Order",
      html: `
      <div style="text-align: left; font-size: 14px;">
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin-top: 0; color: #16a34a; display: flex; align-items: center;">
            <i class="fas fa-shopping-cart" style="margin-right: 8px;"></i> Order Summary
          </h4>
          ${productListHTML}
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin-top: 0; color: #16a34a; display: flex; align-items: center;">
            <i class="fas fa-user" style="margin-right: 8px;"></i> Customer Information
          </h4>
          <p><strong>Name:</strong> ${paymentData.customer.name}</p>
          <p><strong>Email:</strong> ${paymentData.customer.email}</p>
          <p><strong>Phone:</strong> ${paymentData.customer.phone}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin-top: 0; color: #16a34a; display: flex; align-items: center;">
            <i class="fas fa-map-marker-alt" style="margin-right: 8px;"></i> Shipping Address
          </h4>
          <p>${paymentData.customer.address}, ${paymentData.customer.city}, ${paymentData.customer.postal}, ${paymentData.customer.country}</p>
        </div>

        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;">
          <h3 style="margin-top: 0; color: #16a34a;">Total Amount: ${totalAmount}৳</h3>
          <p style="margin-bottom: 0; font-size: 12px; color: #666;">
            <i class="fas fa-lock"></i> Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Confirm & Pay",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      focusConfirm: false,
      width: 500,
      backdrop: true,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });

    return result.isConfirmed;
  };

  // Helper 6: Create payment and redirect
  const createPayment = async (paymentData, axiosSecure) => {
    const { data } = await axiosSecure.post("/payments/order", paymentData);
    if (data?.url) {
      toast.success("Redirecting to payment gateway...");
      window.location.replace(data.url);
    } else {
      throw new Error("Payment initialization failed. Please try again.");
    }
  };

  // Main function
  const handleProceedPayment = async (cart) => {
    try {
      if (!user) return toast.warn("Please login first!");

      const address = await getDefaultAddress(user, axiosSecure);
      const paymentData = preparePaymentData(cart, user, address);
      validateCart(paymentData);
      await checkProductAvailability(cart, axiosSecure, removeFromCartMutation);

      const confirmed = await showConfirmationModal(paymentData);
      if (!confirmed) return toast.info("Payment cancelled.");

      await createPayment(paymentData, axiosSecure);
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while creating the payment."
      );
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
    <div className="min-h-screen bg-background -m-6">
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
                  onAddNew={() => {
                    setEditingAddress(null);
                    setAddressModal(true);
                  }}
                />

                {loadingAddresses && <GlobalLoading />}

                <OrderSummary
                  handleProceedPayment={() => handleProceedPayment(cart)}
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

export default Cart;
