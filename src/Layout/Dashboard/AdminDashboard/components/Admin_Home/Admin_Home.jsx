import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Store,
  Box,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import StatCard from "./components/StatCard";
import ProgressBar from "./components/ProgressBar";
import ActivityItem from "./components/ActivityItem";
import axios from "axios";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Admin_Home = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [returns, setReturns] = useState([]);
  const axiosSecure = useAxiosSecure();
  // console.log("=====>", products);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get(`/users`);
      setUsers(res.data); //since API returns an array directly
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  // Fetch all Products
  const fetchProducts = async () => {
    try {
      const res = await axiosSecure.get(`/products?all=true`);
      setProducts(res.data.data); //since API returns an array directly
    } catch (err) {
      console.error("Error fetching Products:", err);
    }
  };

  // Fetch all Payments
  const fetchPayments = async () => {
    try {
      const res = await axiosSecure.get(`/payments`);
      setPayments(res.data); //since API returns an array directly
    } catch (err) {
      console.error("Error fetching Payments:", err);
    }
  };
  // Fetch all Returns
  const fetchReturns = async () => {
    try {
      const res = await axiosSecure.get(`/returns`);
      const data = Array.isArray(res.data) ? res.data : res.data.data || []; // handle both structures
      setReturns(data);
    } catch (err) {
      console.error("Error fetching Returns:", err);
      setReturns([]); // fallback
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchPayments();
    fetchReturns();
  }, []);
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalRevenue = payments
    .filter((p) => p.paidStatus && p.status === "success") // only successful/paid ones
    .reduce((sum, p) => sum + (p.total_amount || 0), 0);
  const totalRefund = returns.filter((item) => item.type === "returns").length;
  const totalComplaints = returns.filter(
    (item) => item.type === "complaints"
  ).length;

  return (
    <div className="min-h-screen p-2 lg:p-6">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Dashboard Overview
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back! Here's what's happening with your platform.
        </p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          change="+12%"
          changeText="vs last month"
          icon={Users}
          gradient="from-blue-500 to-blue-600"
          isPositive={true}
        />
        <StatCard
          title="Active Users"
          value="980"
          change="+8%"
          changeText="vs last month"
          icon={UserCheck}
          gradient="from-green-500 to-green-600"
          isPositive={true}
        />
        <StatCard
          title="Total Sellers"
          value="150"
          change="+5%"
          changeText="vs last month"
          icon={Store}
          gradient="from-purple-500 to-purple-600"
          isPositive={true}
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          change="+15%"
          changeText="vs last month"
          icon={Box}
          gradient="from-orange-500 to-orange-600"
          isPositive={true}
        />
        <StatCard
          title="Total Revenue"
          value={totalRevenue.toLocaleString()}
          change="+22%"
          changeText="vs last month"
          icon={DollarSign}
          gradient="from-yellow-500 to-yellow-600"
          isPositive={true}
        />
        <StatCard
          title="Refund Requests"
          value={totalRefund.toLocaleString()}
          change="-3%"
          changeText="vs last month"
          icon={AlertTriangle}
          gradient="from-red-500 to-red-600"
          isPositive={false}
        />
        <StatCard
          title="Complaints"
          value={totalComplaints.toLocaleString()}
          change="+1%"
          changeText="vs last month"
          icon={MessageSquare}
          gradient="from-pink-500 to-pink-600"
          isPositive={false}
        />
        <StatCard
          title="Total Orders"
          value="695"
          change="+18%"
          changeText="vs last month"
          icon={ShoppingCart}
          gradient="from-cyan-500 to-cyan-600"
          isPositive={true}
        />
      </section>

      {/* Bottom section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 backdrop-blur-sm">
          <h3 className="font-bold text-xl mb-6 text-foreground">
            Order Status Breakdown
          </h3>
          <div className="space-y-5">
            <ProgressBar
              label="Pending"
              value="80"
              percent="11.5%"
              gradient="from-orange-400 to-orange-500"
            />
            <ProgressBar
              label="Processing"
              value="65"
              percent="9.4%"
              gradient="from-sky-400 to-sky-500"
            />
            <ProgressBar
              label="Completed"
              value="540"
              percent="77.7%"
              gradient="from-green-400 to-green-500"
            />
            <ProgressBar
              label="Canceled"
              value="10"
              percent="1.4%"
              gradient="from-red-400 to-red-500"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 backdrop-blur-sm">
          <h3 className="font-bold text-xl mb-6 text-foreground">
            Recent Activity
          </h3>
          <ul className="space-y-1">
            <ActivityItem text="New user registered" time="2 minutes ago" />
            <ActivityItem text="Order #1234 completed" time="5 minutes ago" />
            <ActivityItem
              text="Product iPhone 15 added"
              time="10 minutes ago"
            />
            <ActivityItem
              text="Seller application approved"
              time="15 minutes ago"
            />
            <ActivityItem
              text="Payment received $5,000"
              time="20 minutes ago"
            />
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Admin_Home;
