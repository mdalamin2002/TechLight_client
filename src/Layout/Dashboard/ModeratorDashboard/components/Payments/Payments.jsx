import React, { useState } from "react";
import Transactions from "./components/Transactions/Transactions";
import Reports from "./components/Payments_Reports/Reports";
import Settings from "./components/Settings/Settings";
import Analytics from "./components/Analytics/Analytics";
import Disputes from "./components/Disputes/Disputes";
import Refunds from "./components/Refunds/Refunds";

export const Payments = () => {
  const [activeTab, setActiveTab] = useState("transactions");

  const tabs = [
    { key: "transactions", label: "Transactions" },
    { key: "refunds", label: "Refunds" },
    { key: "disputes", label: "Disputes" },
    { key: "analytics", label: "Analytics" },
    { key: "settings", label: "Settings" },
    { key: "reports", label: "Reports" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "transactions":
        return <Transactions />;
      case "refunds":
        return <Refunds />;
      case "disputes":
        return <Disputes />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      case "reports":
        return <Reports />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 bg-white border-b border-gray-200 p-4 rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.key
                ? "bg-[var(--primary)] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default Payments;
