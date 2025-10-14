import React, { useState } from "react";
import OrderActions from "./OrderActions";

const OrderTable = ({ orders, onStatusChange, paymentList, deliveryList }) => {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className="overflow-x-auto rounded-xl border-0 shadow-sm">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-4 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</span>
            </th>
            <th className="px-4 py-4 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</span>
            </th>
            <th className="px-4 py-4 text-left hidden md:table-cell">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</span>
            </th>
            <th className="px-4 py-4 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</span>
            </th>
            <th className="px-4 py-4 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment</span>
            </th>
            <th className="px-4 py-4 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery</span>
            </th>
            <th className="px-4 py-4 text-left hidden md:table-cell">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</span>
            </th>
            <th className="px-4 py-4 text-right">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {orders.map((order, i) => (
            <tr
              key={i}
              className="hover:bg-muted/20 transition-colors duration-150"
            >
              <td className="px-4 py-4">
                <span className="text-sm font-medium text-primary">{order.id}</span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {order.customer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">{order.customer}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <div className="text-sm text-muted-foreground max-w-xs truncate" title={order.products}>
                  {order.products}
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm font-semibold text-foreground">{order.amount}</span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.payment === "Paid"
                    ? "bg-green-100 text-green-800"
                    : order.payment === "Pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                    order.payment === "Paid"
                      ? "bg-green-500"
                      : order.payment === "Pending"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}></span>
                  {order.payment}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.delivery === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.delivery === "Shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.delivery === "Processing"
                    ? "bg-amber-100 text-amber-800"
                    : order.delivery === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-orange-100 text-orange-800"
                }`}>
                  <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                    order.delivery === "Delivered"
                      ? "bg-green-500"
                      : order.delivery === "Shipped"
                      ? "bg-blue-500"
                      : order.delivery === "Processing"
                      ? "bg-amber-500"
                      : order.delivery === "Cancelled"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}></span>
                  {order.delivery}
                </span>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <span className="text-sm text-muted-foreground">{order.date}</span>
              </td>
              <td className="px-4 py-4 text-right">
                <OrderActions
                  order={order}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  onStatusChange={onStatusChange}
                  paymentList={paymentList}
                  deliveryList={deliveryList}
                  index={i}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
