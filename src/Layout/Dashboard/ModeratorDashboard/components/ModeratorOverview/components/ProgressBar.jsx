import React from "react";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full bg-gray-300 rounded-full h-3">
      <div
        className="bg-purple-600 h-3 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
