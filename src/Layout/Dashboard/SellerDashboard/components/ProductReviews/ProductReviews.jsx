import React, { useState, useEffect } from "react";
import { Star, TrendingUp, MessageSquare, Package, Calendar } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const SellerProductReviews = () => {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const axiosSecure = useAxiosSecure();

  // Fetch seller products and reviews
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch seller products
        const productsResponse = await axiosSecure.get("/products/seller");
        const products = productsResponse.data.data || [];
        setSellerProducts(products);

        // Fetch reviews for all seller products
        if (products.length > 0) {
          // Get all product IDs
          const productIds = products.map(product => product._id);
          
          // Fetch reviews for all products
          const reviewsPromises = productIds.map(productId => 
            axiosSecure.get(`/reviews/product/${productId}`)
          );
          
          const reviewsResponses = await Promise.all(reviewsPromises);
          
          // Combine all reviews
          const allReviews = reviewsResponses.flatMap(response => 
            response.data.data?.reviews || []
          );
          
          setReviews(allReviews);
        }
      } catch (err) {
        setError("Failed to fetch products and reviews");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  // Filter and sort products
  const filteredAndSortedProducts = () => {
    let result = [...sellerProducts];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort products
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "rating") {
        const aReviews = reviews.filter(r => r.productId === a._id);
        const bReviews = reviews.filter(r => r.productId === b._id);
        
        const aAvg = aReviews.length > 0 
          ? aReviews.reduce((sum, r) => sum + r.rating, 0) / aReviews.length 
          : 0;
        const bAvg = bReviews.length > 0 
          ? bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length 
          : 0;
          
        return bAvg - aAvg; // Descending order for ratings
      }
      return 0; // Default order
    });
    
    return result;
  };

  // Get average rating for a product
  const getAverageRating = (productId) => {
    const productReviews = reviews.filter(r => r.productId === productId);
    if (productReviews.length === 0) return 0;
    
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / productReviews.length).toFixed(1);
  };

  // Get total reviews for a product
  const getTotalReviews = (productId) => {
    return reviews.filter(r => r.productId === productId).length;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Loading products...</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productsToShow = filteredAndSortedProducts();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-gray-600 mt-1">Monitor and manage customer feedback for your products</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-xl border border-blue-100">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            {reviews.length} Total Reviews
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{sellerProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-indigo-100">
              <Star className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {sellerProducts.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1)
                  : "0.0"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Review Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {sellerProducts.length > 0 
                  ? `${Math.round((reviews.length / sellerProducts.length) * 100)}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {productsToShow.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm 
              ? "No products match your search criteria." 
              : "You haven't added any products yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsToShow.map((product) => {
            const productReviews = reviews.filter((r) => r.productId === product._id);
            const averageRating = getAverageRating(product._id);
            const totalReviews = getTotalReviews(product._id);

            return (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                {/* Product Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start">
                    <img
                      src={product.images?.main || product.image || "https://placehold.co/200x200"}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/200x200";
                      }}
                    />
                    <div className="ml-4 flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900">{averageRating}</span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{totalReviews} reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === "approved" ? "bg-green-100 text-green-800" :
                      product.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      product.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Stock: {product.stock || 0}</span>
                    <span>Sold: {product.sold || 0}</span>
                  </div>
                </div>
                
                {/* Reviews Section */}
                <div className="border-t border-gray-100 p-5">
                  <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                    Recent Reviews
                  </h3>
                  
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {productReviews.length > 0 ? (
                      productReviews.slice(0, 3).map((review) => (
                        <div key={review._id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{review.userName || "Anonymous"}</p>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3 h-3 ${
                                        review.rating >= star ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {review.comment || review.title || "No comment provided"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <MessageSquare className="mx-auto h-8 w-8 text-gray-300" />
                        <p className="mt-2 text-sm text-gray-500">No reviews yet</p>
                      </div>
                    )}
                  </div>
                  
                  {productReviews.length > 3 && (
                    <div className="mt-3 text-center">
                      <span className="text-xs text-blue-600 font-medium">
                        +{productReviews.length - 3} more reviews
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerProductReviews;