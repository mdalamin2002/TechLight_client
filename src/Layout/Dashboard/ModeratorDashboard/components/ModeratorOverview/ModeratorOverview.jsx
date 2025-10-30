import React, { useState, useEffect } from "react";
import StatCard from "./components/StatCard";
import ActivityItem from "./components/ActivityItem";
import ProgressBar from "./components/ProgressBar";
import { ShoppingCart, Package, CheckCircle, User, AlertTriangle, MessageCircle } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

export const ModeratorOverview = () => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Initial static data as fallback
  const staticStats = [
    { title: "Pending Orders", count: 0, icon: <ShoppingCart />, bgColor: "bg-indigo-500" },
    { title: "Shipped Orders", count: 0, icon: <Package />, bgColor: "bg-green-500" },
    { title: "Delivered Orders", count: 0, icon: <CheckCircle />, bgColor: "bg-blue-500" },
    { title: "Pending Product Approvals", count: 0, icon: <Package />, bgColor: "bg-yellow-500" },
    { title: "User Reports", count: 0, icon: <AlertTriangle />, bgColor: "bg-red-500" },
    { title: "Reviews Flagged", count: 0, icon: <AlertTriangle />, bgColor: "bg-pink-500" },
    { title: "Open Support Tickets", count: 0, icon: <MessageCircle />, bgColor: "bg-purple-500" },
  ];

  const staticActivities = [
    { title: "No recent activity", description: "No recent activity", time: "Just now" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics
        const statsResponse = await axiosSecure.get("/moderator/orders-products/dashboard/stats");
        const statsData = statsResponse.data;
        
        // Format stats data
        const formattedStats = [
          { title: "Pending Orders", count: statsData?.pendingOrders || 0, icon: <ShoppingCart />, bgColor: "bg-indigo-500" },
          { title: "Shipped Orders", count: statsData?.shippedOrders || 0, icon: <Package />, bgColor: "bg-green-500" },
          { title: "Delivered Orders", count: statsData?.deliveredOrders || 0, icon: <CheckCircle />, bgColor: "bg-blue-500" },
          { title: "Pending Product Approvals", count: statsData?.pendingProductApprovals || 0, icon: <Package />, bgColor: "bg-yellow-500" },
          { title: "User Reports", count: statsData?.userReports || 0, icon: <AlertTriangle />, bgColor: "bg-red-500" },
          { title: "Reviews Flagged", count: statsData?.flaggedReviews || 0, icon: <AlertTriangle />, bgColor: "bg-pink-500" },
          { title: "Open Support Tickets", count: statsData?.openSupportTickets || 0, icon: <MessageCircle />, bgColor: "bg-purple-500" },
        ];
        setStats(formattedStats);
        
        // Fetch recent activities
        const activitiesResponse = await axiosSecure.get("/moderator/orders-products/dashboard/activities");
        setActivities(activitiesResponse.data || staticActivities);
        
        // Fetch progress data
        const progressResponse = await axiosSecure.get("/moderator/orders-products/dashboard/progress");
        setProgress(progressResponse.data || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Use static data as fallback
        setStats(staticStats);
        setActivities(staticActivities);
        setProgress(65); // Default progress
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Moderator Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <h2 className="text-lg font-semibold">Order Processing Progress</h2>
          <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Moderator Dashboard</h1>

      {/* Stat Cards */ }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            count={stat.count}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Recent Activity */ }
      <div className="bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="text-lg font-semibold">Recent Activities</h2>
        {activities.map((act, idx) => (
          <ActivityItem
            key={idx}
            title={act.title}
            description={act.description}
            time={act.time}
          />
        ))}
      </div>

      {/* Example Progress */ }
      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="text-lg font-semibold">Order Processing Progress</h2>
        <p className="text-sm text-gray-500">Completion: {progress}%</p>
        <ProgressBar percentage={progress} />
      </div>
    </div>
  );
};