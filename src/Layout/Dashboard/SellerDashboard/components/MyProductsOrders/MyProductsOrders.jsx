import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  PackageCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  DollarSign,
  Truck,
  ShoppingCart,
} from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const MyProductsOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const axiosSecure = useAxiosSecure();

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
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.currentPage, statusFilter]);

  // Filter logic (for search term)
  const filteredOrders = orders.filter((order) => {
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
    canceled: orders.filter((o) => o.status && ["canceled", "cancelled", "failed"].includes(o.status.toLowerCase())).length,
  };

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "canceled":
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const statusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
      case "success":
        return <CheckCircle2 className="w-4 h-4" />;
      case "canceled":
      case "cancelled":
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <PackageCheck className="w-4 h-4" />;
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer', 'Products', 'Quantity', 'Total', 'Status', 'Date'];
    const rows = orders.map(order => {
      const products = order.products?.map(p => p.name).join('; ') || '';
      const quantity = order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;
      return [
        order.order_id || order.tran_id || order._id,
        order.customer?.name || 'Unknown',
        products,
        quantity,
        formatCurrency(order.total_amount),
        order.status,
        formatDate(order.createdAt)
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'seller-orders.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Product Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all your product orders</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Orders</p>
              <h2 className="text-2xl font-bold text-blue-900 mt-1">{summary.total}</h2>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 font-medium">Pending</p>
              <h2 className="text-2xl font-bold text-amber-900 mt-1">{summary.pending}</h2>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl p-5 border border-sky-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-700 font-medium">Shipped</p>
              <h2 className="text-2xl font-bold text-sky-900 mt-1">{summary.shipped}</h2>
            </div>
            <div className="p-3 bg-sky-500/10 rounded-lg">
              <Truck className="w-6 h-6 text-sky-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Delivered</p>
              <h2 className="text-2xl font-bold text-green-900 mt-1">{summary.delivered}</h2>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Canceled</p>
              <h2 className="text-2xl font-bold text-red-900 mt-1">{summary.canceled}</h2>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by product name..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setIsFilterOpen(false);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className="w-full px-4 py-2 text-gray-700 bg-transparent border-0 focus:ring-0"
                >
                  <option value="All">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="success">Success</option>
                  <option value="canceled">Canceled</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const product = order.products && order.products.length > 0 
                      ? order.products[0] 
                      : { name: "Unknown Product", price: 0 };
                    
                    const totalQuantity = order.products 
                      ? order.products.reduce((sum, p) => sum + (p.quantity || 0), 0)
                      : 0;
                    
                    return (
                      <tr key={order._id || order.tran_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.order_id?.substring(0, 8) || order.tran_id?.substring(0, 8) || order._id?.substring(0, 8)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="ml-0">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              {order.products && order.products.length > 1 && (
                                <div className="text-sm text-gray-500">+{order.products.length - 1} more</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-0">
                              <div className="text-sm font-medium text-gray-900">{order.customer?.name || "Unknown"}</div>
                              <div className="text-sm text-gray-500">{order.customer?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {totalQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(order.status)}`}>
                            {statusIcon(order.status)}
                            <span className="ml-1">{order.status || "Unknown"}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <PackageCheck className="h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm || statusFilter !== "All" 
                            ? "No orders match your search criteria." 
                            : "You don't have any orders yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.currentPage === 1 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.currentPage === pagination.totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}
                    </span> of{' '}
                    <span className="font-medium">{pagination.totalCount}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        pagination.currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.currentPage
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        pagination.currentPage === pagination.totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-medium text-gray-900 mb-4">Order Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">#{selectedOrder.order_id || selectedOrder.tran_id?.substring(0, 8) || selectedOrder._id?.substring(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(selectedOrder.status)}`}>
                        {statusIcon(selectedOrder.status)}
                        <span className="ml-1">{selectedOrder.status || "Unknown"}</span>
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium text-lg">{formatCurrency(selectedOrder.total_amount)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-medium text-gray-900 mb-4">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedOrder.customer?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.customer?.email || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedOrder.customer?.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">
                        {selectedOrder.customer?.address 
                          ? `${selectedOrder.customer.address}, ${selectedOrder.customer.city || ''}` 
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Products */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-medium text-gray-900 mb-4">Products</h4>
                  <div className="space-y-4">
                    {selectedOrder.products?.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="flex-shrink-0 h-12 w-12 rounded-md object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.innerHTML = `
                                  <div class="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                                    <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <PackageCheck className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(product.price)} × {product.quantity}</p>
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatCurrency((product.price || 0) * (product.quantity || 0))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsOrders;