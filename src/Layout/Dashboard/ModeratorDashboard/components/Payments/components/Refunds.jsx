import { Eye, Clock, CheckCircle, XCircle, Download, Settings } from "lucide-react";
import React, { useState } from "react";
import { CSVLink } from "react-csv";

const sampleRefunds = [
  { id: "REF001", transactionId: "TRX001", user: { name: "John Doe", email: "john@example.com" }, amount: 1200, status: "pending", requestedOn: "2025-10-10" },
  { id: "REF002", transactionId: "TRX002", user: { name: "Jane Smith", email: "jane@example.com" }, amount: 2500, status: "approved", requestedOn: "2025-10-09" },
  { id: "REF003", transactionId: "TRX003", user: { name: "Alice Brown", email: "alice@example.com" }, amount: 1800, status: "rejected", requestedOn: "2025-10-08" },
  { id: "REF004", transactionId: "TRX004", user: { name: "Bob Martin", email: "bob@example.com" }, amount: 3000, status: "refunded", requestedOn: "2025-10-07" },
  { id: "REF005", transactionId: "TRX005", user: { name: "Mark Lee", email: "mark@example.com" }, amount: 2200, status: "pending", requestedOn: "2025-10-06" },
  { id: "REF006", transactionId: "TRX006", user: { name: "Lucy Gray", email: "lucy@example.com" }, amount: 1700, status: "approved", requestedOn: "2025-10-05" },
];

const statusColors = {
  pending: "text-yellow-500 bg-yellow-50",
  approved: "text-green-600 bg-green-50",
  rejected: "text-red-500 bg-red-50",
  refunded: "text-blue-600 bg-blue-50",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  refunded: CheckCircle,
};

const Refunds = () => {
  const [filter, setFilter] = useState("all");
  const [refunds, setRefunds] = useState(sampleRefunds);
  const [openMenu, setOpenMenu] = useState(null);

  const filteredRefunds =
    filter === "all" ? refunds : refunds.filter((r) => r.status === filter);

  const statusCounts = refunds.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, refunded: 0 }
  );

  const updateStatus = (id, newStatus) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setOpenMenu(null);
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Refund Management</h1>
        <CSVLink
          data={refunds}
          filename={"refunds-report.csv"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Download size={18} /> Export CSV
        </CSVLink>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.keys(statusCounts).map((status) => {
          const Icon = statusIcons[status];
          const isActive = filter === status;
          return (
            <div
              key={status}
              onClick={() => setFilter(status)}
              className={`p-4 rounded-xl bg-white flex justify-between items-center cursor-pointer transition border
                ${isActive ? "border-blue-500 shadow-md" : "hover:shadow-sm border-gray-200"}`}
            >
              <div>
                <p className="text-gray-500 text-sm capitalize">{status}</p>
                <p className="text-xl font-semibold">{statusCounts[status]}</p>
              </div>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
                  status === "pending"
                    ? "bg-yellow-400"
                    : status === "approved"
                    ? "bg-green-500"
                    : status === "rejected"
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <select
            className="border border-gray-300 rounded-lg p-2 w-44 text-gray-700 focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Refund Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full text-sm md:text-base">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["Refund ID", "Transaction ID", "User", "Amount", "Status", "Requested On", "Actions"].map((head) => (
                <th key={head} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRefunds.length ? (
              filteredRefunds.map((r, index) => {
                const Icon = statusIcons[r.status];
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition relative">
                    <td className="px-4 py-3 border-b">{r.id}</td>
                    <td className="px-4 py-3 border-b">{r.transactionId}</td>
                    <td className="px-4 py-3 border-b">{r.user.name}</td>
                    <td className="px-4 py-3 border-b">{r.amount} BDT</td>
                    <td className="px-4 py-3 border-b font-medium">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[r.status]}`}
                      >
                        <Icon size={14} /> {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">{r.requestedOn}</td>

                    {/* Actions with gear menu */}
                    <td className="px-4 py-3 border-b relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === index ? null : index)}
                        className="text-gray-600 hover:text-blue-600 transition"
                      >
                        <Settings size={18} />
                      </button>

                      {openMenu === index && (
                        <div className="absolute right-4 top-10 bg-white border border-gray-200 rounded-lg shadow-md w-36 z-20">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => alert(`Viewing refund ${r.id}`)}
                          >
                            <Eye size={15} /> View
                          </button>
                          {r.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(r.id, "approved")}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 flex items-center gap-2"
                              >
                                <CheckCircle size={15} /> Approve
                              </button>
                              <button
                                onClick={() => updateStatus(r.id, "rejected")}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                              >
                                <XCircle size={15} /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No refunds found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Refunds;
