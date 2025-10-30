import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { SalesReport } from "./components/SalesReport";
import { UsersReport } from "./components/UsersReport";
import { ReviewTraking } from "./components/ReviewTraking";
import { OrdersReport } from "./components/OrdersReport";
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
      case "fraud":
        return <FraudReport dateRange={dateRange} onDataUpdate={data => safeSetData(setFraudData, data)} />;
      default:
        return <div className="bg-card border border-border/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Coming Soon 🚀</h3>
          <p className="text-muted-foreground">This report type is not yet available.</p>
        </div>;
    }
  };

  const handleExport = () => {
    let dataToExport = [];

    switch (activeTab) {
      case "sales": {
        const { salesPerformance, topProducts } = salesData;
        dataToExport = [
          { Section: "Sales Performance" },
          ...salesPerformance.map(item => ({
            "Month": item.month,
            "Revenue": item.revenue,
            "Orders": item.orders,
            "Average": item.avg,
            "Date": item.date
          })),
          {},
          { Section: "Top Products" },
          ...topProducts.map(item => ({
            "Product": item.name,
            "Sales": item.sales,
            "Revenue": item.revenue,
            "Date": item.date
          })),
        ];
        break;
      }
      case "users": {
        const { summary, topProducts } = usersData;
        dataToExport = [
          { Section: "User Summary" },
          ...summary.map(item => ({
            "Metric": item.title,
            "Value": item.value,
            "Change": item.change.value
          })),
          {},
          { Section: "User Analytics" },
          ...topProducts.map(item => ({
            "Date": item.date,
            "New Registrations": item.newRegistrations,
            "Active Users": item.activeUsers,
            "Retention %": item.userRetention,
            "Avg Session": `${Math.floor(item.averageSession)}m ${Math.round((item.averageSession % 1) * 60)}s`
          })),
        ];
        break;
      }
      case "review": {
        const { summary, reviews } = reviewData;
        dataToExport = [
          { Section: "Review Summary" },
          {
            "Total Reviews": summary.totalReviews,
            "Average Rating": summary.avgRating,
            "Positive %": summary.positivePercent,
            "Negative %": summary.negativePercent
          },
          {},
          { Section: "Reviews" },
          ...reviews.map(review => ({
            "User": review.userName,
            "Product": review.productName,
            "Rating": review.rating,
            "Date": new Date(review.createdAt).toLocaleDateString(),
            "Comment": review.comment || review.title
          })),
        ];
        break;
      }
      case "orders": {
        const { orders } = ordersData;
        dataToExport = [
          { Section: "Orders" },
          ...orders.map(order => ({
            "Order ID": order.tran_id ? order.tran_id.substring(0, 8) : "N/A",
            "Customer": order.customer ? (order.customer.name || order.customer.email) : "Unknown",
            "Amount": order.total_amount,
            "Status": order.status,
            "Date": order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"
          }))
        ];
        break;
      }
      case "fraud": {
        const { summary, cases } = fraudData;
        dataToExport = [
          { Section: "Summary" },
          {
            "Total Cases": summary.totalCases,
            "Resolved %": summary.resolvedPercent,
            "Investigating %": summary.investigatingPercent,
            "Pending %": summary.pendingPercent
          },
          {},
          { Section: "Fraud Cases" },
          ...cases.map(item => ({
            "Case ID": item.id,
            "User": item.user,
            "Type": item.type,
            "Status": item.status,
            "Date": item.date,
            "Details": item.details
          })),
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

    const fileName = `${activeTab.toUpperCase()}_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
