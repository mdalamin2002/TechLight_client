import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  // Data for export
  const [salesData, setSalesData] = useState({ salesPerformance: [], topProducts: [] });
  const [usersData, setUsersData] = useState({ topProducts: [], summary: [] });
  const [reviewData, setReviewData] = useState({ reviews: [], summary: {} });
  const [ordersData, setOrdersData] = useState({ orders: [] });
  const [moderatorData, setModeratorData] = useState({ cases: [], summary: {} });
  const [fraudData, setFraudData] = useState({ cases: [], summary: {} });

  // Wrapper to update child data safely
  const safeSetData = (setter, data) => {
    setter(prev => (JSON.stringify(prev) !== JSON.stringify(data) ? data : prev));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "sales":
        return <SalesReport dateRange={dateRange} onDataUpdate={data => safeSetData(setSalesData, data)} />;
      case "users":
        return <UsersReport dateRange={dateRange} onDataUpdate={data => safeSetData(setUsersData, data)} />;
      case "review":
        return <ReviewTraking dateRange={dateRange} onDataUpdate={data => safeSetData(setReviewData, data)} />;
      case "orders":
        return <OrdersReport dateRange={dateRange} onDataUpdate={data => safeSetData(setOrdersData, data)} />;
      case "moderator":
        return <ModeratorReport dateRange={dateRange} onDataUpdate={data => safeSetData(setModeratorData, data)} />;
      case "fraud":
        return <FraudReport dateRange={dateRange} onDataUpdate={data => safeSetData(setFraudData, data)} />;
      default:
        return <div>Coming Soon 🚀</div>;
    }
  };

  const handleExport = () => {
    let dataToExport = [];

    switch (activeTab) {
      case "sales": {
        const { salesPerformance, topProducts } = salesData;
        dataToExport = [
          { Section: "Sales Performance" },
          ...salesPerformance,
          {},
          { Section: "Top Products" },
          ...topProducts,
        ];
        break;
      }
      case "users": {
        const { summary, topProducts } = usersData;
        dataToExport = [
          { Section: "User Summary" },
          ...summary,
          {},
          { Section: "User Analytics" },
          ...topProducts,
        ];
        break;
      }
      case "review": {
        const { summary, reviews } = reviewData;
        dataToExport = [
          { Section: "Review Summary" },
          summary,
          {},
          { Section: "Reviews" },
          ...reviews,
        ];
        break;
      }
      case "orders": {
        const { orders } = ordersData;
        dataToExport = [{ Section: "Orders" }, ...orders];
        break;
      }
      case "moderator": {
        const { summary, cases } = moderatorData;
        dataToExport = [
          { Section: "Summary" },
          summary,
          {},
          { Section: "Moderator Cases" },
          ...cases,
        ];
        break;
      }
      case "fraud": {
        const { summary, cases } = fraudData;
        dataToExport = [
          { Section: "Summary" },
          summary,
          {},
          { Section: "Fraud Cases" },
          ...cases,
        ];
        break;
      }
    }

    if (!dataToExport.length) {
      alert("No data available to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const fileName = `${activeTab.toUpperCase()}_Report_${dateRange.replace(/\s+/g, "_")}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--primary)]">Reports & Analytics</h1>
          <p className="text-gray-600">Analyze performance and generate detailed reports.</p>
        </div>
        <ExportButton onExport={handleExport} />
      </div>

      <div className="flex space-x-2 bg-white shadow p-2 rounded-lg overflow-x-auto items-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-[var(--primary)] text-white"
                : "text-gray-600 hover:text-[var(--primary)] hover:bg-gray-100"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className="ml-auto bg-gray-100 text-gray-700 px-3 py-2 rounded-lg focus:outline-none"
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 6 Months</option>
          <option>Last 1 Year</option>
        </select>
      </div>

      {renderTabContent()}
    </div>
  );
};
