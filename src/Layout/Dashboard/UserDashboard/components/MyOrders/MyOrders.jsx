import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { CreditCard, PackageCheck, Truck, XCircle } from "lucide-react";

const orders = [
  {
    id: "#ORD-1001",
    date: "2025-10-01",
    status: "Delivered",
    total: "$120.00",
    method: "Visa",
  },
  {
    id: "#ORD-1002",
    date: "2025-09-25",
    status: "Processing",
    total: "$89.99",
    method: "Mastercard",
  },
  {
    id: "#ORD-1003",
    date: "2025-09-20",
    status: "Cancelled",
    total: "$49.00",
    method: "Paypal",
  },
];

const getStatusIcon = (status) => {
  switch (status) {
    case "Delivered":
      return <PackageCheck className="w-4 h-4 text-primary" />;
    case "Processing":
      return <Truck className="w-4 h-4 text-primary" />;
    case "Cancelled":
      return <XCircle className="w-4 h-4 text-primary" />;
    default:
      return null;
  }
};

const MyOrders = () => {
  return (
    <section className="">
      <div className="bg-card p-6 md:p-10 rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  {order.method}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default MyOrders;
