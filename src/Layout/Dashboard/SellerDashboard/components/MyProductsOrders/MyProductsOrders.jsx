import React, { useState } from "react";
import {
  Search,
  Eye,
  PackageCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const MyProductsOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ for modal

  // Dummy orders
  const orders = [
    {
      id: 101,
      product: {
        name: "Galaxy Watch 5",
        image: "https://i.ibb.co.com/9MYzrSp/Samsung-Galaxy-Watch-4-Pink-Gold-1.webp",
        description: "Smartwatch with fitness tracking and AMOLED display.",
      },
      buyer: "John Doe",
      quantity: 2,
      total: "$498",
      status: "Pending",
      date: "2025-10-20",
    },
    {
      id: 102,
      product: {
        name: "Apple AirPods Pro",
        image: "https://i.ibb.co.com/bMJ2ywbf/Apple-Air-Pods-Pro-2nd-gen-hero-220907-big-jpg-large.jpg",
        description: "Wireless earbuds with noise cancellation.",
      },
      buyer: "Alice Smith",
      quantity: 1,
      total: "$199",
      status: "Shipped",
      date: "2025-10-19",
    },
    {
      id: 103,
      product: {
        name: "Sony WH-1000XM5",
        image: "https://i.ibb.co.com/mV6jz31J/Logitech-MX-Master-3-Advanced-Wireless-7-Button-Mouse-3-1.webp",
        description: "Top-tier noise-canceling headphones.",
      },
      buyer: "Michael Lee",
      quantity: 1,
      total: "$349",
      status: "Delivered",
      date: "2025-10-18",
    },
    {
      id: 104,
      product: {
        name: "Logitech MX Master 3",
        image: "https://i.ibb.co.com/x8CcCMGB/images.jpg",
        description: "Ergonomic wireless mouse for productivity.",
      },
      buyer: "Sarah Brown",
      quantity: 1,
      total: "$99",
      status: "Canceled",
      date: "2025-10-17",
    },
  ];

  // ✅ Filter logic
  const filteredOrders = orders.filter((order) => {
    const searchMatch = order.product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch =
      statusFilter === "All" ? true : order.status === statusFilter;
    return searchMatch && statusMatch;
  });

  // ✅ Summary count
  const summary = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    canceled: orders.filter((o) => o.status === "Canceled").length,
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          My Product Orders
        </h1>
        <p className="text-gray-500">
          Track all your product orders with real-time status updates.
        </p>
      </div>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-blue-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-bold text-gray-800">{summary.total}</h2>
          </div>
          <PackageCheck className="w-8 h-8 text-blue-600" />
        </div>

        <div className="bg-yellow-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.pending}
            </h2>
          </div>
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>

        <div className="bg-sky-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Shipped</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.shipped}
            </h2>
          </div>
          <PackageCheck className="w-8 h-8 text-sky-600" />
        </div>

        <div className="bg-green-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Delivered</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.delivered}
            </h2>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>

        <div className="bg-red-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Canceled</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.canceled}
            </h2>
          </div>
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search order by product..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Order ID</th>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Buyer</th>
              <th className="px-6 py-3 font-medium">Quantity</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <p>{order.product.name}</p>
                  </td>
                  <td className="px-6 py-4">{order.buyer}</td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4 font-semibold">{order.total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-10 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            <div className="text-center space-y-3">
              <img
                src={selectedOrder.product.image}
                alt={selectedOrder.product.name}
                className="w-32 h-32 rounded-lg object-cover mx-auto"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedOrder.product.name}
              </h2>
              <p className="text-gray-500">{selectedOrder.product.description}</p>

              <div className="mt-4 text-left space-y-2">
                <p>
                  <strong>Buyer:</strong> {selectedOrder.buyer}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedOrder.quantity}
                </p>
                <p>
                  <strong>Total:</strong> {selectedOrder.total}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong> {selectedOrder.date}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsOrders;
