import React, { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import RefundsTable from "./components/RefundsTable";
// import PayoutsTable from "./components/PayoutsTable";
import { DollarSign, CreditCard, RefreshCw, TrendingUp } from "lucide-react";

const Finance = () => {
  const [activeTab, setActiveTab] = useState("Transactions");

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Finance & Payments</h2>
        <p className="text-muted-foreground">Manage transactions, refunds, and seller payouts.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1">$24,780</p>
              <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Transactions</p>
              <p className="text-2xl font-bold text-foreground mt-1">1,429</p>
              <p className="text-xs text-green-600 mt-1">+8.2% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Refunds</p>
              <p className="text-2xl font-bold text-foreground mt-1">42</p>
              <p className="text-xs text-red-600 mt-1">+3.1% from last month</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending Payouts</p>
              <p className="text-2xl font-bold text-foreground mt-1">$3,847</p>
              <p className="text-xs text-muted-foreground mt-1">5 sellers waiting</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl shadow-sm border border-border/50 p-1 mb-6 inline-flex">
        {["Transactions", "Refunds"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tables */}
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
        {activeTab === "Transactions" && <TransactionsTable />}
        {activeTab === "Refunds" && <RefundsTable />}
        {/* {activeTab === "Payouts" && <PayoutsTable />} */}
      </div>
    </div>
  );
};

export default Finance;
