import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  PackageCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure"; // Import the axios hook

const MyProductsOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]); // State for orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10
  }); // Pagination state

  const axiosSecure = useAxiosSecure(); // Use the axios hook

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/orders/seller-orders`, {
          params: {
            page: pagination.currentPage,
            limit: pagination.limit,
            status: statusFilter === "All" ? undefined : statusFilter
          }
        });
        
        // Fix the response handling - the data is directly in response.data
        const { orders: fetchedOrders, pagination: paginationData } = response.data.data;
        setOrders(fetchedOrders || []);
        setPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalCount: paginationData.totalCount,
          limit: paginationData.limit
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.currentPage, statusFilter]);

  // Filter logic (for search term)
  const filteredOrders = orders.filter((order) => {
    // Since we're getting real data, we need to adjust the search logic
    // Check if any product name matches the search term
    if (!order.products || !Array.isArray(order.products)) return false;
    
    return order.products.some(product => 
      product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Summary count
  const summary = {
    total: pagination.totalCount,
    pending: orders.filter((o) => o.status && o.status.toLowerCase() === "pending").length,
    shipped: orders.filter((o) => o.status && o.status.toLowerCase() === "shipped").length,
    delivered: orders.filter((o) => o.status && o.status.toLowerCase() === "delivered").length,
    canceled: orders.filter((o) => o.status && o.status.toLowerCase() === "canceled").length,
  };

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          My Product Orders
        </h1>
        <p className="text-gray-500">
          Track all your product orders with real-time status updates.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-blue-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-bold text-gray-800">{summary.total}</h2>
          </div>
          <PackageCheck className="w-8 h-8 text-blue-600" />
        </div>

        <div className="bg-yellow-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.pending}
            </h2>
          </div>
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>

        <div className="bg-sky-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Shipped</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.shipped}
            </h2>
          </div>
          <PackageCheck className="w-8 h-8 text-sky-600" />
        </div>

        <div className="bg-green-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Delivered</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.delivered}
            </h2>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>

        <div className="bg-red-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Canceled</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.canceled}
            </h2>
          </div>
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search order by product..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when filter changes
          }}
          className="border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Orders</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Buyer</th>
                <th className="px-6 py-3 font-medium">Quantity</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  // Get product info from the first product in the order
                  const product = order.products && order.products.length > 0 
                    ? order.products[0] 
                    : { name: "Unknown Product", price: 0 };
                  
                  // Calculate total quantity
                  const totalQuantity = order.products 
                    ? order.products.reduce((sum, p) => sum + (p.quantity || 0), 0)
                    : 0;
                  
                  // Format date
                  const orderDate = order.createdAt 
                    ? new Date(order.createdAt).toLocaleDateString() 
                    : "Unknown Date";
                  
                  return (
                    <tr
                      key={order._id || order.tran_id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        #{order.order_id || order.tran_id?.substring(0, 8) || order._id?.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Using a placeholder image since we don't have product images in the data */}
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <p>{product.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{order.customer?.name || "Unknown Buyer"}</td>
                      <td className="px-6 py-4">{totalQuantity}</td>
                      <td className="px-6 py-4 font-semibold">
                        ${order.total_amount ? order.total_amount.toFixed(2) : "0.00"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                            order.status
                          )}`}
                        >
                          {order.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{orderDate}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    pagination.currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    pagination.currentPage === pagination.totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            <div className="text-center space-y-3">
              {/* Placeholder for product image */}
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto" />
              
              <h2 className="text-xl font-semibold text-gray-800">
                Order Details
              </h2>
              
              <div className="mt-4 text-left space-y-2">
                <p>
                  <strong>Order ID:</strong> #{selectedOrder.order_id || selectedOrder.tran_id?.substring(0, 8) || selectedOrder._id?.substring(0, 8)}
                </p>
                <p>
                  <strong>Buyer:</strong> {selectedOrder.customer?.name || "Unknown Buyer"}
                </p>
                <p>
                  <strong>Buyer Email:</strong> {selectedOrder.customer?.email || "Unknown Email"}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${selectedOrder.total_amount ? selectedOrder.total_amount.toFixed(2) : "0.00"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status || "Unknown"}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "Unknown Date"}
                </p>
                
                {/* Products list */}
                <div className="mt-4">
                  <strong>Products:</strong>
                  <ul className="mt-2 space-y-2">
                    {selectedOrder.products && selectedOrder.products.map((product, index) => (
                      <li key={index} className="flex justify-between border-b pb-2">
                        <span>{product.name}</span>
                        <span>{product.quantity} x ${product.price ? product.price.toFixed(2) : "0.00"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsOrders;