import React from "react";

const ActivityItem = ({ text, time }) => (
  <li className="flex justify-between py-2 border-b border-gray-200 last:border-0">
    <span>{text}</span>
    <span className="text-xs text-gray-500">{time}</span>
  </li>
);

export default ActivityItem;
