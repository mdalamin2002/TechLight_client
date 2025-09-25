import React from "react";
import { CheckCircle, Clock, X, Check } from "lucide-react";

const RefundsTable = () => {
  const refunds = [
    { id: "RF-001", orderId: "ORD-002", user: "Jane Smith", amount: "$129", reason: "Defective Item", status: "Pending" },
    { id: "RF-002", orderId: "ORD-005", user: "David Brown", amount: "$299", reason: "Not Delivered", status: "Approved" },
    { id: "RF-003", orderId: "ORD-007", user: "Mike Johnson", amount: "$89", reason: "Wrong Item", status: "Rejected" },
  ];

  return (
    <div >
      <table className="w-full text-left text-sm">
      <thead className="border-b bg-black/10">
        <tr>
            <th className="py-3 px-4">Refund ID</th>
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4">Reason</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {refunds.map((rf, i) => (
            <tr key={i} className="border-b hover:bg-gray-50 transition">
              {/* Refund ID */}
              <td className="py-3 px-4 font-medium text-purple-600">{rf.id}</td>

              {/* Order ID */}
              <td className="py-3 px-4">{rf.orderId}</td>

              {/* User */}
              <td className="py-3 px-4">{rf.user}</td>

              {/* Amount */}
              <td className="py-3 px-4 font-medium">{rf.amount}</td>

              {/* Reason */}
              <td className="py-3 px-4">{rf.reason}</td>

              {/* Status */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {rf.status === "Approved" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : rf.status === "Rejected" ? (
                    <X className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      rf.status === "Approved"
                        ? "text-green-500"
                        : rf.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-400"
                    }`}
                  >
                    {rf.status}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <button className="p-1 rounded bg-green-600/20 hover:bg-green-600/30">
                    <Check className="w-4 h-4 text-green-400" />
                  </button>
                  <button className="p-1 rounded bg-red-600/20 hover:bg-red-600/30">
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RefundsTable;
