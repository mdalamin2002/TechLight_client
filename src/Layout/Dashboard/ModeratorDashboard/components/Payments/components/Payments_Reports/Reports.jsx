import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Function to generate sample reports dynamically
const generateReports = (period) => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (period === "7d") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => {
      const success = random(40, 60);
      const failed = random(0, 10);
      const refunded = random(0, 5);
      const totalTransactions = success + failed + refunded;
      const revenue = random(5000, 10000);
      return { label: day, totalTransactions, success, failed, refunded, revenue };
    });
  } else if (period === "30d") {
    return Array.from({ length: 30 }, (_, i) => {
      const success = random(40, 60);
      const failed = random(0, 10);
      const refunded = random(0, 5);
      const totalTransactions = success + failed + refunded;
      const revenue = random(5000, 10000);
      return { label: `Day ${i + 1}`, totalTransactions, success, failed, refunded, revenue };
    });
  } else if (period === "1y") {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return months.map((month) => {
      const success = random(80, 150);
      const failed = random(0, 30);
      const refunded = random(0, 20);
      const totalTransactions = success + failed + refunded;
      const revenue = random(5000, 20000);
      return { label: month, totalTransactions, success, failed, refunded, revenue };
    });
  } else if (period === "3y") {
    return Array.from({ length: 36 }, (_, i) => {
      const success = random(80, 150);
      const failed = random(0, 30);
      const refunded = random(0, 20);
      const totalTransactions = success + failed + refunded;
      const revenue = random(5000, 20000);
      return { label: `Month ${i + 1}`, totalTransactions, success, failed, refunded, revenue };
    });
  }
};

const Reports = () => {
  const [period, setPeriod] = useState("7d");
  const reports = generateReports(period);

  const handleExport = () => {
    const headers = [
      "Label",
      "Total Transactions",
      "Success",
      "Failed",
      "Refunded",
      "Revenue",
      "Success Rate (%)",
      "Avg Revenue/Tx",
    ];

    const rows = reports.map(r => [
      r.label,
      r.totalTransactions,
      r.success,
      r.failed,
      r.refunded,
      r.revenue,
      ((r.success / r.totalTransactions) * 100).toFixed(2),
      (r.revenue / r.totalTransactions).toFixed(2)
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payment_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Payment Reports</h1>

      {/* Period Selector & Export */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium">Select Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Last 1 Year</option>
            <option value="3y">Last 3 Years</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Payment Overview ({period})</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={reports} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(value) => typeof value === "number" ? value.toLocaleString() : value} />
            <Legend />
            <Bar dataKey="success" stackId="a" fill="#4ade80" />
            <Bar dataKey="failed" stackId="a" fill="#f87171" />
            <Bar dataKey="refunded" stackId="a" fill="#60a5fa" />
            <Bar dataKey="revenue" stackId="b" fill="#facc15" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead className="bg-indigo-600 text-white">
            <tr>
              {[
                "Label",
                "Total Transactions",
                "Success",
                "Failed",
                "Refunded",
                "Revenue (BDT)",
                "Success Rate (%)",
                "Avg Revenue/Tx",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-center text-sm font-semibold border-b border-indigo-500"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {reports.map((r, idx) => (
              <tr
                key={idx}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                  } hover:bg-indigo-100/70 text-center transition-colors`}
              >
                <td className="px-4 py-3 font-medium">{r.label}</td>
                <td className="px-4 py-3">{r.totalTransactions}</td>
                <td className="px-4 py-3 text-green-600 font-medium">{r.success}</td>
                <td className="px-4 py-3 text-red-600 font-medium">{r.failed}</td>
                <td className="px-4 py-3 text-blue-600 font-medium">{r.refunded}</td>
                <td className="px-4 py-3">{r.revenue.toLocaleString()}</td>
                <td className="px-4 py-3">{((r.success / r.totalTransactions) * 100).toFixed(2)}</td>
                <td className="px-4 py-3">{(r.revenue / r.totalTransactions).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Reports;
