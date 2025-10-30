import React, { useState, useEffect } from "react";
import OrderTable from "./components/OrderTable";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";
import { Package, TrendingUp, Users, DollarSign } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Orders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    deliveredOrders: 0,
    pendingOrders: 0
  });

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageIndex + 1,
        limit: pageSize,
        status: selectedStatus === "all" ? "" : selectedStatus
      };

      if (search) {
        // For search, we'll need to implement a more complex search on the backend
        // For now, we'll fetch all and filter on frontend
        params.search = search;
      }

      const response = await axiosSecure.get('/payments/admin/all', { params });
      setOrders(response.data.data || []);
      setTotalOrders(response.data.pagination?.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axiosSecure.get('/payments/admin/stats');
      const statsData = response.data.stats;
      setStats({
        totalRevenue: statsData.totalRevenue || 0,
        deliveredOrders: statsData.successfulTransactions || 0,
        pendingOrders: statsData.pendingTransactions || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [pageIndex, pageSize, selectedStatus]);

  // status update
  const handleStatusChange = async (orderId, field, value) => {
    try {
      // Update status via API (using paymentId since we're using the payment controller)
      await axiosSecure.patch(`/payments/admin/${orderId}/status`, { status: value });

      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, [field]: value } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      // You might want to show an error message to the user here
    }
  };

  // dynamically generate unique status options
  const statusOptions = ["all", "pending", "success", "failed", "cancelled"];

  // dynamic status list for dropdown actions
  const uniqueStatusList = ["pending", "success", "failed", "cancelled"];

  // filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.order_id?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // pagination
  const pageCount = Math.ceil(totalOrders / pageSize);
  const currentPageData = filteredOrders.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Order Management</h2>
        <p className="text-muted-foreground">
          Track and manage all customer orders and deliveries.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalOrders}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1">BDT {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Delivered</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.deliveredOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.pendingOrders}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
        <OrderFilters
          search={search}
          setSearch={setSearch}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statusOptions={statusOptions}
          filteredOrders={filteredOrders}
        />

        <OrderTable
          orders={currentPageData}
          onStatusChange={handleStatusChange}
          paymentList={uniqueStatusList}
          deliveryList={uniqueStatusList}
        />

        <OrderPagination
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
};

export default Orders;
