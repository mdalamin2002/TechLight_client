import React, { useEffect, useState } from "react";
import useAxiosSecure from "@/utils/useAxiosSecure";

export const OrdersReport = ({ dateRange, onDataUpdate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  // Fetch real orders data from backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all payments (which contain order information)
        const response = await axiosSecure.get('/payments/admin/all');
        const ordersData = response.data.data || response.data;
        setOrders(ordersData);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Failed to load orders data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filterOrders = () => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case "Last 7 Days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case "Last 30 Days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      case "Last 6 Months":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "Last 1 Year":
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date("2000-01-01");
    }

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.paidAt);
      return orderDate >= startDate && orderDate <= now;
    });
  };

  const filteredOrders = filterOrders();

  // 🟩 Summary for Excel Export
  const total = filteredOrders.length || 1;
  const summary = {
    totalOrders: total,
    successPercent: (
      (filteredOrders.filter((o) => o.status === "success").length / total) *
      100
    ).toFixed(1),
    pendingPercent: (
      (filteredOrders.filter((o) => o.status === "pending").length / total) *
      100
    ).toFixed(1),
    cancelledPercent: (
      (filteredOrders.filter((o) => o.status === "cancelled" || o.status === "failed").length / total) *
      100
    ).toFixed(1),
  };

  // 🟩 Send back data to parent (for Excel export)
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({ orders: filteredOrders, summary });
    }
  }, [filteredOrders, onDataUpdate, summary]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Generate order ID from transaction ID
  const generateOrderId = (tranId) => {
    if (!tranId) return "N/A";
    return tranId.substring(0, 8);
  };

  // Get customer name from order
  const getCustomerName = (order) => {
    if (order.customer && order.customer.name) {
      return order.customer.name;
    }
    if (order.customer && order.customer.email) {
      return order.customer.email.split("@")[0];
    }
    return "Unknown Customer";
  };

  // Format amount
  const formatAmount = (amount) => {
    return amount ? `$${amount.toFixed(2)}` : "$0.00";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-red-600 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-primary/5 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Order Report
          </h1>
          <p className="text-muted-foreground">
            Analyze order performance and delivery metrics
          </p>
          {dateRange && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 w-fit mt-4">
              <span className="text-sm font-medium text-primary">
                {dateRange}
              </span>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-4">
            <h2 className="text-lg font-bold text-foreground">Order Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                  <th className="p-4 text-left font-bold">Order ID</th>
                  <th className="p-4 text-left font-bold">Customer</th>
                  <th className="p-4 text-right font-bold">Amount</th>
                  <th className="p-4 text-center font-bold">Status</th>
                  <th className="p-4 text-left font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order._id || order.tran_id || index}
                      className={`
                        border-b border-border/30 transition-colors
                        ${index % 2 === 0
                          ? "bg-white hover:bg-primary/5"
                          : "bg-muted/30 hover:bg-primary/5"
                        }
                      `}
                    >
                      <td className="p-4 text-foreground font-medium">
                        {generateOrderId(order.tran_id || order._id)}
                      </td>
                      <td className="p-4 text-foreground">
                        {getCustomerName(order)}
                      </td>
                      <td className="p-4 text-right text-foreground">
                        {formatAmount(order.total_amount)}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "success"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {formatDate(order.createdAt || order.paidAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted-foreground">
                      No orders found for {dateRange}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Success vs Cancel Ratio */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Order Status Distribution
          </h2>
          <div className="space-y-4">
            {(() => {
              const total = filteredOrders.length || 1;
              const success = filteredOrders.filter((o) => o.status === "success").length;
              const pending = filteredOrders.filter((o) => o.status === "pending").length;
              const cancelled = filteredOrders.filter((o) => o.status === "cancelled" || o.status === "failed").length;

              const successPercent = (success / total) * 100;
              const pendingPercent = (pending / total) * 100;
              const cancelledPercent = (cancelled / total) * 100;

              return (
                <>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground font-medium">Successful</span>
                      <span className="text-muted-foreground font-medium">
                        {successPercent.toFixed(0)}% ({success})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${successPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground font-medium">Pending</span>
                      <span className="text-muted-foreground font-medium">
                        {pendingPercent.toFixed(0)}% ({pending})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-4 rounded-full"
                        style={{ width: `${pendingPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground font-medium">Cancelled/Failed</span>
                      <span className="text-muted-foreground font-medium">
                        {cancelledPercent.toFixed(0)}% ({cancelled})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-red-500 h-4 rounded-full"
                        style={{ width: `${cancelledPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
