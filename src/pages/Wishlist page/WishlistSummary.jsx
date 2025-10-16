import React from "react";
import { Card, CardContent } from "@/Components/ui/card";

const WishlistSummary = ({ totalItems, totalValue, totalSavings, handleAddAllToCart }) => (
  <div className="sticky top-28 space-y-4">
    <Card className="shadow-md bg-card">
      <CardContent className="p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-5">Wishlist Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Total Items</span>
            <span className="font-bold">{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Value</span>
            <span className="font-bold">৳{totalValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-green-600 font-semibold">
            <span>Total Savings</span>
            <span>৳{totalSavings.toLocaleString()}</span>
          </div>
        </div>
        <button onClick={handleAddAllToCart} className="w-full mt-5 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:opacity-90 transition">
          Add All to Cart
        </button>
      </CardContent>
    </Card>
  </div>
);

export default WishlistSummary;
