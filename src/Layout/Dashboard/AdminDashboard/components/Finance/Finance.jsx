import React, { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import RefundsTable from "./components/RefundsTable";
// import PayoutsTable from "./components/PayoutsTable";

const Finance = () => {
  const [activeTab, setActiveTab] = useState("Transactions");

  return (
    <div className="min-h-screen bg-background p-1">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Finance & Payments</h2>
        <p className="text-sm text-gray-500">Manage transactions, refunds, and seller payouts.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["Transactions", "Refunds"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === tab
              ? "bg-pink-600 text-white"
              : "bg-purple-700 text-gray-300 hover:bg-purple-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tables */}
      <div className="rounded-2xl border shadow-lg overflow-hidden">
        {activeTab === "Transactions" && <TransactionsTable />}
        {activeTab === "Refunds" && <RefundsTable />}
        {/* {activeTab === "Payouts" && <PayoutsTable />} */}
      </div>
    </div>
  );
};

export default Finance;
