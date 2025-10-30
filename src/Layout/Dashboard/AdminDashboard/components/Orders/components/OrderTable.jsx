import React, { useState } from "react";
import OrderActions from "./OrderActions";

const OrderTable = ({ orders, onStatusChange, paymentList, deliveryList }) => {
  const [openMenu, setOpenMenu] = useState(null);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to get customer name
  const getCustomerName = (customer) => {
    if (!customer) return "N/A";
    return customer.fullName || customer.name || "N/A";
  };

  // Helper function to get customer email
  const getCustomerEmail = (customer) => {
    if (!customer) return "N/A";
    return customer.email || "N/A";
  };

  // Helper function to get product names with truncation
  const getProductNames = (products) => {
    if (!products || !Array.isArray(products) || products.length === 0) return "No products";
    const productNames = products.map(p => p.name || "Unnamed Product").join(", ");
    // Truncate if too long
    if (productNames.length > 30) {
      return productNames.substring(0, 30) + "...";
    }
    return productNames;
  };

  // Helper function to get seller names with truncation
  const getSellerNames = (sellers) => {
    if (!sellers || !Array.isArray(sellers) || sellers.length === 0) {
      return "No sellers";
    }
    const sellerNames = sellers.map(s => s.name || "Unknown Seller").join(", ");
    // Truncate if too long
    if (sellerNames.length > 30) {
      return sellerNames.substring(0, 30) + "...";
    }
    return sellerNames;
  };

  // Helper function to get order status
  const getOrderStatus = (order) => {
    return order.status || "N/A";
  };

  // Helper function to get payment method
  const getPaymentMethod = (order) => {
    return order.payment_method || "N/A";
  };

  // Helper function to get order amount
  const getOrderAmount = (order) => {
    if (order.total_amount) {
      return `BDT ${order.total_amount.toLocaleString()}`;
    }
    return "BDT 0";
  };

  return (
    <div className="overflow-x-auto rounded-xl border-0 shadow-sm">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white">
            <th className="px-4 py-4 text-left w-24">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Order ID</span>
            </th>
            <th className="px-4 py-4 text-left w-40">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Customer</span>
            </th>
            <th className="px-4 py-4 text-left hidden md:table-cell w-40">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Products</span>
            </th>
            <th className="px-4 py-4 text-left hidden lg:table-cell w-40">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Sellers</span>
            </th>
            <th className="px-4 py-4 text-left w-24">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Amount</span>
            </th>
            <th className="px-4 py-4 text-left w-24">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Status</span>
            </th>
            <th className="px-4 py-4 text-left hidden md:table-cell w-24">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Method</span>
            </th>
            <th className="px-4 py-4 text-left hidden md:table-cell w-24">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Date</span>
            </th>
            <th className="px-4 py-4 text-right w-20">
              <span className="text-left text-xs md:text-sm font-bold tracking-wide">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {orders.map((order, i) => (
            <tr
              key={order._id}
              className="hover:bg-muted/20 transition-colors duration-150"
            >
              <td className="px-4 py-4">
                <span className="text-sm font-medium text-primary truncate block max-w-[100px]" title={order.order_id || "N/A"}>
                  {order.order_id || "N/A"}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {getCustomerName(order.customer).split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate max-w-[120px]" title={getCustomerName(order.customer)}>
                      {getCustomerName(order.customer)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]" title={getCustomerEmail(order.customer)}>
                      {getCustomerEmail(order.customer)}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <div className="text-sm text-muted-foreground truncate max-w-[150px]" title={getProductNames(order.products)}>
                  {getProductNames(order.products)}
                </div>
              </td>
              <td className="px-4 py-4 hidden lg:table-cell">
                <div className="text-sm text-muted-foreground truncate max-w-[150px]" title={getSellerNames(order.sellers)}>
                  {getSellerNames(order.sellers)}
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm font-semibold text-foreground truncate block max-w-[90px]" title={getOrderAmount(order)}>
                  {getOrderAmount(order)}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium truncate max-w-[90px] ${
                  getOrderStatus(order) === "success"
                    ? "bg-green-100 text-green-800"
                    : getOrderStatus(order) === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : getOrderStatus(order) === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : getOrderStatus(order) === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-orange-100 text-orange-800"
                }`}>
                  <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                    getOrderStatus(order) === "success"
                      ? "bg-green-500"
                      : getOrderStatus(order) === "pending"
                      ? "bg-amber-500"
                      : getOrderStatus(order) === "shipped"
                      ? "bg-blue-500"
                      : getOrderStatus(order) === "cancelled"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}></span>
                  <span className="truncate" title={getOrderStatus(order)}>
                    {getOrderStatus(order)}
                  </span>
                </span>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <span className="text-sm text-muted-foreground truncate block max-w-[90px]" title={getPaymentMethod(order)}>
                  {getPaymentMethod(order)}
                </span>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <span className="text-sm text-muted-foreground truncate block max-w-[90px]" title={formatDate(order.createdAt)}>
                  {formatDate(order.createdAt)}
                </span>
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

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
