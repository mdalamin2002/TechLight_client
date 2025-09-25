import React from "react";

const ProgressBar = ({ label, value, percent, color }) => (
  <div>
    <div className="flex justify-between mb-1 text-sm">
      <span className="text-gray-700 ">{label}</span>
      <span className="text-gray-500 ">{value}</span>
    </div>
    <div className="w-full bg-gray-200 mt-2 rounded-full ">
      <div className={`h-2 mt-2 ${color}`}  style={{ width: percent }}>
        <span className="text-[12px] ">{percent}</span>
      </div>
    </div>
  </div>
);

export default ProgressBar;
