import React from "react";

const ordersData = [
  { id: "ORD001", customer: "Alice", amount: "$500", status: "Completed" },
  { id: "ORD002", customer: "Bob", amount: "$320", status: "Pending" },
  { id: "ORD003", customer: "Charlie", amount: "$780", status: "Completed" },
];

export const OrdersReport = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Report</h3>
    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="text-left p-4 text-gray-600">Order ID</th>
          <th className="text-left p-4 text-gray-600">Customer</th>
          <th className="text-left p-4 text-gray-600">Amount</th>
          <th className="text-left p-4 text-gray-600">Status</th>
        </tr>
      </thead>
      <tbody>
        {ordersData.map((order) => (
          <tr
            key={order.id}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <td className="p-4 text-gray-800">{order.id}</td>
            <td className="p-4 text-gray-600">{order.customer}</td>
            <td className="p-4 text-gray-600">{order.amount}</td>
            <td className="p-4 font-semibold text-indigo-600">{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
