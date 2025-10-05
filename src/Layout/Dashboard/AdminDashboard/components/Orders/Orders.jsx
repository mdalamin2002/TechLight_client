import React, { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import OrderTable from "./components/OrderTable";
import { CSVLink } from "react-csv";

const Orders = () => {
  const orders = [
    { id: "#ORD-001", customer: "John Doe", products: "iPhone 15 Pro, Case", amount: "$1049", payment: "Paid", delivery: "Delivered", date: "2024-01-15" },
    { id: "#ORD-002", customer: "Jane Smith", products: "Nike Air Max", amount: "$129", payment: "Paid", delivery: "Shipped", date: "2024-01-16" },
    { id: "#ORD-003", customer: "Mike Johnson", products: "MacBook Pro", amount: "$1999", payment: "Pending", delivery: "Processing", date: "2024-01-17" },
    { id: "#ORD-004", customer: "Sarah Wilson", products: "Coffee Maker, Filters", amount: "$119", payment: "Paid", delivery: "Pending", date: "2024-01-18" },
    { id: "#ORD-005", customer: "David Brown", products: "Gaming Chair", amount: "$299", payment: "Refunded", delivery: "Cancelled", date: "2024-01-19" },
    // duplicate orders for testing pagination
    { id: "#ORD-006", customer: "Alice Green", products: "iPad", amount: "$799", payment: "Paid", delivery: "Delivered", date: "2024-01-20" },
    { id: "#ORD-007", customer: "Bob White", products: "Headphones", amount: "$199", payment: "Pending", delivery: "Processing", date: "2024-01-21" },
  ];

  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selectedPayment, setSelectedPayment] = useState("All Status");
  const [selectedDelivery, setSelectedDelivery] = useState("All Delivery");

  // Dynamic unique payment & delivery statuses
  const paymentStatuses = ["All Status", ...Array.from(new Set(orders.map(o => o.payment)))];
  const deliveryStatuses = ["All Delivery", ...Array.from(new Set(orders.map(o => o.delivery)))];

  // Filtered & paginated orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesPayment = selectedPayment === "All Status" || o.payment === selectedPayment;
    const matchesDelivery = selectedDelivery === "All Delivery" || o.delivery === selectedDelivery;
    return matchesSearch && matchesPayment && matchesDelivery;
  });

  const pageCount = Math.ceil(filteredOrders.length / pageSize);
  const currentPageData = filteredOrders.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);



  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-lg rounded-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
        <p className="text-sm text-gray-500">Track and manage all customer orders and deliveries.</p>
      </div>

      <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-lg rounded-2xl">
        {/* Search + Export + Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-3 items-center">
          <div className="relative w-72">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="py-2 pl-10 pr-3 bg-white shadow-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
          <div className="flex gap-4 flex-wrap">
            <select
              className="px-3 py-2 rounded-lg text-sm outline-none w-full md:w-auto bg-card shadow"
              value={selectedPayment}
              onChange={(e) => {
                setSelectedPayment(e.target.value);
                setPageIndex(0);
              }}
            >
              {paymentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded-lg text-sm outline-none w-full md:w-auto bg-card shadow"
              value={selectedDelivery}
              onChange={(e) => {
                setSelectedDelivery(e.target.value);
                setPageIndex(0);
              }}
            >
              {deliveryStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <CSVLink
              data={filteredOrders}
              filename={"orders-report.csv"}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <Download size={16} /> Export
            </CSVLink>
          </div>
        </div>

        {/* Table */}
        <OrderTable orders={currentPageData} />

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button
              onClick={() => setPageIndex(prev => Math.min(prev + 1, pageCount - 1))}
              disabled={pageIndex >= pageCount - 1}
              className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          <span className="text-gray-700 text-sm">
            Page <strong>{pageIndex + 1}</strong> of <strong>{pageCount}</strong>
          </span>

          {/* Go to page input */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            Go to page:
            <input
              type="number"
              min={1}
              max={pageCount}
              value={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                setPageIndex(Math.min(Math.max(page, 0), pageCount - 1));
              }}
              className="w-16 p-1 border rounded-lg shadow-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Page size selector */}
          <select
            value={pageSize}
            onChange={e => {
              setPageIndex(0);
              setPageSize(Number(e.target.value));
            }}
            className="p-2 border rounded-lg shadow-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {[5, 10, 20, 30, 50].map(size => (
              <option key={size} value={size}>Show {size}</option>
            ))}
          </select>
        </div>
      </div>


    </div>
  );
};

export default Orders;
