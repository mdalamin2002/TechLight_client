import React, { useState } from "react";
import AIRecommendations from "./components/AIRecommendations";
import FraudDetection from "./components/FraudDetection";
import ChatbotControl from "./components/ChatbotControl";
import InventoryForecasting from "./components/InventoryForecasting";
import MultiLanguage from "./components/MultiLanguage";

const Advanced = () => {
  const [activeTab, setActiveTab] = useState("ai");

  const tabs = [
    { id: "ai", label: "AI Recommendations" },
    { id: "fraud", label: "Fraud Detection" },
    { id: "chatbot", label: "Chatbot Control" },
    { id: "inventory", label: "Inventory Forecasting" },
    { id: "multi", label: "Multi-language" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-2">Advanced Features</h2>
      <p className="text-gray-600 mb-6">
        Configure AI-powered features and advanced system capabilities.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "ai" && <AIRecommendations />}
      {activeTab === "fraud" && <FraudDetection />}
      {activeTab === "chatbot" && <ChatbotControl />}
      {activeTab === "inventory" && <InventoryForecasting />}
      {activeTab === "multi" && <MultiLanguage />}
    </div>
  );
};

export default Advanced;
