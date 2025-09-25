import React from "react";

const usersData = [
  { name: "Alice", email: "alice@example.com", joined: "Jan 2024" },
  { name: "Bob", email: "bob@example.com", joined: "Feb 2024" },
  { name: "Charlie", email: "charlie@example.com", joined: "Mar 2024" },
];

export const UsersReport = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">User Report</h3>
    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="text-left p-4 text-gray-600">Name</th>
          <th className="text-left p-4 text-gray-600">Email</th>
          <th className="text-left p-4 text-gray-600">Joined</th>
        </tr>
      </thead>
      <tbody>
        {usersData.map((user) => (
          <tr
            key={user.email}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <td className="p-4 text-gray-800">{user.name}</td>
            <td className="p-4 text-gray-600">{user.email}</td>
            <td className="p-4 text-gray-600">{user.joined}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
