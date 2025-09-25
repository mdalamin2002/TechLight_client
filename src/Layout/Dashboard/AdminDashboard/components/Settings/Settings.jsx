import React, { useState } from "react";
import SiteSettings from "./components/SiteSettings";
import SecuritySettings from "./components/SecuritySettings";
import BackupSettings from "./components/BackupSettings";
import IntegrationsSettings from "./components/IntegrationsSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("site");

  const tabs = [
    { id: "site", label: "Site Settings" },
    { id: "security", label: "Security" },
    { id: "backup", label: "Backup" },
    { id: "integrations", label: "Integrations" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          System Settings
        </h2>
        <p className="text-gray-600 mt-2">
          Configure your platform settings and preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 bg-white shadow-md p-3 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-indigo-400 to-pink-300 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow-md rounded-xl p-6 transition-all duration-300">
        {activeTab === "site" && <SiteSettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "backup" && <BackupSettings />}
        {activeTab === "integrations" && <IntegrationsSettings />}
      </div>
    </div>
  );
};

export default Settings;
