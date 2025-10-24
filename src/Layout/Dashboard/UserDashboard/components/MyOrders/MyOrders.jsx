import React, { useState, useEffect } from 'react';
import {
  Package,
  ChevronRight,
  Download,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAxiosSecure from '@/utils/useAxiosSecure';
import useAuth from '@/hooks/useAuth';
import jsPDF from 'jspdf';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Load data from API
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/payments/user/orders?status=${filterStatus}`);

      if (response.data?.success) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (order) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header
      doc.setFillColor(22, 163, 74);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('INVOICE', pageWidth / 2, 25, { align: 'center' });

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Order Info
      doc.setFontSize(12);
      doc.text(`Order ID: ${order.order_id}`, 20, 60);
      doc.text(`Transaction ID: ${order.tran_id}`, 20, 70);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 80);
      doc.text(`Status: ${order.status.toUpperCase()}`, 20, 90);

      // Customer Info
      doc.setFontSize(14);
      doc.text('Customer Information', 20, 110);
      doc.setFontSize(10);
      doc.text(`Name: ${order.customer.name}`, 20, 120);
      doc.text(`Email: ${order.customer.email}`, 20, 130);
      doc.text(`Phone: ${order.customer.phone}`, 20, 140);
      doc.text(`Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.country}`, 20, 150);

      // Products
      doc.setFontSize(14);
      doc.text('Products', 20, 170);
      doc.setFontSize(10);

      let yPos = 180;
      order.products.forEach((product, index) => {
        doc.text(`${index + 1}. ${product.name}`, 20, yPos);
        doc.text(`Qty: ${product.quantity}`, 100, yPos);
        doc.text(`Price: ৳${product.price.toLocaleString()}`, 140, yPos);
        doc.text(`Total: ৳${(product.price * product.quantity).toLocaleString()}`, 160, yPos);
        yPos += 10;
      });

      // Total
      yPos += 10;
      doc.setFontSize(14);
      doc.setFillColor(22, 163, 74);
      doc.rect(120, yPos - 5, 70, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(`Total Amount: ৳${order.total_amount.toLocaleString()}`, 125, yPos + 5);

      // Footer
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(8);
      doc.text('Thank you for your purchase!', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text(`Payment Method: ${order.payment_method}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Save PDF
      doc.save(`Invoice-${order.order_id}.pdf`);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, text: 'text-emerald-700' },
      failed: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, text: 'text-red-700' },
      processing: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Clock, text: 'text-blue-700' },
      shipped: { bg: 'bg-amber-50', border: 'border-amber-200', icon: Truck, text: 'text-amber-700' },
    };
    return colors[status] || colors.processing;
  };

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <Package size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              Track and manage your purchases
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm font-medium"
          >
            <option value="all">All Orders</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </select>
        </div>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Package size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground text-sm">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter'
              : 'You haven\'t placed any orders yet'}
          </p>
        </div>
      ) : (
        filteredOrders.map((order) => {
          const statusConfig = getStatusColor(order.status);
          const StatusIcon = statusConfig.icon;
          const orderDate = new Date(order.createdAt);

          return (
            <div
              key={order._id}
              className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all mb-4"
            >
              {/* Header */}
              <div className={`${statusConfig.bg} border-b ${statusConfig.border} px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground text-lg">{order.order_id}</h3>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.text} ${statusConfig.bg}`}>
                      <StatusIcon size={14} />
                      {order.status}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Order placed on {orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">৳{order.total_amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{order.products.length} item(s)</p>
                </div>
              </div>

              {/* Order body */}
              <div className="px-6 py-4">
                <div className="mb-4 pb-4 border-b border-border/30">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Products</h4>
                  {order.products.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm mb-2">
                      <span>{p.name}</span>
                      <span>৳{(p.price * p.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <MapPin size={14} /> Delivery Address
                    </p>
                    <p className="text-sm font-medium text-foreground">{order.customer.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer.city}, {order.customer.country}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <DollarSign size={14} /> Payment Method
                    </p>
                    <p className="text-sm font-medium text-foreground">{order.payment_method}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-muted/30 border-t border-border/30 px-6 py-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye size={16} />
                  View Details
                </button>
                <button
                  onClick={() => downloadInvoice(order)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={16} />
                  Invoice
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-blue-50 border-b border-border/30 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">{selectedOrder.order_id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-muted rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <h3 className="font-bold text-foreground">Products</h3>
              {selectedOrder.products.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span>৳{p.price.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-border/30">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-primary font-bold text-xl">৳{selectedOrder.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
