import React, { useState } from "react";
import {
  Megaphone,
  Mail,
  Bell,
  Tag,
  Gift,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import Announcements from "./components/Announcements";
import SupportTickets from "./components/SupportTickets";
import Notifications from "./components/Notifications";
import Coupons from "./components/Coupons";
import AddBannerOffer from "./components/AddBannerOffer";

const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState("Announcements");

  const tabs = [
    {
      name: "Announcements",
      icon: Megaphone,
      color: "from-blue-500 to-blue-600",
      description: "Manage system announcements",
    },
    {
      name: "Support Tickets",
      icon: Mail,
      color: "from-blue-500 to-blue-600",
      description: "Handle customer support",
    },
    {
      name: "Notifications",
      icon: Bell,
      color: "from-blue-500 to-blue-600",
      description: "Send mass notifications",
    },
    {
      name: "Coupons",
      icon: Tag,
      color: "from-blue-500 to-blue-600",
      description: "Manage discount coupons",
    },
    {
      name: "Banner offer",
      icon: Gift,
      color: "from-blue-500 to-blue-600",
      description: "Create promotional banners",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-background via-background to-primary/5 min-h-screen">
      <div className="p-2 xl:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Communication Center
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                Manage announcements, support, notifications, coupons, and
                banners
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : "bg-card border border-border/50 text-muted-foreground hover:border-border hover:bg-muted/50"
                  }`}
                  title={tab.description}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.name}</span>
                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeTab === "Announcements" && <Announcements />}
          {activeTab === "Support Tickets" && <SupportTickets />}
          {activeTab === "Notifications" && <Notifications />}
          {activeTab === "Coupons" && <Coupons />}
          {activeTab === "Banner offer" && <AddBannerOffer />}
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;
