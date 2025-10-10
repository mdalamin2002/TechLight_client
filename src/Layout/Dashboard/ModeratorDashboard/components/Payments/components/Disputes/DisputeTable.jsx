import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";

const statusColors = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  resolved: "text-green-600 bg-green-50 border-green-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
};

const DisputeTable = ({
  filteredDisputes,
  selectedIds,
  toggleSelect,
  selectAll,
  openMenu,
  setOpenMenu,
  updateStatus,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200 mb-8">
      <table className="min-w-full text-sm md:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 border-b text-center">
              <input
                type="checkbox"
                onChange={selectAll}
                checked={
                  selectedIds.length === filteredDisputes.length &&
                  filteredDisputes.length > 0
                }
              />
            </th>
            {[
              "Dispute ID",
              "Transaction ID",
              "User",
              "Issue",
              "Status",
              "Reported On",
              "Actions",
            ].map((head) => (
              <th
                key={head}
                className="px-4 py-3 text-left font-semibold text-gray-700 border-b"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredDisputes.length ? (
            filteredDisputes.map((d, index) => (
              <tr key={d.id} className="hover:bg-blue-50 transition relative">
                <td className="px-4 py-3 border-b text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(d.id)}
                    onChange={() => toggleSelect(d.id)}
                  />
                </td>
                <td className="px-4 py-3 border-b">{d.id}</td>
                <td className="px-4 py-3 border-b">{d.transactionId}</td>
                <td className="px-4 py-3 border-b">{d.user.name}</td>
                <td className="px-4 py-3 border-b">{d.issue}</td>
                <td className="px-4 py-3 border-b font-medium">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${statusColors[d.status]}`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b">{d.reportedOn}</td>
                <td className="px-4 py-3 border-b relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === index ? null : index)
                    }
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
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
                              onClick={() =>
                                updateStatus([d.id], "resolved")
                              }
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 flex items-center gap-2"
                            >
                              <CheckCircle size={15} /> Resolve
                            </button>
                            <button
                              onClick={() =>
                                updateStatus([d.id], "rejected")
                              }
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
            ))
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
  );
};

export default DisputeTable;
