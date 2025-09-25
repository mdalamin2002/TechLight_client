import React from "react";

const TransactionsTable = () => {
  const transactions = [
    { id: "TXN-001", user: "John Doe", amount: "$1049", method: "Credit Card", date: "2024-01-15" },
    { id: "TXN-002", user: "Jane Smith", amount: "$129", method: "PayPal", date: "2024-01-16" },
    { id: "TXN-003", user: "Tech Store Pro", amount: "$500", method: "Bank Transfer", date: "2024-01-17" },
  ];

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b bg-black/10">
        <tr>
          <th className="py-3 px-4">Transaction ID</th>
          <th className="py-3 px-4">User/Seller</th>
          <th className="py-3 px-4">Amount</th>
          <th className="py-3 px-4">Payment Method</th>
          <th className="py-3 px-4">Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((txn, i) => (
          <tr key={i} className="border-b">
            <td className="py-3 px-4 text-purple-600">{txn.id}</td>
            <td className="py-3 px-4">{txn.user}</td>
            <td className="py-3 px-4 font-medium">{txn.amount}</td>
            <td className="py-3 px-4">{txn.method}</td>
            <td className="py-3 px-4">{txn.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
