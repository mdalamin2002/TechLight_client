import AllFeatureProductShare from "@/Components/Shared/Feature Product/AllFeatureProductShare";
import { ArrowRight, Star, TrendingUp, Award, Percent } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import useAxiosSecure from "@/utils/useAxiosSecure";
import GlobalLoading from "@/Components/Shared/Loading/GlobalLoading";

const FeaturedSection = () => {
  const [activeTab, setActiveTab] = useState("discounted");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { addToCart, cart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const axiosSecure = useAxiosSecure();

  // Check if user is a customer (user role)
  const isCustomer = userData?.role === "user";

  const categories = [
    {
      id: "discounted",
      name: "Discounted",
      icon: Percent,
      apiEndpoint: "/products/discounted",
      description: "Special offers"
    },
    {
      id: "high-rated",
      name: "High Rated",
      icon: Star,
      apiEndpoint: "/products/high-rated",
      description: "Highest rated products"
    },
    {
      id: "selected",
      name: "Selected",
      icon: Award,
      apiEndpoint: "/products/selected",
      description: "Curated selection"
    }
  ];

  // Fetch products based on active tab
  const fetchProducts = async (category) => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(`${category.apiEndpoint}?limit=4`);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error(`Error fetching ${category.name} products:`, error);
      toast.error(`Failed to load ${category.name} products`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load products when component mounts or active tab changes
  useEffect(() => {
    const activeCategory = categories.find(cat => cat.id === activeTab);
    if (activeCategory) {
      fetchProducts(activeCategory);
    }
  }, [activeTab]);

  const handleAddToCart = (product) => {
    if (!user?.email) {
      toast.warning("Please login first!");
      navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!isCustomer) {
      toast.warning("Only customers can use this feature");
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
      addToCart(cartData, {
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
      navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!isCustomer) {
      toast.warning("Only customers can use this feature");
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
    const activeCategory = categories.find(cat => cat.id === activeTab);
    if (activeCategory) {
      // Navigate to all products page with category filter
      navigate(`/allProduct?category=${activeTab}`);
    } else {
      navigate("/allProduct");
    }
  };

  const activeCategory = categories.find(cat => cat.id === activeTab);

  return (
    <section className="container mx-auto section bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Title with vertical line */}
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-primary rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Featured Section
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

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Category Description */}
      {activeCategory && (
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">
            {activeCategory.description}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <GlobalLoading />
        </div>
      )}

      {/* Product Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <AllFeatureProductShare
                key={product._id || product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToFavorites={handleAddToFavorites}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No {activeCategory?.name.toLowerCase()} products found.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
