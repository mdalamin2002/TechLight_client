import React from "react";

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-gray-100 rounded-xl p-4 shadow-md flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
      <p
        className={`text-sm mt-1 ${
          change.includes("-") ? "text-red-500" : "text-green-600"
        }`}
      >
        {change}
      </p>
    </div>
    <div className={`p-3 rounded-lg text-white ${color}`}>
      <Icon size={22} />
    </div>
  </div>
);

export default StatCard;
