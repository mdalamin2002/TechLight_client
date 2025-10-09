import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CartHeader from "./CartHeader";
import CartItem from "./CartItem";
import AddressCard from "./AddressCard";
import OrderSummary from "./OrderSummary";
import { toast } from "react-toastify";
import AddressModal from "./AddressModal";
import { Card } from "@/Components/ui/card";
import { ShoppingCart } from "lucide-react";

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      _id: "68e36199e543e009cf3aeb39",
      category: "Computing",
      subcategory: "Laptops",
      name: 'HP 15-fd0288TU Core i3 13th Gen 15.6" FHD Laptop',
      brand: "HP",
      model: "15-fd0288TU",
      price: 58500,
      regularPrice: 62700,
      status: "In Stock",
      productCode: "45485",
      quantity: 1,
      images: {
        main: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
      },
      rating: 4.6,
    },
    {
      _id: "68e36199e543e009cf3aeb40",
      category: "Audio",
      subcategory: "Headphones",
      name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      brand: "Sony",
      model: "WH-1000XM5",
      price: 34900,
      regularPrice: 39900,
      status: "In Stock",
      productCode: "45486",
      quantity: 2,
      images: {
        main: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
      },
      rating: 4.8,
    },
    {
      _id: "68e36199e543e009cf3aeb41",
      category: "Audio",
      subcategory: "Earbuds",
      name: "Apple AirPods Pro 2nd Generation",
      brand: "Apple",
      model: "AirPods Pro 2",
      price: 24999,
      regularPrice: 29999,
      status: "In Stock",
      productCode: "45487",
      quantity: 1,
      images: {
        main: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&w=600&q=80",
      },
      rating: 4.7,
    },
  ]);
  const [addressModal, setAddressModal] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
    toast.info("Item removed from cart", { position: "top-right" });
  };

  const moveToWishlist = (item) => {
    removeFromCart(item._id);
    toast.success(`${item.name} moved to wishlist`, { position: "top-right" });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.regularPrice - item.price) * item.quantity,
    0
  );
  const shippingCost = subtotal > 100000 ? 0 : 500;
  const total = subtotal + shippingCost;

  const handleAddressSubmit = (data) => {
    setSavedAddress(data);
    setAddressModal(false);
    toast.success("Address saved successfully!", { position: "top-right" });
    reset();
  };

  return (
    <div className="min-h-screen bg-background -mt-7">
      <CartHeader itemCount={cartItems.length} />

      <div className="container mx-auto px-3 sm:px-4 py-8">
        {cartItems.length === 0 ? (
          <Card className="p-10 sm:p-12 text-center border-border">
            <ShoppingCart className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Add some products to get started!
            </p>
            <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 text-sm sm:text-base">
              Start Shopping
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  moveToWishlist={moveToWishlist}
                />
              ))}
            </div>
            <div className="lg:col-span-1 space-y-4">
              <div className="sticky top-24 space-y-4">
                <AddressCard
                  savedAddress={savedAddress}
                  onEdit={() => setAddressModal(true)}
                />
                <OrderSummary
                  cartItems={cartItems}
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
        defaultValues={savedAddress}
      />
    </div>
  );
};

export default AddToCart;
