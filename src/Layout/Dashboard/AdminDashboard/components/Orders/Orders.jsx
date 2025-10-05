import React, { useState } from "react";
import OrderTable from "./components/OrderTable";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";

const Orders = () => {
  const [orders, setOrders] = useState([
    { id: "#ORD-001", customer: "John Doe", products: "iPhone 15 Pro, Case", amount: "$1049", payment: "Paid", delivery: "Delivered", date: "2024-01-15" },
    { id: "#ORD-002", customer: "Jane Smith", products: "Nike Air Max", amount: "$129", payment: "Paid", delivery: "Shipped", date: "2024-01-16" },
    { id: "#ORD-003", customer: "Mike Johnson", products: "MacBook Pro", amount: "$1999", payment: "Pending", delivery: "Processing", date: "2024-01-17" },
    { id: "#ORD-004", customer: "Sarah Wilson", products: "Coffee Maker, Filters", amount: "$119", payment: "Paid", delivery: "Pending", date: "2024-01-18" },
    { id: "#ORD-005", customer: "David Brown", products: "Gaming Chair", amount: "$299", payment: "Refunded", delivery: "Cancelled", date: "2024-01-19" },
    { id: "#ORD-006", customer: "Alice Green", products: "iPad", amount: "$799", payment: "Paid", delivery: "Delivered", date: "2024-01-20" },
    { id: "#ORD-007", customer: "Bob White", products: "Headphones", amount: "$199", payment: "Pending", delivery: "Processing", date: "2024-01-21" },
  ]);

  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selectedPayment, setSelectedPayment] = useState("All Status");
  const [selectedDelivery, setSelectedDelivery] = useState("All Delivery");

  // ✅ status update
  const handleStatusChange = (id, field, value) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, [field]: value } : order
      )
    );
  };

  // ✅ dynamically generate unique payment & delivery options
  const paymentStatuses = ["All Status", ...new Set(orders.map(o => o.payment))];
  const deliveryStatuses = ["All Delivery", ...new Set(orders.map(o => o.delivery))];

  // ✅ dynamic status list for dropdown actions
  const uniquePaymentStatusList = [...new Set(orders.map(o => o.payment))];
  const uniqueDeliveryStatusList = [...new Set(orders.map(o => o.delivery))];

  // filter
  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesPayment =
      selectedPayment === "All Status" || o.payment === selectedPayment;
    const matchesDelivery =
      selectedDelivery === "All Delivery" || o.delivery === selectedDelivery;
    return matchesSearch && matchesPayment && matchesDelivery;
  });

  // pagination
  const pageCount = Math.ceil(filteredOrders.length / pageSize);
  const currentPageData = filteredOrders.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-lg rounded-2xl">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
        <p className="text-sm text-gray-500">
          Track and manage all customer orders and deliveries.
        </p>
      </header>

      <OrderFilters
        search={search}
        setSearch={setSearch}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        selectedDelivery={selectedDelivery}
        setSelectedDelivery={setSelectedDelivery}
        paymentStatuses={paymentStatuses}
        deliveryStatuses={deliveryStatuses}
        filteredOrders={filteredOrders}
      />

      {/* ✅ Pass dynamic lists */}
      <OrderTable
        orders={currentPageData}
        onStatusChange={handleStatusChange}
        paymentList={uniquePaymentStatusList}
        deliveryList={uniqueDeliveryStatusList}
      />

      <OrderPagination
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageCount={pageCount}
      />
    </div>
  );
};

export default Orders;
