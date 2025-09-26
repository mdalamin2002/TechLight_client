import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CSVLink } from "react-csv";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const moderatorActivityData = [
  { name: "ModAlice", complaintId: "CPL001", action: "Resolved spam complaint", date: "2025-09-20", status: "Resolved", details: "Marked spam post and warned user" },
  { name: "ModBob", complaintId: "CPL002", action: "Investigating abuse report", date: "2025-09-22", status: "In Progress", details: "Checking reports submitted by multiple users" },
  { name: "ModCharlie", complaintId: "CPL003", action: "Resolved harassment report", date: "2025-09-23", status: "Resolved", details: "User banned and warning sent" },
  { name: "ModAlice", complaintId: "CPL004", action: "Pending review", date: "2025-09-24", status: "Pending", details: "Waiting for more evidence from reporters" },
  { name: "ModBob", complaintId: "CPL005", action: "Reviewed phishing report", date: "2025-09-25", status: "Resolved", details: "Phishing link blocked and reported" },
];

export const ModeratorReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState(null);

  const itemsPerPage = 3;

  // Filtered Data
  const filteredData = moderatorActivityData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status Summary
  const summary = { Resolved: 0, "In Progress": 0, Pending: 0 };
  filteredData.forEach((item) => (summary[item.status] = (summary[item.status] || 0) + 1));

  // Bar Chart Data
  const chartData = {
    labels: Object.keys(summary),
    datasets: [
      {
        label: "Cases",
        data: Object.values(summary),
        backgroundColor: ["#34D399", "#FBBF24", "#F87171"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Moderator Activity & Complaints</h3>

      {/* Search + Filter + Export */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search moderator or complaint..."
            className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Resolved">Resolved</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
          <CSVLink
            data={filteredData}
            filename={"moderator-report.csv"}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-green-700 font-medium">Resolved</p>
          <p className="text-2xl font-bold text-green-800">{summary["Resolved"]}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-yellow-700 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-yellow-800">{summary["In Progress"]}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-700 font-medium">Pending</p>
          <p className="text-2xl font-bold text-red-800">{summary["Pending"]}</p>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-gray-600 font-medium">Moderator</th>
              <th className="p-4 text-gray-600 font-medium">Complaint ID</th>
              <th className="p-4 text-gray-600 font-medium">Action</th>
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
                  <td className="p-4 text-gray-800 font-medium">{item.name}</td>
                  <td className="p-4 text-gray-700">{item.complaintId}</td>
                  <td className="p-4 text-gray-700">{item.action}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "In Progress"
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


      {/* Bar Chart */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-gray-700 font-semibold mb-2">Cases Distribution by Status</h4>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>



     
      {/* Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setSelectedCase(null)}
            >
              ✕
            </button>
            <h4 className="text-lg font-semibold mb-2">Complaint Details</h4>
            <p><span className="font-medium">Moderator:</span> {selectedCase.name}</p>
            <p><span className="font-medium">Complaint ID:</span> {selectedCase.complaintId}</p>
            <p><span className="font-medium">Action:</span> {selectedCase.action}</p>
            <p><span className="font-medium">Status:</span> {selectedCase.status}</p>
            <p><span className="font-medium">Date:</span> {selectedCase.date}</p>
            <p className="mt-2"><span className="font-medium">Details:</span> {selectedCase.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};
