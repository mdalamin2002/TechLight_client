import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const OrderSummary = ({ cartItems, subtotal, totalSavings, shippingCost, total }) => {
  return (
    <Card className="border-border shadow-md bg-card">
      <CardContent className="p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5">Order Summary</h2>

        <div className="space-y-3 mb-5 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({cartItems.length})</span>
            <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
          </div>
          {totalSavings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Product Discount</span>
              <span className="font-semibold">-৳{totalSavings.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping Cost</span>
            <span className="font-semibold">{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `৳${shippingCost.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="text-base font-semibold">Total</span>
            <span className="text-xl font-bold">৳{total.toLocaleString()}</span>
          </div>
        </div>

        <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm sm:text-base">
          Proceed to Checkout <ArrowRight className="w-5 h-5" />
        </button>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
