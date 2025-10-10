import React, { useState } from "react";

const Payments = () => {
  // Fake transactions data
  const [transactions, setTransactions] = useState([
    {
      id: "TXN001",
      user: "John Doe",
      method: "bKash",
      amount: 1200,
      status: "Success",
      date: "2025-10-01",
    },
    {
      id: "TXN002",
      user: "Alice Smith",
      method: "Card",
      amount: 4500,
      status: "Pending",
      date: "2025-10-03",
    },
    {
      id: "TXN003",
      user: "Bob Johnson",
      method: "Nagad",
      amount: 2300,
      status: "Failed",
      date: "2025-10-05",
    },
  ]);

  const handleRefund = (id) => {
    alert(`Refund initiated for transaction ${id}`);
  };

  const handleDispute = (id) => {
    alert(`Dispute logged for transaction ${id}`);
  };

  const statusColors = {
    Success: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Payments</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Transaction ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{txn.id}</td>
                <td className="p-3">{txn.user}</td>
                <td className="p-3">{txn.method}</td>
                <td className="p-3">{txn.amount} BDT</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColors[txn.status]}`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="p-3">{txn.date}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleRefund(txn.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-sm"
                  >
                    Refund
                  </button>
                  <button
                    onClick={() => handleDispute(txn.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    Dispute
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
