import React, { useState } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useLoaderData } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import Reviews from "./Reviews";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const product = useLoaderData();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");
  const axiosPublic = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: relatedProducts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["relatedProducts", product.category],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data.filter(
        (p) => p.category === product.category && p._id !== product._id
      );
    },
  });

  const handleBuyNow = async (product) => {
    try {
      // Check if user is logged in
      if (!user?.email) {
        toast.warning("Please login first!");
        return;
      }

      // Validate product data
      if (!product || !product._id || !product.name || !product.price) {
        toast.error("Invalid product information. Please try again.");
        return;
      }

      // Get user's saved address
      const { data: addresses } = await axiosPublic.get(
        `/addresses/?email=${user.email}`
      );

      const address = Array.isArray(addresses)
        ? addresses.find((addr) => addr.default) || addresses[0]
        : addresses;

      if (!address) {
        toast.error("Please add a shipping address first!");
        return;
      }

      // Calculate total amount
      const totalAmount = product.price * quantity;

      // Show confirmation modal with product details
      const result = await Swal.fire({
        title: "Confirm Your Order",
        html: `
        <div style="text-align: left; font-size: 14px;">
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin-top: 0; color: #16a34a; display: flex; align-items: center;">
              <i class="fas fa-shopping-bag" style="margin-right: 8px;"></i> Product Details
            </h4>
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <img
                src="${
                  product.image ||
                  (product.images?.gallery?.length > 0
                    ? product.images.gallery[0]
                    : "https://via.placeholder.com/100")
                }"
                alt="${product.name}"
                style="width: 80px; height: 80px; margin-right: 15px; border-radius: 8px; object-fit: cover;"
              >
              <div style="flex-grow: 1;">
                <strong style="font-size: 16px;">${product.name}</strong>
                <div style="color: #666; font-size: 13px;">Quantity: ${quantity}</div>
                <div style="color: #666; font-size: 13px;">Price: ${
                  product.price
                }৳</div>
              </div>
              <div style="font-weight: bold; font-size: 16px;">
                ${totalAmount}৳
              </div>
            </div>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin-top: 0; color: #16a34a; display: flex; align-items: center;">
              <i class="fas fa-user" style="margin-right: 8px;"></i> Customer Information
            </h4>
            <p><strong>Name:</strong> ${
              user.displayName || user.name || "Unknown User"
            }</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${address.phone || "N/A"}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin-top: 0; color: #16a34a; display: flex; align-items: center;">
              <i class="fas fa-map-marker-alt" style="margin-right: 8px;"></i> Shipping Address
            </h4>
            <p>${address.street || "N/A"}, ${address.city || "N/A"}, ${
          address.postal || "1000"
        }, Bangladesh</p>
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

      if (!result.isConfirmed) {
        toast.info("Order cancelled.");
        return;
      }

      // Check product availability before payment
      const checkResponse = await axiosPublic.post("/payments/check-products", {
        productIds: [product._id],
      });

      if (checkResponse.data.missing?.length > 0) {
        toast.error("This product is no longer available.");
        return;
      }

      // Prepare payment information
      const paymentData = {
        cart: [
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image || "https://via.placeholder.com/100",
          },
        ],
        customer: {
          name: user.displayName || user.name || "Unknown User",
          email: user.email,
          phone: address.phone || "N/A",
          address: address.street || "N/A",
          city: address.city || "N/A",
          postal: address.postal || "1000",
          country: "Bangladesh",
        },
        currency: "BDT",
      };

      // Send data to backend for payment initialization
      const { data } = await axiosPublic.post("/payments/order", paymentData);

      // Redirect to payment gateway if URL is returned
      if (data?.url) {
        toast.success("Redirecting to payment gateway...");
        window.location.replace(data.url);
      } else {
        toast.error("Payment initialization failed!");
      }
    } catch (error) {
      console.error("Buy Now Error:", error);
      if (error.response?.data?.message) {
        toast.error(`Payment Error: ${error.response.data.message}`);
      } else if (error.response?.status === 404) {
        toast.error("This product is no longer available.");
      } else {
        toast.error("Something went wrong while processing the payment!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-lg -mt-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Products</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-4 py-6 md:py-8 grid lg:grid-cols-12 gap-6 lg:gap-8">
        <ProductGallery
          product={product}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <ProductInfo
          handleBuyNow={() => handleBuyNow(product)}
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>

      {/* Tabs & Related Products */}
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8">
          <ProductTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            product={product}
          />
        </div>

        {/* Related Products */}
        <div className="lg:col-span-4">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Related Products
          </h3>
          {isLoading ? (
            <p>Loading related products...</p>
          ) : isError ? (
            <p>Failed to load related products.</p>
          ) : relatedProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No related products found.
            </p>
          ) : (
            <div className="space-y-3">
              {relatedProducts.map((item) => {
                const itemDiscount = (
                  ((item.regularPrice - item.price) / item.regularPrice) *
                  100
                ).toFixed(0);
                return (
                  <div
                    key={item._id}
                    className="bg-card rounded-lg border border-border p-3 hover:shadow-md transition-all duration-300 cursor-pointer group hover:border-primary/50"
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.images?.gallery?.[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {itemDiscount > 0 && (
                          <div className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                            -{itemDiscount}%
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-xs mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < Math.floor(item.rating)
                                  ? "bg-amber-400"
                                  : "bg-gray-300"
                              } inline-block`}
                            />
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-0.5">
                            {item.rating}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-primary font-bold text-sm">
                            ৳{item.price.toLocaleString()}
                          </span>
                          {item.regularPrice > item.price && (
                            <span className="text-[10px] text-muted-foreground line-through">
                              ৳{item.regularPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
