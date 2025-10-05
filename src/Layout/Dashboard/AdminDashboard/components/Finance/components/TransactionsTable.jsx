import { Download } from "lucide-react";
import React from "react";
import { CSVLink } from "react-csv";

const TransactionsTable = () => {
  const transactions = [
    { id: "TXN-001", user: "John Doe", amount: "$1049", method: "Credit Card", date: "2024-01-15" },
    { id: "TXN-002", user: "Jane Smith", amount: "$129", method: "PayPal", date: "2024-01-16" },
    { id: "TXN-003", user: "Tech Store Pro", amount: "$500", method: "Bank Transfer", date: "2024-01-17" },
    { id: "TXN-001", user: "John Doe", amount: "$1049", method: "Credit Card", date: "2024-01-15" },
    { id: "TXN-002", user: "Jane Smith", amount: "$129", method: "PayPal", date: "2024-01-16" },
    { id: "TXN-003", user: "Tech Store Pro", amount: "$500", method: "Bank Transfer", date: "2024-01-17" },
    { id: "TXN-001", user: "John Doe", amount: "$1049", method: "Credit Card", date: "2024-01-15" },
    { id: "TXN-002", user: "Jane Smith", amount: "$129", method: "PayPal", date: "2024-01-16" },
    { id: "TXN-003", user: "Tech Store Pro", amount: "$500", method: "Bank Transfer", date: "2024-01-17" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-lg rounded-2xl">
      <div className="flex md:flex-row justify-end mb-4">
        <CSVLink
          data={transactions}
          filename={"orders-report.csv"}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <Download size={16} /> Export
        </CSVLink>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-left">Transaction ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">User</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">Amount</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">Payment Method</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"} hover:bg-indigo-100/70 transition-colors`}>
                <td className="px-4 py-3 text-purple-500 font-medium">{txn.id}</td>
                <td className="px-4 py-3 font-medium">{txn.user}</td>
                <td className="px-4 py-3 font-medium">{txn.amount}</td>
                <td className="px-4 py-3 ">{txn.method}</td>
                <td className="px-4 py-3 ">{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
