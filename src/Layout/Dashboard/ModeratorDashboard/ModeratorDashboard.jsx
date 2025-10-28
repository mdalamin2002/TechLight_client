import React, { useState } from "react";
import { ModeratorOverview } from "./components/ModeratorOverview/ModeratorOverview";
import { OrdersProducts } from "./components/OrdersProducts/OrdersProducts";
import { UsersReviews } from "./components/UsersReviews/UsersReviews";
import { SupportCommunication } from "./components/SupportCommunication/SupportCommunication";
import ReportsAnalytics from "./components/ReportsAnalytics/ReportsAnalytics";
import DeveloperNotes from "./components/DeveloperNotes/DeveloperNotes";
import ModeratorSettings from "./components/ModeratorSettings/ModeratorSettings";
import Payments from "./components/Payments/Payments";
import Notifications from "./components/Notifications/Notifications";

const ModeratorDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <ModeratorOverview />;
      case "orders-products":
        return <OrdersProducts />;
      case "users-reviews":
        return <UsersReviews />;
      case "support-communication":
        return <SupportCommunication />;
      case "reports-analytics":
        return <ReportsAnalytics />;
      case "payments":
        return <Payments />;
      case "notifications":
        return <Notifications />;
      case "developer-notes":
        return <DeveloperNotes />;
      case "settings":
        return <ModeratorSettings />;
      default:
        return <ModeratorOverview />;
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview" },
    { id: "orders-products", label: "Orders & Products" },
    { id: "users-reviews", label: "Users & Reviews" },
    { id: "support-communication", label: "Support & Communication" },
    { id: "reports-analytics", label: "Reports & Analytics" },
    { id: "payments", label: "Payments" },
    { id: "notifications", label: "Notifications" },
    { id: "developer-notes", label: "Developer Notes" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="lg:w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-6 text-[var(--primary)]">Moderator Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-[var(--primary)] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-4 lg:p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;