import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { CreditCard, PackageCheck, Truck, XCircle, Loader2, Filter, Calendar } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const getStatusIcon = (status) => {
  switch (status) {
    case "Delivered":
    case "Completed":
      return <PackageCheck className="w-4 h-4 text-green-600" />;
    case "Processing":
    case "Pending":
      return <Truck className="w-4 h-4 text-yellow-600" />;
    case "Cancelled":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const [ordersRes, statsRes] = await Promise.all([
        axiosSecure.get(`/user/orders?${queryParams}`),
        axiosSecure.get("/user/orders/stats/summary")
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data.orders);
        setPagination(ordersRes.data.data.pagination);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders || 0}</p>
            </div>
            <PackageCheck className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount || 0)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{stats.completedOrders || 0}</p>
            </div>
            <PackageCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pendingOrders || 0}</p>
            </div>
            <Truck className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
              placeholder="Start Date"
            />
            <span>to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
              placeholder="End Date"
            />
          </div>

          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              handleFilterChange("sortBy", sortBy);
              handleFilterChange("sortOrder", sortOrder);
            }}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="totalAmount-desc">Highest Amount</option>
            <option value="totalAmount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card p-6 rounded-xl shadow-sm">
        {error ? (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        #{order.orderId || order._id.slice(-8)}
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalAmount || 0)}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {order.paymentMethod || "N/A"}
                      </TableCell>
                      <TableCell>
                        {order.items?.length || 0} item(s)
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{" "}
                  {pagination.totalCount} orders
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded">
                    {pagination.currentPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
