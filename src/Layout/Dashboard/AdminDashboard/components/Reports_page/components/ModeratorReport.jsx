import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CSVLink } from "react-csv";

const moderatorActivityData = [
  { name: "ModAlice", complaintId: "CPL001", action: "Resolved spam complaint", date: "2025-09-20", status: "Resolved" },
  { name: "ModBob", complaintId: "CPL002", action: "Investigating abuse report", date: "2025-09-22", status: "In Progress" },
  { name: "ModCharlie", complaintId: "CPL003", action: "Resolved harassment report", date: "2025-09-23", status: "Resolved" },
  { name: "ModAlice", complaintId: "CPL004", action: "Pending review", date: "2025-09-24", status: "Pending" },
  { name: "ModBob", complaintId: "CPL005", action: "Reviewed phishing report", date: "2025-09-25", status: "Resolved" },
];

export const ModeratorReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = moderatorActivityData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Moderator Activity & Complaints Handled
      </h3>

      {/* Search + Filter + Export */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="p-4 text-gray-800 font-medium">{item.name}</td>
                  <td className="p-4 text-gray-700">{item.complaintId}</td>
                  <td className="p-4 text-gray-700">{item.action}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "Resolved"
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
    </div>
  );
};
