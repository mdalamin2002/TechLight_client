import React, { useState } from "react";
import { Eye, Clock, CheckCircle, XCircle, Download } from "lucide-react";
import { CSVLink } from "react-csv";

const samplePayments = [
  { id: "TRX001", user: "John Doe", method: "bKash", amount: 1200, status: "pending", date: "2025-10-10" },
  { id: "TRX002", user: "Jane Smith", method: "Nagad", amount: 2500, status: "success", date: "2025-10-09" },
  { id: "TRX003", user: "Alice Brown", method: "Card", amount: 1800, status: "failed", date: "2025-10-08" },
  { id: "TRX004", user: "Bob Martin", method: "bKash", amount: 3000, status: "refunded", date: "2025-10-07" },
  { id: "TRX005", user: "Mark Lee", method: "bKash", amount: 2200, status: "pending", date: "2025-10-06" },
  { id: "TRX006", user: "Lucy Gray", method: "Card", amount: 1700, status: "success", date: "2025-10-05" },
];

const statusColors = {
  pending: "#FBBF24",
  success: "#22C55E",
  failed: "#EF4444",
  refunded: "#EF4444",
};

const statusIcons = {
  pending: Clock,
  success: CheckCircle,
  failed: XCircle,
  refunded: XCircle,
};

const Transactions = () => {
  const [filter, setFilter] = useState("all");

  const filteredPayments =
    filter === "all"
      ? samplePayments
      : samplePayments.filter((p) => p.status === filter);

  const statusCounts = samplePayments.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    { pending: 0, success: 0, failed: 0, refunded: 0 }
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Transactions</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.keys(statusCounts).map((status) => {
          const Icon = statusIcons[status];
          return (
            <div
              key={status}
              className="flex items-center justify-between p-4 rounded-xl bg-white cursor-pointer hover:bg-gray-50 transition"
              onClick={() => setFilter(status)}
            >
              <div>
                <p className="text-gray-500 text-sm sm:text-base">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                <p className="text-xl sm:text-2xl font-bold">{statusCounts[status]}</p>
              </div>
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: statusColors[status] }}
              >
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter & Export */}
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 mb-4">
        <select
          className="border border-gray-300 rounded-lg p-2 sm:p-3 w-full sm:w-64 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <CSVLink
          data={samplePayments}
          filename={"transactions-report.csv"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm sm:text-sm"
        >
          <Download size={16} /> Export
        </CSVLink>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm sm:text-base border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Transaction ID", "User", "Method", "Amount", "Status", "Date", "Actions"].map((head) => (
                <th key={head} className="px-4 sm:px-6 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 sm:px-6 py-2 whitespace-nowrap border-b border-gray-200">{p.id}</td>
                <td className="px-4 sm:px-6 py-2 whitespace-nowrap border-b border-gray-200">{p.user}</td>
                <td className="px-4 sm:px-6 py-2 whitespace-nowrap border-b border-gray-200">{p.method}</td>
                <td className="px-4 sm:px-6 py-2 whitespace-nowrap border-b border-gray-200">{p.amount} BDT</td>
                <td className={`px-4 sm:px-6 py-2 whitespace-nowrap font-semibold border-b border-gray-200 ${
                  p.status === "pending" ? "text-yellow-500" :
                  p.status === "success" ? "text-green-500" :
                  "text-red-500"
                }`}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </td>
                <td className="px-4 sm:px-6 py-2 whitespace-nowrap border-b border-gray-200">{p.date}</td>
                <td className="px-4 sm:px-6 py-2 whitespace-nowrap text-center border-b border-gray-200">
                  <button className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition">
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
