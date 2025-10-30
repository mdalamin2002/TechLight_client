import React, { useState } from "react";
import ProductsTab from "./components/ProductsTab";
// import InventoryAlertsTab from "./components/InventoryAlertsTab";

export const OrdersProducts = () => {
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { key: "products", label: "Products" },
    // { key: "inventory", label: "Inventory Alerts" }, // Commented out as requested
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductsTab />;
      // case "inventory":
      //   return <InventoryAlertsTab />;
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
