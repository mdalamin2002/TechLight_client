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

const statusStyles = {
  pending: "text-yellow-600 ",
  success: "text-green-600 ",
  failed: "text-red-500 ",
  refunded: "text-blue-600 ",
};

const statusIcons = {
  pending: Clock,
  success: CheckCircle,
  failed: XCircle,
  refunded: CheckCircle,
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
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Transaction Overview</h1>
        <CSVLink
          data={samplePayments}
          filename={"transactions-report.csv"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Download size={18} /> Export CSV
        </CSVLink>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.keys(statusCounts).map((status) => {
          const Icon = statusIcons[status];
          const isActive = filter === status;
          return (
            <div
              key={status}
              onClick={() => setFilter(status)}
              className={`p-4 rounded-xl bg-white flex justify-between items-center cursor-pointer transition border ${isActive ? "border-blue-500 shadow-md" : "hover:shadow-sm border-gray-200"
                }`}
            >
              <div>
                <p className="text-gray-500 text-sm capitalize">{status}</p>
                <p className="text-xl font-semibold">{statusCounts[status]}</p>
              </div>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${status === "pending"
                    ? "bg-yellow-400"
                    : status === "success"
                      ? "bg-green-500"
                      : status === "failed"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
              >
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <select
            className="border border-gray-300 rounded-lg p-2 w-44 text-gray-700 focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          {/* ===== Table Head ===== */}
          <thead className="bg-indigo-600 text-white">
            <tr>
              {["Transaction ID", "User", "Method", "Amount", "Status", "Date", "Actions"].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-sm font-semibold text-left"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          {/* ===== Table Body ===== */}
          <tbody>
            {filteredPayments.length ? (
              filteredPayments.map((p, i) => {
                const Icon = statusIcons[p.status];
                return (
                  <tr
                    key={p.id}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                      } hover:bg-indigo-100/70 text-left transition-colors`}
                  >
                    <td className="px-4 py-3 text-purple-500 font-medium">{p.id}</td>
                    <td className="px-4 py-3 font-medium ">{p.user}</td>
                    <td className="px-4 py-3 font-medium ">{p.method}</td>
                    <td className="px-4 py-3 font-medium ">{p.amount} BDT</td>

                    {/* Status badge */}
                    <td className="px-4 py-3 ">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${statusStyles[p.status]}`}
                      >
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-4 py-3 ">{p.date}</td>

                    {/* Actions */}
                    <td className="px-4 py-3 ">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
                        <Eye size={15} /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 text-sm font-medium"
                >
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
