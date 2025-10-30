import React, { useState, useEffect, useMemo } from "react";
import { 
  Star, 
  TrendingUp, 
  MessageSquare, 
  Package, 
  Calendar, 
  Filter, 
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Clock,
  User,
  ThumbsUp,
  Eye,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const SellerProductReviews = () => {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [dateRange, setDateRange] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
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

  // Filter reviews by date range
  const filterReviewsByDate = (reviews, range) => {
    if (range === "all") return reviews;
    
    const now = new Date();
    const filtered = reviews.filter(review => {
      const reviewDate = new Date(review.createdAt);
      switch (range) {
        case "week":
          return (now - reviewDate) / (1000 * 60 * 60 * 24) <= 7;
        case "month":
          return (now - reviewDate) / (1000 * 60 * 60 * 24) <= 30;
        case "quarter":
          return (now - reviewDate) / (1000 * 60 * 60 * 24) <= 90;
        default:
          return true;
      }
    });
    
    return filtered;
  };

  // Get filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...sellerProducts];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(product => product.status === statusFilter);
    }
    
    // Sort products
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "rating") {
        const aReviews = filterReviewsByDate(reviews.filter(r => r.productId === a._id), dateRange);
        const bReviews = filterReviewsByDate(reviews.filter(r => r.productId === b._id), dateRange);
        
        const aAvg = aReviews.length > 0 
          ? aReviews.reduce((sum, r) => sum + r.rating, 0) / aReviews.length 
          : 0;
        const bAvg = bReviews.length > 0 
          ? bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length 
          : 0;
          
        return bAvg - aAvg; // Descending order for ratings
      } else if (sortBy === "reviews") {
        const aCount = filterReviewsByDate(reviews.filter(r => r.productId === a._id), dateRange).length;
        const bCount = filterReviewsByDate(reviews.filter(r => r.productId === b._id), dateRange).length;
        return bCount - aCount; // Descending order for review count
      } else if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0; // Default order
    });
    
    return result;
  }, [sellerProducts, searchTerm, statusFilter, sortBy, reviews, dateRange]);

  // Get average rating for a product
  const getAverageRating = (productId) => {
    const productReviews = filterReviewsByDate(reviews.filter(r => r.productId === productId), dateRange);
    if (productReviews.length === 0) return 0;
    
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / productReviews.length).toFixed(1);
  };

  // Get total reviews for a product
  const getTotalReviews = (productId) => {
    return filterReviewsByDate(reviews.filter(r => r.productId === productId), dateRange).length;
  };

  // Get rating distribution for a product
  const getRatingDistribution = (productId) => {
    const productReviews = filterReviewsByDate(reviews.filter(r => r.productId === productId), dateRange);
    const distribution = [0, 0, 0, 0, 0]; // 5 stars to 1 star
    
    productReviews.forEach(review => {
      const starIndex = Math.max(0, Math.min(4, 4 - (review.rating - 1)));
      distribution[starIndex]++;
    });
    
    return distribution;
  };

  // Render star rating distribution
  const renderRatingDistribution = (productId) => {
    const distribution = getRatingDistribution(productId);
    const totalReviews = getTotalReviews(productId);
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars, index) => {
          const count = distribution[index];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={stars} className="flex items-center">
              <span className="text-sm text-gray-600 w-4">{stars}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current ml-1" />
              <div className="flex-1 ml-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8 text-right ml-2">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Get overall stats
  const overallStats = useMemo(() => {
    const filteredReviews = filterReviewsByDate(reviews, dateRange);
    
    return {
      totalProducts: sellerProducts.length,
      totalReviews: filteredReviews.length,
      averageRating: sellerProducts.length > 0 
        ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / (filteredReviews.length || 1)).toFixed(1)
        : "0.0",
      reviewRate: sellerProducts.length > 0 
        ? `${Math.round((filteredReviews.length / sellerProducts.length) * 100)}%`
        : "0%"
    };
  }, [sellerProducts, reviews, dateRange]);

  // Render star rating component
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating) 
                ? "text-yellow-400 fill-current" 
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-900">{rating}</span>
      </div>
    );
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-12 bg-gray-200 rounded-xl flex-1 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-20 bg-gray-200"></div>
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-gray-600 mt-1">Monitor and manage customer feedback for your products</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3 rounded-xl shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">
              {overallStats.totalReviews} Reviews
            </span>
          </div>
          
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-indigo-100">
              <Star className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 flex items-center">
                {overallStats.averageRating}
                <Award className="w-5 h-5 text-yellow-500 ml-2" />
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Review Rate</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.reviewRate}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-rose-100">
              <BarChart3 className="w-6 h-6 text-rose-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Range</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{dateRange}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition shadow-sm w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition shadow-sm w-full"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
              </select>
            </div>
            
            <select
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="name">Name</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSortBy("newest");
                setDateRange("all");
              }}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm 
              ? "No products match your search criteria." 
              : "You haven't added any products yet."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSortBy("newest");
                setDateRange("all");
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedProducts.map((product) => {
            const productReviews = filterReviewsByDate(reviews.filter((r) => r.productId === product._id), dateRange);
            const averageRating = getAverageRating(product._id);
            const totalReviews = getTotalReviews(product._id);
            const isExpanded = expandedProduct === product._id;

            return (
              <div 
                key={product._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Product Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        src={product.images?.main || product.image || "https://placehold.co/200x200"}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/200x200";
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{product.category} • {product.brand || "No Brand"}</p>
                      <div className="flex items-center mt-2">
                        {renderStarRating(averageRating)}
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{totalReviews} reviews</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        {getStatusIcon(product.status)}
                        <span className={`ml-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">ID: {product._id.slice(-6)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      {product.regularPrice && product.regularPrice > product.price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">${product.regularPrice}</span>
                      )}
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500">Stock: {product.stock || 0}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">Sold: {product.sold || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedProduct(isExpanded ? null : product._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition"
                    >
                      {isExpanded ? "Show Less" : "View Details"}
                      {isExpanded ? (
                        <ChevronUp className="ml-1 w-4 h-4" />
                      ) : (
                        <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-700 mb-4">{product.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <Star className="w-4 h-4 mr-2 text-yellow-500" />
                            Rating Distribution
                          </h4>
                          {renderRatingDistribution(product._id)}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <Package className="w-4 h-4 mr-2 text-indigo-500" />
                            Product Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Brand</span>
                              <span className="font-medium">{product.brand || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category</span>
                              <span className="font-medium">{product.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subcategory</span>
                              <span className="font-medium">{product.subCategory || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Created</span>
                              <span className="font-medium">
                                {new Date(product.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Reviews Section */}
                <div className="border-t border-gray-100 p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-gray-900 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-indigo-500" />
                      Customer Reviews
                    </h3>
                    {productReviews.length > 0 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Showing {Math.min(2, productReviews.length)} of {productReviews.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {productReviews.length > 0 ? (
                      productReviews.slice(0, isExpanded ? productReviews.length : 2).map((review) => (
                        <div key={review._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {review.userPhotoURL ? (
                                  <img 
                                    src={review.userPhotoURL} 
                                    alt={review.userName} 
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{review.userName || "Anonymous"}</p>
                                <div className="flex items-center mt-1">
                                  {renderStarRating(review.rating)}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-700">
                            {review.comment || review.title || "No comment provided"}
                          </p>
                          {review.helpful > 0 && (
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {review.helpful} people found this helpful
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                          <MessageSquare className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                        <p className="mt-1 text-sm text-gray-500">This product doesn't have any reviews in the selected time period.</p>
                      </div>
                    )}
                  </div>
                  
                  {productReviews.length > 2 && !isExpanded && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setExpandedProduct(product._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View all {productReviews.length} reviews
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Reviews</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredAndSortedProducts.map((product) => {
              const productReviews = filterReviewsByDate(reviews.filter((r) => r.productId === product._id), dateRange);
              const averageRating = getAverageRating(product._id);
              const totalReviews = getTotalReviews(product._id);
              
              return (
                <div key={product._id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition">
                  <div className="col-span-4 flex items-center">
                    <img
                      src={product.images?.main || product.image || "https://placehold.co/200x200"}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/200x200";
                      }}
                    />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center">
                      {getStatusIcon(product.status)}
                      <span className={`ml-2 capitalize text-sm ${product.status === "approved" ? "text-green-600" : product.status === "pending" ? "text-yellow-600" : product.status === "rejected" ? "text-red-600" : "text-gray-600"}`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className="font-medium">${product.price}</span>
                    {product.regularPrice && product.regularPrice > product.price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">${product.regularPrice}</span>
                    )}
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <div>
                      {renderStarRating(averageRating)}
                      <p className="text-sm text-gray-500 mt-1">{totalReviews} reviews</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <button
                      onClick={() => setExpandedProduct(expandedProduct === product._id ? null : product._id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {expandedProduct === product._id ? "Hide" : "View"}
                    </button>
                  </div>
                  
                  {expandedProduct === product._id && (
                    <div className="col-span-12 mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Product Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Brand</span>
                              <span className="font-medium">{product.brand || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stock</span>
                              <span className="font-medium">{product.stock || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sold</span>
                              <span className="font-medium">{product.sold || 0}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Rating Distribution</h4>
                          {renderRatingDistribution(product._id)}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Reviews</h4>
                          <div className="space-y-3">
                            {productReviews.length > 0 ? (
                              productReviews.slice(0, 3).map((review) => (
                                <div key={review._id} className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex justify-between">
                                    <div className="flex items-center">
                                      {review.userPhotoURL ? (
                                        <img 
                                          src={review.userPhotoURL} 
                                          alt={review.userName} 
                                          className="w-6 h-6 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="bg-gray-200 border-2 border-dashed rounded-full w-6 h-6 flex items-center justify-center">
                                          <User className="w-3 h-3 text-gray-500" />
                                        </div>
                                      )}
                                      <span className="ml-2 text-sm font-medium text-gray-900">{review.userName || "Anonymous"}</span>
                                    </div>
                                    {renderStarRating(review.rating)}
                                  </div>
                                  <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                                    {review.comment || review.title || "No comment provided"}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No reviews yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductReviews;