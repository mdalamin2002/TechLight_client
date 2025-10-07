import React, { useState } from "react";
import { Megaphone, Mail, Bell, Tag } from "lucide-react";
import Announcements from "./components/Announcements";
import SupportTickets from "./components/SupportTickets";
import Notifications from "./components/Notifications";
import Coupons from "./components/Coupons";

const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState("Announcements");

  const tabs = [
    { name: "Announcements", icon: <Megaphone className="w-4 h-4" /> },
    { name: "Support Tickets", icon: <Mail className="w-4 h-4" /> },
    { name: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { name: "Coupons", icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Communication Center</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage announcements, support tickets, and customer communications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.name
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "Announcements" && <Announcements />}
        {activeTab === "Support Tickets" && <SupportTickets />}
        {activeTab === "Notifications" && <Notifications />}
        {activeTab === "Coupons" && <Coupons />}
      </div>
    </div>
  );
};

export default CommunicationCenter;