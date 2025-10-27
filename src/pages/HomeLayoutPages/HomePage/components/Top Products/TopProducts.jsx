import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AllFeatureProductShare from "@/Components/Shared/Feature Product/AllFeatureProductShare";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";

// Remove mock product data

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { addToCart: cartAdd, cart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();

  // Fetch top selling products
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/products/top-selling?limit=4");
        // Ensure price is a number for all products
        const productsWithNumericPrices = (response.data.data || []).map(product => ({
          ...product,
          price: typeof product.price === 'number' ? product.price :
                 (product.price && !isNaN(parseFloat(product.price))) ? parseFloat(product.price) : 0
        }));
        setTopProducts(productsWithNumericPrices);
        setError(null);
      } catch (err) {
        console.error("Error fetching top products:", err);
        setError("Failed to load top selling products");
        setTopProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user?.email) {
      toast.warning("Please login first!");
      navigate("/auth/login");
      return;
    }

    // Prepare cart data
    const cartData = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.main || (product.images?.gallery && product.images.gallery[0]) || product.image,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      model: product.model,
      productCode: product.productCode,
      regularPrice: product.regularPrice,
      rating: product.rating,
      totalReviews: product.totalReviews,
      status: product.status,
      keyFeatures: product.keyFeatures,
      specifications: product.specifications,
      description: product.description,
      images: product.images,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    // Check if item already exists in cart
    const exists = cart?.some((item) => item.productId === product._id);

    if (exists) {
      toast.info(`${product.name} is already in your cart.`);
    } else {
      cartAdd(cartData, {
        onSuccess: () => {
          toast.success(`${product.name} added to cart!`);
        },
        onError: () => {
          toast.error("Failed to add to cart");
        }
      });
    }
  };

  const handleAddToFavorites = (product) => {
    if (!user?.email) {
      toast.warning("Please login first!");
      navigate("/auth/login");
      return;
    }

    // Check if product is already in wishlist
    const wishlistItem = wishlist?.find((item) => item.productId === product._id);

    if (wishlistItem) {
      // Remove from wishlist
      removeFromWishlist(wishlistItem._id, {
        onSuccess: () => {
          toast.info(`${product.name} removed from wishlist.`);
        },
        onError: () => {
          toast.error("Failed to remove from wishlist");
        }
      });
    } else {
      // Add to wishlist
      const wishlistData = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.main || (product.images?.gallery && product.images.gallery[0]) || product.image,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        model: product.model,
        productCode: product.productCode,
        regularPrice: product.regularPrice,
        rating: product.rating,
        totalReviews: product.totalReviews,
        status: product.status,
        keyFeatures: product.keyFeatures,
        specifications: product.specifications,
        description: product.description,
        images: product.images,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
      };

      addToWishlist(wishlistData, {
        onSuccess: () => {
          toast.success(`${product.name} added to wishlist!`);
        },
        onError: () => {
          toast.error("Failed to add to wishlist");
        }
      });
    }
  };

  const handleViewAll = () => {
    // Navigate to all products page
    navigate("/allProduct");
  };

  if (loading) {
    return (
      <section className="section bg-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1 h-12 bg-primary rounded"></div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Top Selling Products
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative overflow-hidden bg-muted h-48 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded mb-3 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded mb-3 animate-pulse w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
                    <div className="h-10 bg-muted rounded w-2/5 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section bg-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1 h-12 bg-primary rounded"></div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Top Selling Products
              </h2>
            </div>
          </div>

          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-background ">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10">
          {/* Title with vertical line */}
          <div className="flex items-center gap-4">
            <div className="w-1 h-12 bg-primary rounded"></div>{" "}
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Top Selling Products
            </h2>
          </div>

          {/* View All button */}
          <button
            onClick={handleViewAll}
            className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300 group"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {topProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No top selling products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProducts.map((product) => (
              <div
                key={product._id}
              >
                <AllFeatureProductShare
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToFavorites={handleAddToFavorites}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopProducts;
