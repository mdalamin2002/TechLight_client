import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import * as XLSX from "xlsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsAnalytics = () => {
  // Fake data
  const fakeOrdersData = {
    labels: ["Pending", "Shipped", "Delivered"],
    datasets: [
      {
        label: "Orders",
        data: [12, 34, 78],
        backgroundColor: ["#7c3aed", "#3b82f6", "#10b981"],
      },
    ],
  };

  const fakeReturnsData = {
    labels: ["Returns"],
    datasets: [
      {
        label: "Returns",
        data: [5],
        backgroundColor: ["#f59e0b"],
      },
    ],
  };

  const fakeUserReportsData = {
    labels: ["User Reports"],
    datasets: [
      {
        label: "Reports",
        data: [7],
        backgroundColor: ["#ef4444"],
      },
    ],
  };

  const fakeProblematic = [
    { name: "Seller A", complaints: 4 },
    { name: "Product B", complaints: 3 },
    { name: "Seller C", complaints: 2 },
  ];

  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Export function
  const handleExport = (type) => {
    const wb = XLSX.utils.book_new();

    if (type === "orders") {
      const ws = XLSX.utils.json_to_sheet([
        { Status: "Pending", Count: 12 },
        { Status: "Shipped", Count: 34 },
        { Status: "Delivered", Count: 78 },
      ]);
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
    } else if (type === "problematic") {
      const ws = XLSX.utils.json_to_sheet(fakeProblematic);
      XLSX.utils.book_append_sheet(wb, ws, "Problematic");
    }

    XLSX.writeFile(wb, `${type}-report.xlsx`);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>

      {/* Date Filter */}
      <div className="flex gap-4 flex-wrap items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-black rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-black rounded p-2"
          />
        </div>
        <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
          Filter
        </button>
      </div>

      {/* Orders Chart */}
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Orders</h2>
        <Bar options={options} data={fakeOrdersData} />
        <button
          onClick={() => handleExport("orders")}
          className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
        >
          Export Orders
        </button>
      </div>

      {/* Returns & User Reports Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Returns</h2>
          <Bar options={options} data={fakeReturnsData} />
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">User Reports</h2>
          <Bar options={options} data={fakeUserReportsData} />
        </div>
      </div>

      {/* Problematic Sellers/Products */}
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Problematic Sellers / Products</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b border-gray-300 p-2">Name</th>
              <th className="border-b border-gray-300 p-2">Complaints</th>
            </tr>
          </thead>
          <tbody>
            {fakeProblematic.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border-b border-gray-200 p-2">{item.name}</td>
                <td className="border-b border-gray-200 p-2">{item.complaints}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => handleExport("problematic")}
          className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
        >
        </button>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
