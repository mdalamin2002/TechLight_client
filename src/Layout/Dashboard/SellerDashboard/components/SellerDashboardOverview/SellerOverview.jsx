import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, DollarSign, Star } from "lucide-react";
import SalesAnalytics from "../SalesAnalytics/SalesAnalytics";

const SellerOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    earnings: 0,
    rating: 0,
  });

  // Dummy Fetch simulation (later replace with your API)
  useEffect(() => {
    // Example: fetch from backend: `/api/seller/overview`
    const fetchData = async () => {
      try {
        // const res = await fetch("/api/seller/overview");
        // const data = await res.json();

        // Dummy data simulation
        const data = {
          products: 42,
          orders: 128,
          earnings: 3240,
          rating: 4.8,
        };

        setStats(data);
      } catch (err) {
        console.error("Failed to fetch seller overview:", err);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Seller Dashboard Overview
        </h1>
        <p className="text-gray-500">
          Here’s a quick summary of your store’s performance.
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
