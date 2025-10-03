import React, { useState } from "react";
import { SalesReport } from "./components/SalesReport";
import { UsersReport } from "./components/UsersReport";
import { ReviewTraking } from "./components/ReviewTraking";
import { OrdersReport } from "./components/OrdersReport";
import { ModeratorReport } from "./components/ModeratorReport";
import { FraudReport } from "./components/FraudReport";
import { tabs } from "./components/tabs";
import { ExportButton } from "./components/ExportButton";

export const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState("Last 7 Days");

  const renderTabContent = () => {
    switch (activeTab) {
      case "sales":
        return <SalesReport dateRange={dateRange} />;
      case "users":
        return <UsersReport dateRange={dateRange}/>;
      case "review":
        return <ReviewTraking dateRange={dateRange}/>;
      case "orders":
        return <OrdersReport dateRange={dateRange}/>;
      case "moderator":
        return <ModeratorReport dateRange={dateRange}/>;
      case "fraud":
        return <FraudReport dateRange={dateRange}/>;
      default:
        return <div>Coming Soon 🚀</div>;
    }
  };

  const handleExport = () => {
    alert(`Exporting ${activeTab} report for ${dateRange}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Analyze performance and generate detailed reports.
          </p>
        </div>
        <ExportButton onExport={handleExport} />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white shadow p-2 rounded-lg overflow-x-auto items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="ml-auto bg-gray-100 text-gray-700 px-3 py-2 rounded-lg focus:outline-none"
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 6 Months</option>
          <option>Last 1 Year</option>
        </select>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};
