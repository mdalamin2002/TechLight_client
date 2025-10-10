import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import { Download, RefreshCcw, AlertTriangle } from "lucide-react";
import DisputeStats from "./DisputeStats";
import DisputeTable from "./DisputeTable";
import DisputeChart from "./DisputeChart";

const sampleDisputes = [
  { id: "DIS001", transactionId: "TRX003", user: { name: "Alice" }, issue: "Payment issue", status: "pending", reportedOn: "2025-10-10" },
  { id: "DIS002", transactionId: "TRX002", user: { name: "John" }, issue: "Wrong amount", status: "resolved", reportedOn: "2025-10-09" },
  { id: "DIS003", transactionId: "TRX004", user: { name: "Bob" }, issue: "Refund delay", status: "rejected", reportedOn: "2025-10-08" },
];

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
    if (selectedIds.length === filteredDisputes.length) setSelectedIds([]);
    else setSelectedIds(filteredDisputes.map((d) => d.id));
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

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

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

      <DisputeStats statusCounts={statusCounts} setFilter={setFilter} />

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

      <DisputeTable
        filteredDisputes={filteredDisputes}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        selectAll={selectAll}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        updateStatus={updateStatus}
      />

      <DisputeChart pieData={pieData} />
    </div>
  );
};

export default Disputes;
