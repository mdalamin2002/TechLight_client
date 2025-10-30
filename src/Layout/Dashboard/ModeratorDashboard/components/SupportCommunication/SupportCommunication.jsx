import React, { useState } from "react";

// Tab Components
import SupportTicketsTab from "./components/SupportTicketsTab";
import LiveChatTab from "./components/LiveChatTab";
import NotificationsTab from "./components/NotificationsTab";

export const SupportCommunication = () => {
  const [activeTab, setActiveTab] = useState("chat");

  const tabs = [
    // { key: "tickets", label: "Support Tickets" },
    { key: "chat", label: "Live Chat" },
    // { key: "notifications", label: "Notifications" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      // case "tickets":
      //   return <SupportTicketsTab />;
      case "chat":
        return <LiveChatTab />;
      // case "notifications":
      //   return <NotificationsTab />;
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

export default SupportCommunication;
