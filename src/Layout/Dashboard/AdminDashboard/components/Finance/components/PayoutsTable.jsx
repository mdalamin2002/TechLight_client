import React from "react";
import { CheckCircle, Clock, Check } from "lucide-react";

const PayoutsTable = () => {
  const payouts = [
    { id: "PO-001", seller: "Tech Store Pro", amount: "$500", status: "Pending" },
    { id: "PO-002", seller: "Fashion Hub", amount: "$200", status: "Completed" },
  ];

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b bg-black/10">
        <tr>
          <th className="py-3 px-4">Payout ID</th>
          <th className="py-3 px-4">Seller</th>
          <th className="py-3 px-4">Amount</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {payouts.map((po, i) => (
          <tr key={i} className="border-b">
            <td className="py-3 px-4 text-purple-600">{po.id}</td>
            <td className="py-3 px-4">{po.seller}</td>
            <td className="py-3 px-4 font-medium">{po.amount}</td>
            <td className="py-3 px-4 flex items-center gap-2">
              {po.status === "Completed" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  po.status === "Completed" ? "text-green-500" : "text-yellow-400"
                }`}
              >
                {po.status}
              </span>
            </td>
            <td className="py-3 px-4">
              {po.status === "Pending" && (
                <button className="p-1 bg-green-600/20 rounded hover:bg-green-600/30">
                  <Check className="w-4 h-4 text-green-400" />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PayoutsTable;
