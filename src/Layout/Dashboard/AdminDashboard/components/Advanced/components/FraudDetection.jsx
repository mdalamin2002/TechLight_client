import React, { useState } from "react";
import { Edit2, CheckCircle, XCircle, ToggleLeft, ToggleRight } from "lucide-react";

const FraudDetection = () => {
  const [rules, setRules] = useState([
    { id: 1, name: "Multiple orders with different cards from same IP", status: "Active", risk: "High Risk" },
    { id: 2, name: "Large order from new user account", status: "Active", risk: "Medium Risk" },
    { id: 3, name: "Repeated login attempts from multiple locations", status: "Active", risk: "High Risk" },
    { id: 4, name: "Order value exceeds user history average by 500%", status: "Inactive", risk: "Medium Risk" },
  ]);

  const [logs, setLogs] = useState([
    { id: "SA-001", user: "user123@email.com", reason: "Multiple failed payments", risk: 85, date: "2024-01-20" },
    { id: "SA-002", user: "suspicious@email.com", reason: "Unusual order pattern", risk: 72, date: "2024-01-19" },
    { id: "SA-003", user: "test@email.com", reason: "High-value order from new account", risk: 68, date: "2024-01-18" },
  ]);

  const riskColor = (risk) => {
    switch (risk) {
      case "High Risk":
        return "bg-red-50 text-red-800";
      case "Medium Risk":
        return "bg-yellow-50 text-yellow-800";
      default:
        return "bg-gray-50 text-gray-800";
    }
  };

  return (
    <div className="space-y-8 p-4">
      
      {/* Detection Rules */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border border-gray-200 rounded-2xl shadow-xl p-6">
        <h4 className="text-xl font-semibold mb-6 text-gray-800">Detection Rules</h4>
        <div className="grid gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between border border-gray-100 p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group bg-white"
            >
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{rule.name}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      rule.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {rule.status === "Active" && <CheckCircle className="w-3 h-3" />}
                    {rule.status}
                  </span>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${riskColor(
                      rule.risk
                    )}`}
                  >
                    {rule.risk === "High Risk" && <XCircle className="w-3 h-3" />}
                    {rule.risk}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                </button>
                {rule.status === "Active" ? (
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <ToggleLeft className="w-5 h-5 text-red-600" />
                  </button>
                ) : (
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <ToggleRight className="w-5 h-5 text-green-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suspicious Activity Log */}
      <div className="bg-gradient-to-r from-pink-50 via-white to-pink-50 border border-gray-200 rounded-2xl shadow-xl p-6">
        <h4 className="text-xl font-semibold mb-6 text-gray-800">Suspicious Activity Log</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "User", "Reason", "Risk Score", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition group">
                  <td className="px-4 py-2 text-sm text-gray-700">{log.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.user}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.reason}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.risk}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 flex gap-2 ">
                    <button className="p-2 rounded-lg hover:bg-green-100 transition">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-100 transition">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FraudDetection;
