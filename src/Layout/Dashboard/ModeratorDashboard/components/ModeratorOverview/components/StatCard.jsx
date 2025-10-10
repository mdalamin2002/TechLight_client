import React from "react";

const StatCard = ({ title, count, icon, bgColor }) => {
  return (
    <div className={`flex items-center p-4 rounded-xl shadow ${bgColor} text-white`}>
      <div className="p-3 bg-white/20 rounded-full mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
};

export default StatCard;
