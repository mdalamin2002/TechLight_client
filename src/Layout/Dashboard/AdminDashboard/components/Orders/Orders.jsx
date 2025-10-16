import React, { useState } from "react";
import OrderTable from "./components/OrderTable";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";
import { Package, TrendingUp, Users, DollarSign } from "lucide-react";

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

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) =>
    order.payment === "Paid" ? sum + parseFloat(order.amount.replace('$', '')) : sum, 0
  );
  const deliveredOrders = orders.filter(order => order.delivery === "Delivered").length;
  const pendingOrders = orders.filter(order => order.payment === "Pending").length;

  // status update
  const handleStatusChange = (id, field, value) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, [field]: value } : order
      )
    );
  };

  // dynamically generate unique payment & delivery options
  const paymentStatuses = ["All Status", ...new Set(orders.map(o => o.payment))];
  const deliveryStatuses = ["All Delivery", ...new Set(orders.map(o => o.delivery))];

  // dynamic status list for dropdown actions
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
    <div className="p-4 md:p-6 bg-background min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Order Management</h2>
        <p className="text-muted-foreground">
          Track and manage all customer orders and deliveries.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalOrders}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Delivered</p>
              <p className="text-2xl font-bold text-foreground mt-1">{deliveredOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending</p>
              <p className="text-2xl font-bold text-foreground mt-1">{pendingOrders}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
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
    </div>
  );
};

export default Orders;
