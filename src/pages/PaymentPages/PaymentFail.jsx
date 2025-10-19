import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  XCircle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Home,
  MessageSquare,
  CreditCard,
  Clock,
  Phone,
  Mail,
  Globe,
  Banknote,
  Settings,
  Lock,
  CreditCardIcon,
} from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-toastify";

const PaymentFail = () => {
  const { tranId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (tranId) {
      fetchPaymentDetails();
    }
  }, [tranId]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axiosSecure.get(`/payments/details/${tranId}`);
      setPaymentData(response.data);

      // Extract failure reason from response
      if (response.data?.gateway_response?.failedreason) {
        setReason(response.data.gateway_response.failedreason);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = () => {
    if (!paymentData || !paymentData.gateway_response?.GatewayPageURL) {
      toast.error("Payment link not available!");
      return;
    }

    const url = paymentData.gateway_response.GatewayPageURL;
    toast.info("Redirecting to payment gateway...");

    window.location.href = url;
  };

  const handleContinueShopping = () => {
    navigate("/allProduct");
  };

  const handleContactSupport = () => {
    navigate("/dashboard/my-support");
  };

  const handleGoToCart = () => {
    navigate("/addToCart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Loading payment details...
          </p>
        </div>
      </div>
    );
  }

  const customer = paymentData?.customer || {};
  const totalAmount = paymentData?.total_amount || 0;
  const orderId = paymentData?.order_id || "N/A";
  const status = paymentData?.status || "failed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-50 pb-8 md:pb-12">
      <div className="container mx-auto">
        {/* Error Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Payment Failed
          </h1>
          <p className="text-muted-foreground text-lg">
            Unfortunately, we couldn't process your payment at this time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Details */}
            {paymentData && (
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard size={24} className="text-red-600" />
                  Transaction Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Order ID
                      </p>
                      <p className="font-mono font-semibold text-foreground text-sm">
                        {orderId}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Transaction ID
                      </p>
                      <p className="font-mono font-semibold text-foreground text-sm break-all">
                        {tranId}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Amount
                      </p>
                      <p className="font-bold text-red-600 text-lg">
                        ৳{totalAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600 mb-1">Status</p>
                      <p className="font-bold text-red-700 flex items-center gap-2">
                        <XCircle size={16} />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Reason */}
            {reason && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                  <AlertCircle size={20} />
                  Error Details
                </h3>
                <p className="text-red-800 text-sm">
                  {reason ||
                    "The payment gateway returned an error. Please try again or contact support."}
                </p>
              </div>
            )}

            {/* Possible Reasons */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                Possible Reasons
              </h3>
              <ul className="space-y-3 text-sm text-amber-900">
                <li className="flex items-start gap-3">
                  <CreditCardIcon
                    size={18}
                    className="text-amber-700 flex-shrink-0 mt-0.5"
                  />
                  <span>Insufficient funds or exceeded credit limit</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock
                    size={18}
                    className="text-amber-700 flex-shrink-0 mt-0.5"
                  />
                  <span>Incorrect card details or expired card</span>
                </li>
                <li className="flex items-start gap-3">
                  <Globe
                    size={18}
                    className="text-amber-700 flex-shrink-0 mt-0.5"
                  />
                  <span>Network connectivity or timeout issue</span>
                </li>
                <li className="flex items-start gap-3">
                  <Banknote
                    size={18}
                    className="text-amber-700 flex-shrink-0 mt-0.5"
                  />
                  <span>Your bank declined the transaction</span>
                </li>
                <li className="flex items-start gap-3">
                  <Settings
                    size={18}
                    className="text-amber-700 flex-shrink-0 mt-0.5"
                  />
                  <span>Payment gateway temporarily unavailable</span>
                </li>
              </ul>
            </div>

            {/* What to Do Next */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                What to Do Next?
              </h3>
              <ul className="space-y-3 text-sm text-blue-900">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 font-bold">1.</span>
                  <span>Review your payment details and try again</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 font-bold">2.</span>
                  <span>
                    Try a different payment method (Card, bKash, Nagad, etc.)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 font-bold">3.</span>
                  <span>Contact your bank if the issue persists</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 font-bold">4.</span>
                  <span>
                    Reach out to our support team for immediate assistance
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info Card */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm mb-6 sticky top-4">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Order Info
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
              </div>

              {/* Status Badge */}
              <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-200">
                <p className="text-xs text-red-600 font-semibold mb-1">
                  Payment Status
                </p>
                <p className="text-sm font-bold text-red-700">Failed</p>
                <p className="text-xs text-red-600 mt-2">
                  Your cart items are still saved. You can retry payment
                  anytime.
                </p>
              </div>

              {/* Support Info */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold mb-2 flex items-center gap-1">
                  <Phone size={12} className="text-blue-600" /> Support
                  Available
                </p>
                <p className="text-xs text-blue-700">
                  Our team is here to help 24/7. Contact us if you need
                  assistance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={handleRetryPayment}
            className="flex-1 sm:flex-none px-8 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Retry Payment
          </button>
          <button
            onClick={handleGoToCart}
            className="flex-1 sm:flex-none px-8 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} />
            Back to Cart
          </button>
          <button
            onClick={handleContactSupport}
            className="flex-1 sm:flex-none px-8 py-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} />
            Get Help
          </button>
        </div>

        {/* Continue Shopping Option */}
        <div className="text-center mt-6">
          <button
            onClick={handleContinueShopping}
            className="text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <Home size={16} />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
