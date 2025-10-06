import React from "react";
import {
  Eye,
  RotateCcw,
  X,
  Search,
  Download,
} from "lucide-react";

const Orders = () => {
  const orders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      products: "iPhone 15 Pro, Case",
      amount: "$1049",
      payment: "Paid",
      delivery: "Delivered",
      date: "2024-01-15",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      products: "Nike Air Max",
      amount: "$129",
      payment: "Paid",
      delivery: "Shipped",
      date: "2024-01-16",
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      products: "MacBook Pro",
      amount: "$1999",
      payment: "Pending",
      delivery: "Processing",
      date: "2024-01-17",
    },
    {
      id: "#ORD-004",
      customer: "Sarah Wilson",
      products: "Coffee Maker, Filters",
      amount: "$119",
      payment: "Paid",
      delivery: "Pending",
      date: "2024-01-18",
    },
    {
      id: "#ORD-005",
      customer: "David Brown",
      products: "Gaming Chair",
      amount: "$299",
      payment: "Refunded",
      delivery: "Cancelled",
      date: "2024-01-19",
    },
    {
      id: "#ORD-005",
      customer: "David Brown",
      products: "Gaming Chair",
      amount: "$299",
      payment: "Refunded",
      delivery: "Cancelled",
      date: "2024-01-19",
    },
    {
      id: "#ORD-005",
      customer: "David Brown",
      products: "Gaming Chair",
      amount: "$299",
      payment: "Refunded",
      delivery: "Cancelled",
      date: "2024-01-19",
    },
    {
      id: "#ORD-005",
      customer: "David Brown",
      products: "Gaming Chair",
      amount: "$299",
      payment: "Refunded",
      delivery: "Cancelled",
      date: "2024-01-19",
    },
    {
      id: "#ORD-005",
      customer: "David Brown",
      products: "Gaming Chair",
      amount: "$299",
      payment: "Refunded",
      delivery: "Cancelled",
      date: "2024-01-19",
    },
  ];

  return (
    <div className="min-h-screen p-1 bg-background">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
          <p className="text-sm text-gray-500">
            Track and manage all customer orders and deliveries.
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center rounded-lg px-3 w-full md:w-1/2 bg-card ">
          <Search className=" w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>
        <select className="px-3 py-2 rounded-lg text-sm outline-none w-full md:w-auto bg-card shadow">
          <option>All Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Refunded</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <button className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-pink-300 to-purple-300 px-4 py-2 rounded-lg text-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border shadow-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-black/10">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Products</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Delivery</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i} className="border-b">
                <td className="py-3 px-4 text-purple-400 font-medium">
                  {order.id}
                </td>
                <td className="py-3 px-4 font-medium">{order.customer}</td>
                <td className="py-3 px-4">{order.products}</td>
                <td className="py-3 px-4 font-medium">{order.amount}</td>
                <td
                  className={`py-3 px-4 font-medium ${
                    order.payment === "Paid"
                      ? "text-green-400"
                      : order.payment === "Pending"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`}
                >
                  {order.payment}
                </td>
                <td
                  className={`py-3 px-4 font-medium ${
                    order.delivery === "Delivered"
                      ? "text-green-400"
                      : order.delivery === "Shipped"
                      ? "text-blue-400"
                      : order.delivery === "Processing"
                      ? "text-yellow-400"
                      : order.delivery === "Cancelled"
                      ? "text-red-400"
                      : "text-orange-400"
                  }`}
                >
                  {order.delivery}
                </td>
                <td className="py-3 px-4">{order.date}</td>
                <td className="py-3 px-4 flex items-center gap-3">
                  <Eye className="w-5 h-5 cursor-pointer text-purple-400" />
                  <RotateCcw className="w-5 h-5 cursor-pointer text-blue-400" />
                  <X className="w-5 h-5 cursor-pointer text-red-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
