import React from "react";

const moderatorActivity = [
  { name: "ModAlice", action: "Approved post", date: "2025-09-20" },
  { name: "ModBob", action: "Banned user", date: "2025-09-22" },
  { name: "ModCharlie", action: "Reviewed report", date: "2025-09-23" },
];

export const ModeratorReport = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Moderator Activity</h3>
    <ul className="space-y-2">
      {moderatorActivity.map((item, index) => (
        <li
          key={index}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <span className="font-medium">{item.name}</span> — {item.action}{" "}
          <span className="text-gray-500">({item.date})</span>
        </li>
      ))}
    </ul>
  </div>
);
