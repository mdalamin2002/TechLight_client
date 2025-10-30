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
import useAxiosSecure from "@/utils/useAxiosSecure";

const Admin_Home = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [returns, setReturns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  // Helper function to get gradient based on status
  const getGradientForStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'from-orange-400 to-orange-500';
      case 'processing':
        return 'from-sky-400 to-sky-500';
      case 'completed':
      case 'success':
        return 'from-green-400 to-green-500';
      case 'cancelled':
      case 'canceled':
      case 'failed':
        return 'from-red-400 to-red-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return "Unknown time";

    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHrs > 0) {
      return `${diffHrs}h ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get(`/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users data");
    }
  };

  // Fetch all Products (admin endpoint to get all products)
  const fetchProducts = async () => {
    try {
      const res = await axiosSecure.get(`/products/admin/all?all=true`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching Products:", err);
      setError("Failed to fetch products data");
    }
  };

  // Fetch all Payments
  const fetchPayments = async () => {
    try {
      const res = await axiosSecure.get(`/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching Payments:", err);
      setError("Failed to fetch payments data");
    }
  };

  // Fetch all Returns
  const fetchReturns = async () => {
    try {
      const res = await axiosSecure.get(`/returns`);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setReturns(data);
    } catch (err) {
      console.error("Error fetching Returns:", err);
      setReturns([]);
    }
  };

  // Fetch all Orders (using the correct admin endpoint with pagination to get all orders)
  const fetchOrders = async () => {
    try {
      // Fetch all orders by getting them in batches
      let allOrders = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await axiosSecure.get('/payments/admin/all', {
          params: {
            page: page,
            limit: 100 // Fetch 100 orders at a time
          }
        });

        const ordersData = response.data.data || response.data;
        allOrders = [...allOrders, ...ordersData];

        // Check if there are more pages
        const pagination = response.data.pagination;
        if (pagination && pagination.currentPage < pagination.totalPages) {
          page++;
        } else {
          hasMore = false;
        }
      }

      setOrders(allOrders);
    } catch (err) {
      console.error("Error fetching Orders:", err);
      setError("Failed to fetch orders data");
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchProducts(),
        fetchPayments(),
        fetchReturns(),
        fetchOrders()
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === "active").length;
  const totalSellers = users.filter(user => user.role === "seller").length;

  const totalProducts = products.length;

  const totalRevenue = payments
    .filter((p) => p.paidStatus && p.status === "success")
    .reduce((sum, p) => sum + (p.total_amount || 0), 0);

  const totalRefund = returns.filter((item) => item.type === "returns").length;
  const totalComplaints = returns.filter((item) => item.type === "complaints").length;

  const totalOrders = orders.length;

  // Calculate order status breakdown
  const orderStatusBreakdown = orders.reduce((acc, order) => {
    const status = order.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Calculate percentages for progress bars
  const totalOrderCount = orders.length || 1; // Avoid division by zero
  const statusPercentages = Object.keys(orderStatusBreakdown).map(status => {
    const count = orderStatusBreakdown[status];
    const percentage = ((count / totalOrderCount) * 100).toFixed(1);
    return {
      label: status,
      value: count,
      percent: `${percentage}%`,
      gradient: getGradientForStatus(status)
    };
  });

  // Generate recent activities
  const generateRecentActivities = () => {
    const activities = [];

    // Add recent user registrations
    const recentUsers = [...users]
      .sort((a, b) => new Date(b.created_at || b.last_loggedIn) - new Date(a.created_at || a.last_loggedIn))
      .slice(0, 2);

    recentUsers.forEach(user => {
      activities.push({
        text: `New user registered: ${user.name || user.email}`,
        time: getTimeAgo(user.created_at || user.last_loggedIn)
      });
    });

    // Add recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);

    recentOrders.forEach(order => {
      activities.push({
        text: `Order #${order._id ? order._id.toString().substring(0, 8) : 'N/A'} ${order.status}`,
        time: getTimeAgo(order.createdAt)
      });
    });

    // Add recent products
    const recentProducts = [...products]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 1);

    recentProducts.forEach(product => {
      activities.push({
        text: `Product ${product.name} added`,
        time: getTimeAgo(product.created_at)
      });
    });

    // Sort activities by time (most recent first)
    return activities.sort((a, b) => {
      // Simple comparison based on time text (you might want to improve this)
      return a.time.localeCompare(b.time);
    }).slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-2 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-2 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-foreground">Error loading data</h3>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const recentActivities = generateRecentActivities();

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
          value={activeUsers.toLocaleString()}
          change="+8%"
          changeText="vs last month"
          icon={UserCheck}
          gradient="from-green-500 to-green-600"
          isPositive={true}
        />
        <StatCard
          title="Total Sellers"
          value={totalSellers.toLocaleString()}
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
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
          value={totalOrders.toLocaleString()}
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
            {statusPercentages.length > 0 ? (
              statusPercentages.map((status, index) => (
                <ProgressBar
                  key={index}
                  label={status.label}
                  value={status.value.toLocaleString()}
                  percent={status.percent}
                  gradient={status.gradient}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No order data available
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 backdrop-blur-sm">
          <h3 className="font-bold text-xl mb-6 text-foreground">
            Recent Activity
          </h3>
          {recentActivities.length > 0 ? (
            <ul className="space-y-1">
              {recentActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  text={activity.text}
                  time={activity.time}
                />
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No recent activities
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Admin_Home;
