
import React from "react";
import StatCard from "./components/StatCard";
import ActivityItem from "./components/ActivityItem";
import ProgressBar from "./components/ProgressBar";
import { ShoppingCart, Package, CheckCircle, User, AlertTriangle, MessageCircle } from "lucide-react";

export const ModeratorOverview = () => {
  const stats = [
    { title: "Pending Orders", count: 12, icon: <ShoppingCart />, bgColor: "bg-indigo-500" },
    { title: "Shipped Orders", count: 34, icon: <Package />, bgColor: "bg-green-500" },
    { title: "Delivered Orders", count: 78, icon: <CheckCircle />, bgColor: "bg-blue-500" },
    { title: "Pending Product Approvals", count: 5, icon: <Package />, bgColor: "bg-yellow-500" },
    { title: "User Reports", count: 7, icon: <AlertTriangle />, bgColor: "bg-red-500" },
    { title: "Reviews Flagged", count: 3, icon: <AlertTriangle />, bgColor: "bg-pink-500" },
    { title: "Open Support Tickets", count: 4, icon: <MessageCircle />, bgColor: "bg-purple-500" },
  ];

  const activities = [
    { title: "Order ORD-1023", description: "Pending approval", time: "2h ago" },
    { title: "New product listing", description: "Requires review", time: "5h ago" },
    { title: "User report", description: "Fraudulent activity reported", time: "1d ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Moderator Dashboard</h1>

      {/* Stat Cards */}
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

      {/* Recent Activity */}
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

      {/* Example Progress */}
      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="text-lg font-semibold">Order Processing Progress</h2>
        <p className="text-sm text-gray-500">Completion: 65%</p>
        <ProgressBar percentage={65} />
      </div>
    </div>
  );
};


