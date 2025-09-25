import React from "react";

const fraudCases = [
  { id: "FRD001", type: "Payment Fraud", user: "Alice", status: "Investigating" },
  { id: "FRD002", type: "Account Takeover", user: "Bob", status: "Resolved" },
];

export const FraudReport = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Fraud Detection</h3>
    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="text-left p-4 text-gray-600">Case ID</th>
          <th className="text-left p-4 text-gray-600">Type</th>
          <th className="text-left p-4 text-gray-600">User</th>
          <th className="text-left p-4 text-gray-600">Status</th>
        </tr>
      </thead>
      <tbody>
        {fraudCases.map((c) => (
          <tr
            key={c.id}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <td className="p-4 text-gray-800">{c.id}</td>
            <td className="p-4 text-gray-600">{c.type}</td>
            <td className="p-4 text-gray-600">{c.user}</td>
            <td className="p-4 font-semibold text-indigo-600">{c.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
