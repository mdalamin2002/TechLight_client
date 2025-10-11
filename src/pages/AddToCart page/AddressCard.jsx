import React from "react";
import { MapPin, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AddressCard = ({ savedAddress, onEdit }) => {
  return (
    <Card className="border-border bg-card rounded-xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground text-sm sm:text-base">Delivery Address</h4>
        </div>

        {savedAddress && savedAddress._id ? (
          <div className="border p-3 rounded-lg bg-background/50 text-sm space-y-1">
            <p><span className="font-semibold">{savedAddress.fullName}</span> ({savedAddress.type})</p>
            <p>{savedAddress.phone}</p>
            {savedAddress.altPhone && <p>Alt: {savedAddress.altPhone}</p>}
            <p>{savedAddress.street}, {savedAddress.city}, {savedAddress.postal}</p>
            {savedAddress.landmark && <p>Landmark: {savedAddress.landmark}</p>}
            {savedAddress.instructions && <p>Note: {savedAddress.instructions}</p>}
            {savedAddress.default && <p className="text-green-600 font-medium">Default Address</p>}
            <button onClick={onEdit} className="mt-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90">Edit Address</button>
          </div>
        ) : (
          <div onClick={onEdit} className="w-full h-28 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:border-primary/70 hover:text-primary transition">
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Add Delivery Address</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressCard;
