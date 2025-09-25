import React from "react";
import { 
  Users, UserCheck, Store, Box, 
  DollarSign, AlertTriangle, 
  MessageSquare, ShoppingCart 
} from "lucide-react";
import StatCard from "./components/StatCard";
import ProgressBar from "./components/ProgressBar";
import ActivityItem from "./components/ActivityItem";


const Admin_Home = () => {
  return (
    <div className="min-h-screen text-gray-900 p-1">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">
          Welcome back! Here's what's happening with your platform.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value="1,250" change="+12% vs last month" icon={Users} color="bg-sky-600" />
        <StatCard title="Active Users" value="980" change="+8% vs last month" icon={UserCheck} color="bg-green-600" />
        <StatCard title="Total Sellers" value="150" change="+5% vs last month" icon={Store} color="bg-violet-600" />
        <StatCard title="Total Products" value="3,200" change="+15% vs last month" icon={Box} color="bg-orange-600" />
        <StatCard title="Total Revenue" value="$250,000" change="+22% vs last month" icon={DollarSign} color="bg-yellow-600" />
        <StatCard title="Refund Requests" value="15" change="-3% vs last month" icon={AlertTriangle} color="bg-red-600" />
        <StatCard title="Complaints" value="22" change="+1% vs last month" icon={MessageSquare} color="bg-pink-600" />
        <StatCard title="Total Orders" value="695" change="+18% vs last month" icon={ShoppingCart} color="bg-cyan-600" />
      </section>

      {/* Bottom section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-6 text-gray-800">Order Status Breakdown</h3>
          <div className="space-y-5">
            <ProgressBar label="Pending" value="80" percent="11.5%" color="bg-orange-400" />
            <ProgressBar label="Processing" value="65" percent="9.4%" color="bg-sky-400" />
            <ProgressBar label="Completed" value="540" percent="77.7%" color="bg-green-400" />
            <ProgressBar label="Canceled" value="10" percent="1.4%" color="bg-red-400" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-6 text-gray-800">Recent Activity</h3>
          <ul className="text-sm">
            <ActivityItem text="New user registered" time="2 minutes ago" />
            <ActivityItem text="Order #1234 completed" time="5 minutes ago" />
            <ActivityItem text="Product iPhone 15 added" time="10 minutes ago" />
            <ActivityItem text="Seller application approved" time="15 minutes ago" />
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Admin_Home;
