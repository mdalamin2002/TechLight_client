import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Sample Fraud Cases Data
const fraudCasesData = [
  { id: "FRD001", type: "Payment Fraud", user: "Alice", status: "Investigating", date: "2025-09-20", details: "Suspicious payment detected from account ending 1234" },
  { id: "FRD002", type: "Account Takeover", user: "Bob", status: "Resolved", date: "2025-09-21", details: "User account recovered and secured" },
  { id: "FRD003", type: "Phishing", user: "Charlie", status: "Resolved", date: "2025-09-22", details: "Phishing attempt blocked and reported" },
  { id: "FRD004", type: "Payment Fraud", user: "David", status: "Pending", date: "2025-09-23", details: "Under investigation for suspicious transaction" },
  { id: "FRD005", type: "Spam", user: "Eve", status: "Investigating", date: "2025-09-24", details: "Spam messages detected on multiple posts" },
  { id: "FRD006", type: "Account Takeover", user: "Frank", status: "Resolved", date: "2025-09-25", details: "Account takeover prevented" },
  { id: "FRD007", type: "Phishing", user: "Grace", status: "Pending", date: "2025-09-25", details: "Under review for phishing report" },
];

export const FraudReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState(null);

  const itemsPerPage = 5;

  // Filtered Data
  const filteredData = fraudCasesData.filter((item) => {
    const matchesSearch =
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Chart Data
  const statusCounts = { Resolved: 0, Investigating: 0, Pending: 0 };
  filteredData.forEach((item) => {
    statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Cases",
        data: Object.values(statusCounts),
        backgroundColor: ["#34D399", "#FBBF24", "#F87171"],
      },
    ],
  };

  // Summary Metrics
  const totalCases = filteredData.length;
  const resolvedPercent = ((statusCounts["Resolved"] / totalCases) * 100 || 0).toFixed(1);
  const investigatingPercent = ((statusCounts["Investigating"] / totalCases) * 100 || 0).toFixed(1);
  const pendingPercent = ((statusCounts["Pending"] / totalCases) * 100 || 0).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Fraud & Suspicious Users Report</h3>

      {/* Search + Filter + Export */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by user, case ID, or type..."
          className="w-full md:w-1/2 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <select
            className="p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Resolved">Resolved</option>
            <option value="Investigating">Investigating</option>
            <option value="Pending">Pending</option>
          </select>
          <CSVLink
            data={filteredData}
            filename="fraud-report.csv"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500 font-medium">Total Cases</p>
          <p className="text-2xl font-bold text-gray-800">{totalCases}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-green-700 font-medium">Resolved %</p>
          <p className="text-2xl font-bold text-green-800">{resolvedPercent}%</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-yellow-700 font-medium">Investigating %</p>
          <p className="text-2xl font-bold text-yellow-800">{investigatingPercent}%</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-700 font-medium">Pending %</p>
          <p className="text-2xl font-bold text-red-800">{pendingPercent}%</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-gray-600 font-medium">Case ID</th>
              <th className="p-4 text-gray-600 font-medium">User</th>
              <th className="p-4 text-gray-600 font-medium">Type</th>
              <th className="p-4 text-gray-600 font-medium">Status</th>
              <th className="p-4 text-gray-600 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCase(item)}
                >
                  <td className="p-4 text-gray-800 font-medium">{item.id}</td>
                  <td className="p-4 text-gray-700">{item.user}</td>
                  <td className="p-4 text-gray-700">{item.type}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Investigating"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{item.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100"
        >
          Prev
        </button>
        <span className="text-gray-700">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h4 className="text-gray-700 font-semibold mb-2">Cases Distribution by Status</h4>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>

      {/* Modal for Case Details */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setSelectedCase(null)}
            >
              ✕
            </button>
            <h4 className="text-lg font-semibold mb-2">Case Details</h4>
            <p><span className="font-medium">Case ID:</span> {selectedCase.id}</p>
            <p><span className="font-medium">User:</span> {selectedCase.user}</p>
            <p><span className="font-medium">Type:</span> {selectedCase.type}</p>
            <p><span className="font-medium">Status:</span> {selectedCase.status}</p>
            <p><span className="font-medium">Date:</span> {selectedCase.date}</p>
            <p className="mt-2"><span className="font-medium">Details:</span> {selectedCase.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};
