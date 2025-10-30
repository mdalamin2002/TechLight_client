import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, DollarSign, Star } from "lucide-react";
import SalesAnalytics from "../SalesAnalytics/SalesAnalytics";
import useAxiosSecure from "@/utils/useAxiosSecure";

const SellerOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    earnings: 0,
    rating: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const axiosSecure = useAxiosSecure();

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/payments/seller/overview");
        
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          setError("Failed to fetch seller overview data");
        }
      } catch (err) {
        console.error("Failed to fetch seller overview:", err);
        setError("Failed to fetch seller overview data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const cards = [
    {
      id: 1,
      title: "Total Products",
      value: stats.products,
      icon: <Package className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      id: 2,
      title: "Total Orders",
      value: stats.orders,
      icon: <ShoppingCart className="w-8 h-8 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      id: 3,
      title: "Total Earnings",
      value: `$${stats.earnings.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8 text-yellow-600" />,
      bg: "bg-yellow-50",
    },
    {
      id: 4,
      title: "Average Rating",
      value: stats.rating.toFixed(1),
      icon: <Star className="w-8 h-8 text-orange-600" />,
      bg: "bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Seller Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Loading your store's performance data...
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-gray-100 rounded-2xl shadow-sm p-5 flex items-center justify-between animate-pulse"
            >
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="p-3 bg-gray-200 rounded-full">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Seller Dashboard Overview
          </h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Seller Dashboard Overview
        </h1>
        <p className="text-gray-500">
          Here's a quick summary of your store's performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item) => (
          <div
            key={item.id}
            className={`${item.bg} rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between`}
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {item.value}
              </h2>
            </div>
            <div className="p-3 bg-white rounded-full shadow-inner">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics + Orders Section */}
      <SalesAnalytics sellerId="12345" />
    </div>
  );
};

export default SellerOverview;