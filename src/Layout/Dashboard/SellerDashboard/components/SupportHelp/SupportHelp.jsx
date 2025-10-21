import React, { useState } from "react";
import SellerLiveSupport from "./components/SellerLiveSupport";
import SellerTicketSupport from "./components/SellerTicketSupport";

const SupportHelp = () => {
  const [activeTab, setActiveTab] = useState("live");

  const tabs = [
    { key: "live", label: "Live Support" },
    { key: "ticket", label: "Ticket Support" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "live":
        return <SellerLiveSupport />;
      case "ticket":
        return <SellerTicketSupport />;
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
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.key
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

export default SupportHelp;
