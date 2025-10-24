import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { XCircle, ArrowRight, ShoppingCart, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-toastify";

const PaymentCancel = () => {
  const { tranId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tranId) {
      fetchPaymentDetails();
    }
  }, [tranId]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axiosSecure.get(`/payments/details/${tranId}`);
      setPaymentData(response.data);
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

  const handleGoToCart = () => {
    navigate("/addToCart");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-8 h-8 animate-pulse mx-auto mb-4 text-orange-500" />
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-8 text-center">
            {/* Cancel Icon */}
            <div className="mb-6">
              <XCircle className="w-20 h-20 text-orange-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-orange-700 mb-2">
                Payment Cancelled
              </h1>
              <p className="text-orange-600">
                Your payment was cancelled. No charges have been made to your account.
              </p>
            </div>

            {/* Transaction Details */}
            {paymentData && (
              <div className="bg-white rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-foreground">{tranId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono text-foreground">
                      {paymentData.order_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold text-foreground">
                      ৳{paymentData.total_amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-orange-600 font-semibold">
                      {paymentData.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Why Was It Cancelled? */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-yellow-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Why Was It Cancelled?
              </h3>
              <ul className="text-sm text-yellow-700 space-y-2 text-left">
                <li>• You clicked the cancel button during payment</li>
                <li>• You closed the payment window before completing</li>
                <li>• You navigated away from the payment page</li>
                <li>• Session timeout occurred</li>
              </ul>
            </div>

            {/* Your Items Are Safe */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-green-800">
                Your Items Are Safe
              </h3>
              <ul className="text-sm text-green-700 space-y-2 text-left">
                <li>• Your cart items are still saved</li>
                <li>• No charges were made to your account</li>
                <li>• You can complete your purchase anytime</li>
                <li>• Your personal information is secure</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleGoToCart}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Complete Purchase
              </Button>
              <Button
                onClick={handleContinueShopping}
                variant="outline"
                className="flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleGoHome}
                variant="ghost"
                className="flex items-center gap-2"
              >
                Go Home
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancel;
