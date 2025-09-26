import React from "react";

const ordersData = [
  { id: "ORD001", customer: "Alice", amount: "$500", status: "Completed" },
  { id: "ORD002", customer: "Bob", amount: "$320", status: "Pending" },
  { id: "ORD003", customer: "Charlie", amount: "$780", status: "Completed" },
  { id: "ORD004", customer: "David", amount: "$1200", status: "Cancelled" },
];

export const OrdersReport = () => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Report</h3>

    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 text-gray-600 font-medium">Order ID</th>
            <th className="p-4 text-gray-600 font-medium">Customer</th>
            <th className="p-4 text-gray-600 font-medium">Amount</th>
            <th className="p-4 text-gray-600 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ordersData.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="p-4 text-gray-800 font-medium">{order.id}</td>
              <td className="p-4 text-gray-700">{order.customer}</td>
              <td className="p-4 text-gray-700">{order.amount}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Delivery Success vs Cancel Ratio */}
    <div className="mt-6">
      <h4 className="text-gray-700 font-semibold mb-3">
        Delivery Success vs Cancel Ratio
      </h4>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-700">Success</span>
            <span className="text-gray-500 font-medium">85%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: "85%" }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-700">Cancelled</span>
            <span className="text-gray-500 font-medium">15%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-red-500 h-4 rounded-full transition-all duration-500"
              style={{ width: "15%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
