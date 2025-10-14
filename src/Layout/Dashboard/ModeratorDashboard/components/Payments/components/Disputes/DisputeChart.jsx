import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const chartColors = {
  pending: "#facc15",
  resolved: "#4ade80",
  rejected: "#f87171",
};

const DisputeChart = ({ pieData }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-gray-700 font-semibold mb-4 text-center">
      Dispute Summary (Pie Chart)
    </h2>
    <div className="w-full h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[entry.name.toLowerCase()] || "#8884d8"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DisputeChart;
