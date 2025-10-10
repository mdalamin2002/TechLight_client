import React from "react";

const ActivityItem = ({ title, description, time }) => {
  return (
    <div className="flex justify-between items-start p-3 border-b border-gray-200">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  );
};

export default ActivityItem;
