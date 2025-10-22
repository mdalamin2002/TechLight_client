import React from "react";
import { MapPin, Plus, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Link } from "react-router-dom";

const AddressCard = ({ savedAddress, onEdit, onAddNew }) => {
  return (
    <Card className="border-border bg-card rounded-xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground text-sm sm:text-base">Delivery Address</h4>
        </div>

        {savedAddress && savedAddress._id ? (
          <div className="border p-3 rounded-lg bg-background/50 text-sm space-y-1">
            <p><span className="font-semibold">{savedAddress.fullName}</span> {savedAddress.label && `(${savedAddress.label})`}</p>
            <p>{savedAddress.phone}</p>
            {savedAddress.altPhone && <p>Alt: {savedAddress.altPhone}</p>}
            <p>{savedAddress.street}, {savedAddress.city}, {savedAddress.postal}</p>
            {savedAddress.landmark && <p>Landmark: {savedAddress.landmark}</p>}
            {savedAddress.instructions && <p>Note: {savedAddress.instructions}</p>}
            {savedAddress.default && <p className="text-green-600 font-medium">✓ Default Address</p>}
            <button
              onClick={onEdit}
              className="mt-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-1.5 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              onClick={onAddNew}
              className="w-full h-28 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:border-primary/70 hover:text-primary transition"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Add Delivery Address</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Or manage all addresses</p>
              <Link
                to="/dashboard/my-addresses"
                className="inline-block px-4 py-2 text-sm bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all font-medium"
              >
                Go to My Addresses
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressCard;
