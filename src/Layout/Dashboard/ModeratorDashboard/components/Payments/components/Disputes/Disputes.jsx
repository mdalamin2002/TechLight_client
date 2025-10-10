import React, { useState, useMemo } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Download,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { CSVLink } from "react-csv";
import { motion, AnimatePresence } from "framer-motion";

const sampleDisputes = [
  {
    id: "DIS001",
    transactionId: "TRX003",
    user: { name: "Alice Brown", email: "alice@example.com" },
    issue: "Payment deducted but order not confirmed",
    status: "pending",
    reportedOn: "2025-10-10",
  },
  {
    id: "DIS002",
    transactionId: "TRX002",
    user: { name: "John Doe", email: "john@example.com" },
    issue: "Wrong amount charged",
    status: "resolved",
    reportedOn: "2025-10-09",
  },
  {
    id: "DIS003",
    transactionId: "TRX004",
    user: { name: "Bob Martin", email: "bob@example.com" },
    issue: "Refund not processed",
    status: "pending",
    reportedOn: "2025-10-08",
  },
];

const statusColors = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  resolved: "text-green-600 bg-green-50 border-green-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
};

const statusIcons = {
  pending: Clock,
  resolved: CheckCircle,
  rejected: XCircle,
};

const Disputes = () => {
  const [filter, setFilter] = useState("all");
  const [disputes, setDisputes] = useState(sampleDisputes);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredDisputes = useMemo(
    () => (filter === "all" ? disputes : disputes.filter((d) => d.status === filter)),
    [filter, disputes]
  );

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const selectAll = () => {
    if (selectedIds.length === filteredDisputes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDisputes.map((d) => d.id));
    }
  };

  const updateStatus = (ids, newStatus) => {
    setDisputes((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, status: newStatus } : d))
    );
    setSelectedIds([]);
    setOpenMenu(null);
  };

  const statusCounts = useMemo(() => {
    return disputes.reduce(
      (acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      },
      { pending: 0, resolved: 0, rejected: 0 }
    );
  }, [disputes]);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="text-blue-600" size={28} />
          Dispute Management
        </h1>
        <div className="flex gap-2">
          <CSVLink
            data={disputes}
            filename={"disputes-report.csv"}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Download size={18} /> Export
          </CSVLink>
          <button
            onClick={() => setFilter("all")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <RefreshCcw size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => {
          const Icon = statusIcons[status];
          const bgGradient =
            status === "pending"
              ? "from-yellow-50 to-yellow-100"
              : status === "resolved"
              ? "from-green-50 to-green-100"
              : "from-red-50 to-red-100";
          return (
            <motion.div
              key={status}
              whileHover={{ scale: 1.03 }}
              className={`bg-gradient-to-br ${bgGradient} border border-gray-200 p-5 rounded-xl flex justify-between items-center shadow-sm cursor-pointer`}
              onClick={() => setFilter(status)}
            >
              <div>
                <p className="text-gray-600 text-sm">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                <h2 className="text-2xl font-bold text-gray-800">{count}</h2>
              </div>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full border ${statusColors[status]}`}
              >
                <Icon size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => updateStatus(selectedIds, "resolved")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Mark as Resolved
          </button>
          <button
            onClick={() => updateStatus(selectedIds, "rejected")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
          >
            Reject Selected
          </button>
        </div>
      )}

      {/* Disputes Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b text-center">
                <input
                  type="checkbox"
                  onChange={selectAll}
                  checked={selectedIds.length === filteredDisputes.length && filteredDisputes.length > 0}
                />
              </th>
              {["Dispute ID", "Transaction ID", "User", "Issue", "Status", "Reported On", "Actions"].map((head) => (
                <th key={head} className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.length ? (
              filteredDisputes.map((d, index) => {
                const Icon = statusIcons[d.status];
                return (
                  <tr key={d.id} className="hover:bg-blue-50 transition relative group">
                    <td className="px-4 py-3 border-b text-center">
                      <input type="checkbox" checked={selectedIds.includes(d.id)} onChange={() => toggleSelect(d.id)} />
                    </td>
                    <td className="px-4 py-3 border-b">{d.id}</td>
                    <td className="px-4 py-3 border-b">{d.transactionId}</td>
                    <td className="px-4 py-3 border-b">{d.user.name}</td>
                    <td className="px-4 py-3 border-b">{d.issue}</td>
                    <td className="px-4 py-3 border-b font-medium">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${statusColors[d.status]}`}>
                        <Icon size={14} /> {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">{d.reportedOn}</td>
                    <td className="px-4 py-3 border-b relative">
                      <button onClick={() => setOpenMenu(openMenu === index ? null : index)} className="text-gray-600 hover:text-blue-600 transition">
                        <Settings size={18} />
                      </button>
                      <AnimatePresence>
                        {openMenu === index && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-4 top-10 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-20"
                          >
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                              <Eye size={15} /> View Details
                            </button>
                            {d.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateStatus([d.id], "resolved")}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 flex items-center gap-2"
                                >
                                  <CheckCircle size={15} /> Resolve
                                </button>
                                <button
                                  onClick={() => updateStatus([d.id], "rejected")}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                >
                                  <XCircle size={15} /> Reject
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No disputes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Disputes;
