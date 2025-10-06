
import React, { useEffect, useState } from "react";

export const OrdersReport = ({ dateRange, onDataUpdate }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/OrdersReport_Data.json")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error loading orders:", err));
  }, []);

  const filterOrders = () => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case "Last 7 Days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case "Last 30 Days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      case "Last 6 Months":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "Last 1 Year":
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date("2000-01-01");
    }

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= now;
    });
  };

  const filteredOrders = filterOrders();

  // 🟩 Summary for Excel Export
  const total = filteredOrders.length || 1;
  const summary = {
    totalOrders: total,
    successPercent: (
      (filteredOrders.filter((o) => o.status === "Completed").length / total) *
      100
    ).toFixed(1),
    pendingPercent: (
      (filteredOrders.filter((o) => o.status === "Pending").length / total) *
      100
    ).toFixed(1),
    cancelledPercent: (
      (filteredOrders.filter((o) => o.status === "Cancelled").length / total) *
      100
    ).toFixed(1),
  };

  // 🟩 Send back data to parent (for Excel export)
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({ orders: filteredOrders, summary });
    }
  }, [filteredOrders]);

    return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Order Report ({dateRange})
      </h3>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-gray-600 font-medium">Order ID</th>
              <th className="p-4 text-gray-600 font-medium">Customer</th>
              <th className="p-4 text-gray-600 font-medium">Amount</th>
              <th className="p-4 text-gray-600 font-medium">Status</th>
              <th className="p-4 text-gray-600 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="p-4 text-gray-800 font-medium">{order.id}</td>
                  <td className="p-4 text-gray-700">{order.customer}</td>
                  <td className="p-4 text-gray-700">${order.amount}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{order.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found for {dateRange}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delivery Success vs Cancel Ratio */}
      <div className="mt-6">
        <h4 className="text-gray-700 font-semibold mb-3">
          Delivery Success vs Cancel Ratio
        </h4>
        <div className="space-y-3">
          {(() => {
            const total = filteredOrders.length || 1;
            const success =
              (filteredOrders.filter((o) => o.status === "Completed").length /
                total) *
              100;
            const pending =
              (filteredOrders.filter((o) => o.status === "Pending").length /
                total) *
              100;
            const cancelled =
              (filteredOrders.filter((o) => o.status === "Cancelled").length /
                total) *
              100;

            return (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Success</span>
                    <span className="text-gray-500 font-medium">
                      {success.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${success}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Pending</span>
                    <span className="text-gray-500 font-medium">
                      {pending.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-4 rounded-full"
                      style={{ width: `${pending}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Cancelled</span>
                    <span className="text-gray-500 font-medium">
                      {cancelled.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-red-500 h-4 rounded-full"
                      style={{ width: `${cancelled}%` }}
                    ></div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
