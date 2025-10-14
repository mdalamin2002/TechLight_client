"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const PaymentMethods = () => {
  const [methods, setMethods] = useState([
    {
      id: 1,
      type: "Visa",
      last4: "1234",
      isDefault: true,
    },
    {
      id: 2,
      type: "bKash",
      number: "01XXXXXXXXX",
      isDefault: false,
    },
  ]);

  const handleSetDefault = (id) => {
    const updated = methods.map((method) =>
      method.id === id
        ? { ...method, isDefault: true }
        : { ...method, isDefault: false }
    );
    setMethods(updated);
  };

  const handleRemove = (id) => {
    const updated = methods.filter((method) => method.id !== id);
    setMethods(updated);
  };

  const handleEdit = (id) => {
    alert(`Edit method with id: ${id}`);
  };

  const handleAddNew = () => {
    alert("Open modal/form to add new payment method");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Payment Methods</h2>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Card
        </Button>
      </div>

      {/* Payment Cards Section */}
      <div className="grid grid-cols-1 gap-4">
        {methods.map((method) => (
          <Card key={method.id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="text-lg font-medium">
                {method.type}{" "}
                {method.last4
                  ? `**** ${method.last4}`
                  : method.number}
              </div>

              {method.isDefault && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Default
                </Badge>
              )}
            </CardHeader>

            <CardContent className="text-sm text-gray-500">
              {method.isDefault
                ? "This is your default payment method."
                : "You can set this as default."}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(method.id)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(method.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>

              {!method.isDefault && (
                <Button
                  size="sm"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Make Default
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
