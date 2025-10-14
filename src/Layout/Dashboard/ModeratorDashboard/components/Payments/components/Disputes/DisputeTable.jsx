import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, CheckCircle, XCircle, Settings } from "lucide-react";

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
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full border-collapse text-sm md:text-base">
        {/* Table Header */}
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-4 py-3 text-center text-sm font-semibold border-b border-indigo-500">
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
                className="px-4 py-3 text-left text-sm font-semibold border-b border-indigo-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {filteredDisputes.length ? (
            filteredDisputes.map((d, i) => (
              <tr
                key={d.id}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                } hover:bg-indigo-100/70 transition-colors`}
              >
                <td className="px-4 py-3 text-center border-b">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(d.id)}
                    onChange={() => toggleSelect(d.id)}
                  />
                </td>
                <td className="px-4 py-3 border-b text-indigo-600 font-medium">
                  {d.id}
                </td>
                <td className="px-4 py-3 border-b text-indigo-500 font-medium">
                  {d.transactionId}
                </td>
                <td className="px-4 py-3 border-b">{d.user.name}</td>
                <td className="px-4 py-3 border-b">{d.issue}</td>
                <td className="px-4 py-3 border-b">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${statusColors[d.status]}`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b">{d.reportedOn}</td>

                {/* Actions */}
                <td className="px-4 py-3 border-b text-center relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === i ? null : i)
                    }
                    className="text-gray-600 hover:text-indigo-600 transition"
                  >
                    <Settings size={18} />
                  </button>

                  <AnimatePresence>
                    {openMenu === i && (
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
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="text-center py-6 text-gray-500 bg-white"
              >
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
