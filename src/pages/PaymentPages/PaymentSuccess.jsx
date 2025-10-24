import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  Package,
  Clock,
  Mail,
  Truck,
  ShoppingBag,
  Download,
  Home,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  Lock,
  FileText,
} from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useCart from "@/hooks/useCart";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const PaymentSuccess = () => {
  const { tranId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { clearCart } = useCart();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    if (tranId) {
      fetchPaymentDetails();
    }
  }, [tranId]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axiosSecure.get(`/payments/details/${tranId}`);
      setPaymentData(response.data);

      // Clear cart after successful payment (only once)
      if (response.data?.status === "success" && !cartCleared) {
        clearCart(undefined, {
          onSuccess: () => {
            setCartCleared(true);
            console.log("Cart cleared after successful payment");
          },
          onError: (error) => {
            console.error("Failed to clear cart:", error);
          },
        });
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/allProduct");
  };

  const handleViewOrders = () => {
    navigate("/dashboard/my-orders");
  };

  const handleContactSupport = () => {
    navigate("/dashboard/my-support");
  };

  const handleDownloadInvoice = () => {
    if (!paymentData) {
      toast.error("No payment data found!");
      return;
    }
    toast.info("Generating invoice...");

    const doc = new jsPDF();

    // Invoice Title
    doc.setFontSize(16);
    doc.text("Invoice", 20, 20);

    // Order & Payment Info
    doc.setFontSize(12);
    doc.text(`Order ID: ${paymentData.order_id}`, 20, 40);
    doc.text(`Transaction ID: ${paymentData.tran_id}`, 20, 50);
    doc.text(`Amount Paid: ৳${paymentData.total_amount}`, 20, 60);
    doc.text(
      `Payment Date: ${new Date(paymentData.paidAt).toLocaleString()}`,
      20,
      70
    );

    // Customer Details
    doc.text("Customer Details:", 20, 90);
    doc.text(`Name: ${paymentData.customer.name}`, 20, 100);
    doc.text(`Email: ${paymentData.customer.email}`, 20, 110);
    doc.text(`Phone: ${paymentData.customer.phone}`, 20, 120);

    // Products Table
    doc.text("Products:", 20, 140);
    paymentData.products.forEach((product, index) => {
      const y = 150 + index * 10;
      doc.text(
        `- ${product.name} x${product.quantity} - ৳${product.price}`,
        20,
        y
      );
    });

    // Save PDF
    doc.save(`invoice_${paymentData.order_id}.pdf`);
    toast.success("Invoice downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Loading payment details...
          </p>
        </div>
      </div>
    );
  }

  const customer = paymentData?.customer || {};
  const products = paymentData?.products || [];
  const totalAmount = paymentData?.total_amount || 0;
  const orderId = paymentData?.order_id || "N/A";
  const transactionId = paymentData?.tran_id || tranId;
  const paidAt = paymentData?.paidAt
    ? new Date(paymentData.paidAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-50 pb-8 md:pb-12">
      <div className="container mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your order has been confirmed and is being processed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Details Card */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <CreditCard size={24} className="text-primary" />
                Transaction Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <FileText size={14} className="text-primary" /> Order ID
                    </p>
                    <p className="font-mono font-semibold text-foreground text-sm">
                      {orderId}
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Lock size={14} className="text-primary" /> Transaction ID
                    </p>
                    <p className="font-mono font-semibold text-foreground text-sm break-all">
                      {transactionId}
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <DollarSign size={14} className="text-primary" /> Amount
                      Paid
                    </p>
                    <p className="font-bold text-primary text-lg">
                      ৳{totalAmount?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-sm text-emerald-600 mb-1 flex items-center gap-1">
                      <span>✓</span> Payment Status
                    </p>
                    <p className="font-bold text-emerald-700 flex items-center gap-2">
                      <CheckCircle size={16} />
                      {paymentData?.status === "success"
                        ? "Completed"
                        : paymentData?.status}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar size={14} /> Payment Date & Time
                    </p>
                    <p className="font-semibold text-foreground">{paidAt}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ShoppingBag size={24} className="text-primary" />
                Order Summary ({products.length}{" "}
                {products.length === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-3">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <Package size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Product Code: {product.productId?.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        ৳{product.price?.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Truck size={20} />
                What Happens Next?
              </h3>
              <ul className="space-y-3 text-sm text-blue-900">
                <li className="flex items-start gap-3">
                  <Mail
                    size={16}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <span>
                    Confirmation email will be sent to{" "}
                    <strong>{customer.email}</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock
                    size={16}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <span>
                    Your order is being processed. We'll prepare it for shipment
                    within 24 hours
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Package
                    size={16}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <span>
                    You can track your order status in your dashboard anytime
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Truck
                    size={16}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <span>
                    Estimated delivery: 2-5 business days depending on your
                    location
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone
                    size={16}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <span>
                    Our support team will contact you at{" "}
                    <strong>{customer.phone}</strong> with tracking details
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Info Card */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm mb-6 sticky top-4">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Delivery Info
              </h3>

              <div className="space-y-4 mb-4 pb-4 border-b border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Mail size={12} /> Email
                  </p>
                  <p className="text-sm font-medium text-foreground break-all">
                    {customer.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Phone size={12} /> Phone
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {customer.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin size={12} /> Address
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {customer.address ? (
                      <>
                        <div>{customer.address}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {customer.city}
                          {customer.postal && `, ${customer.postal}`}
                        </div>
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={16} />
                  Download Invoice
                </button>
                <button
                  onClick={handleViewOrders}
                  className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Home size={16} />
                  My Orders
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-900 mb-3">
                Need Help?
              </h3>
              <p className="text-sm text-amber-800 mb-4">
                Our support team is available 24/7 to assist you.
              </p>
              <button
                onClick={handleContactSupport}
                className="w-full px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors text-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={handleContinueShopping}
            className="flex-1 sm:flex-none px-8 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </button>
          <button
            onClick={handleViewOrders}
            className="flex-1 sm:flex-none px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            View My Orders
            <Package size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
