import React, { useState } from "react";
import { ArrowLeft, Share2, Loader2 } from "lucide-react";
import { useLoaderData, useNavigation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import Reviews from "./Reviews";
import useAxiosSecure from "@/utils/useAxiosSecure";

const ProductDetails = () => {
  const product = useLoaderData();
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");
  const axiosPublic = useAxiosSecure();

  // Check if we're in a loading state (navigation in progress)
  const isNavigating = navigation.state === "loading";

  // Show loading state while navigating (BEFORE checking product)
  if (isNavigating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show error state ONLY after loading completes and product is truly missing
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { data: relatedProducts = [], isLoading, isError } = useQuery({
    queryKey: ["relatedProducts", product.category],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data.filter(
        (p) => p.category === product.category && p._id !== product._id
      );
    },
  });

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
