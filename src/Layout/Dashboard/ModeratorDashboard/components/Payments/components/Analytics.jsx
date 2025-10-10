import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];

// Revenue data for different periods
const revenueData = {
  "7d": [
    { day: "Mon", revenue: 2000 },
    { day: "Tue", revenue: 2500 },
    { day: "Wed", revenue: 1800 },
    { day: "Thu", revenue: 2200 },
    { day: "Fri", revenue: 2400 },
    { day: "Sat", revenue: 2100 },
    { day: "Sun", revenue: 2300 },
  ],
  "30d": Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    revenue: Math.floor(Math.random() * 3000) + 1000,
  })),
  "1y": [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 9000 },
    { month: "Apr", revenue: 18000 },
    { month: "May", revenue: 20000 },
    { month: "Jun", revenue: 17000 },
    { month: "Jul", revenue: 21000 },
    { month: "Aug", revenue: 19000 },
    { month: "Sep", revenue: 22000 },
    { month: "Oct", revenue: 20000 },
    { month: "Nov", revenue: 23000 },
    { month: "Dec", revenue: 25000 },
  ],
};

// Payment status data for different periods
const statusData = {
  "7d": [
    { name: "Success", value: 50 },
    { name: "Pending", value: 10 },
    { name: "Failed", value: 5 },
    { name: "Refunded", value: 2 },
  ],
  "30d": [
    { name: "Success", value: 180 },
    { name: "Pending", value: 30 },
    { name: "Failed", value: 20 },
    { name: "Refunded", value: 10 },
  ],
  "1y": [
    { name: "Success", value: 240 },
    { name: "Pending", value: 30 },
    { name: "Failed", value: 20 },
    { name: "Refunded", value: 10 },
  ],
};

const Analytics = () => {
  const [period, setPeriod] = useState("7d");

  const currentRevenue = revenueData[period];
  const currentStatus = statusData[period];
  const totalRevenue = currentRevenue.reduce((acc, item) => acc + item.revenue, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Payments Analytics</h1>

      {/* Period Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Period:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="1y">Last 1 Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {currentStatus.map((status, idx) => {
          const borderColor =
            status.name === "Success"
              ? "border-green-500"
              : status.name === "Pending"
              ? "border-yellow-400"
              : status.name === "Failed"
              ? "border-red-500"
              : "border-blue-500";
          const textColor =
            status.name === "Success"
              ? "text-green-600"
              : status.name === "Pending"
              ? "text-yellow-600"
              : status.name === "Failed"
              ? "text-red-600"
              : "text-blue-600";
          return (
            <div
              key={status.name}
              className={`bg-white shadow rounded-lg p-5 border-l-4 ${borderColor} hover:shadow-lg transition`}
            >
              <h3 className="text-sm font-medium text-gray-500">{status.name}</h3>
              <p className={`mt-2 text-xl font-bold ${textColor}`}>{status.value}</p>
            </div>
          );
        })}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-green-500 hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-xl font-bold text-gray-800">
            ৳ {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-5 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold mb-4">
          Revenue Chart ({period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : "1 Year"})
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentRevenue}>
            <XAxis dataKey={period === "1y" ? "month" : "day"} />
            <YAxis />
            <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Status Pie Chart */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Payment Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={currentStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {currentStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
