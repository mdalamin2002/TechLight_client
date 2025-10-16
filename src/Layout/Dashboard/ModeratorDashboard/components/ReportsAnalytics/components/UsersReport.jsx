import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export const UsersReport = ({ dateRange, onDataUpdate }) => {
  const [analytics, setAnalytics] = useState([]);
  const [chartKey, setChartKey] = useState(0); // key to force remount

  // Fetch JSON file
  useEffect(() => {
    fetch("/UserReport_Data.json")
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error("Error fetching User Analytics:", err));
  }, []);

  // Helper: filter data by date range
  const filterByDate = (data, range) => {
    if (!range) return data;

    const now = new Date();
    let cutoff = new Date(now);

    switch (range) {
      case "Last 7 Days":
        cutoff.setDate(now.getDate() - 7);
        break;
      case "Last 30 Days":
        cutoff.setDate(now.getDate() - 30);
        break;
      case "Last 6 Months":
        cutoff.setMonth(now.getMonth() - 6);
        break;
      case "Last 1 Year":
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return !isNaN(itemDate) && itemDate >= cutoff;
    });
  };

  // Helper: parse "12m 34s" -> minutes as float
  const parseSession = (str) => {
    if (!str) return 0;
    const parts = str.match(/(\d+)m\s*(\d+)s/);
    if (!parts) return 0;
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    return minutes + seconds / 60;
  };

  // Calculate % change
  const calcChange = (current, prev) => {
    if (!prev || prev === 0) return "+0%";
    const change = ((current - prev) / prev) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // Calculate summary
  const summary = () => {
    if (analytics.length === 0) return null;

    const now = new Date();
    let currentStart = new Date();
    let offsetDays = 0;

    // Determine current period start
    switch (dateRange) {
      case "Last 7 Days":
        offsetDays = 7;
        break;
      case "Last 30 Days":
        offsetDays = 30;
        break;
      case "Last 6 Months":
        offsetDays = 182; // approx
        break;
      case "Last 1 Year":
        offsetDays = 365;
        break;
      default:
        offsetDays = 0;
    }

    currentStart.setDate(now.getDate() - offsetDays);
    const currentEnd = now;

    // Previous period
    const previousEnd = new Date(currentStart);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousEnd.getDate() - offsetDays);

    // Filter current and previous data
    const currentData = analytics.filter((d) => {
      const itemDate = new Date(d.date);
      return (
        !isNaN(itemDate) && itemDate >= currentStart && itemDate <= currentEnd
      );
    });

    const previousData = analytics.filter((d) => {
      const itemDate = new Date(d.date);
      return (
        !isNaN(itemDate) && itemDate >= previousStart && itemDate < previousEnd
      );
    });

    if (currentData.length === 0) return null;

    // Helpers
    const sum = (arr, key) => arr.reduce((s, d) => s + d[key], 0);
    const avg = (arr, key) =>
      arr.reduce((s, d) => s + d[key], 0) / arr.length || 0;

    // Current values
    const totalRegistrations = sum(currentData, "newRegistrations");
    const totalActiveUsers = sum(currentData, "activeUsers");
    const avgRetention = avg(currentData, "userRetention");
    const avgSessionCurrent =
      currentData.reduce((s, d) => s + parseSession(d.averageSession), 0) /
      currentData.length;

    // Previous values
    const prevRegistrations = sum(previousData, "newRegistrations");
    const prevActiveUsers = sum(previousData, "activeUsers");
    const prevRetention = avg(previousData, "userRetention");
    const avgSessionPrevious =
      previousData.reduce((s, d) => s + parseSession(d.averageSession), 0) /
      (previousData.length || 1);

    return [
      {
        title: "New Registrations",
        value: totalRegistrations.toLocaleString(),
        change: calcChange(totalRegistrations, prevRegistrations),
        color: totalRegistrations >= prevRegistrations ? "green" : "red",
      },
      {
        title: "Active Users",
        value: totalActiveUsers.toLocaleString(),
        change: calcChange(totalActiveUsers, prevActiveUsers),
        color: totalActiveUsers >= prevActiveUsers ? "green" : "red",
      },
      {
        title: "User Retention",
        value: `${avgRetention.toFixed(1)}%`,
        change: calcChange(avgRetention, prevRetention),
        color: avgRetention >= prevRetention ? "green" : "red",
      },
      {
        title: "Average Session",
        value: `${Math.floor(avgSessionCurrent)}m ${Math.round(
          (avgSessionCurrent % 1) * 60
        )}s`,
        change: calcChange(avgSessionCurrent, avgSessionPrevious),
        color: avgSessionCurrent >= avgSessionPrevious ? "green" : "red",
      },
    ];
  };

  const analyticsData = summary();

  // ========== bar start
  useEffect(() => {
    // Force Line chart to remount whenever dateRange or analytics changes
    setChartKey((prev) => prev + 1);
  }, [dateRange, analytics]);

  const currentData = filterByDate(analytics, dateRange);

  const chartData = {
    datasets: [
      {
        label: "New Registrations",
        data: currentData.map((d) => ({ x: d.date, y: d.newRegistrations })),
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
      {
        label: "Active Users",
        data: currentData.map((d) => ({ x: d.date, y: d.activeUsers })),
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
      {
        label: "User Retention (%)",
        data: currentData.map((d) => ({ x: d.date, y: d.userRetention })),
        borderColor: "rgba(234,179,8,1)",
        backgroundColor: "rgba(234,179,8,0.2)",
        tension: 0.3,
        yAxisID: "y1",
      },
      {
        label: "Average Session (min)",
        data: currentData.map((d) => ({
          x: d.date,
          y: parseSession(d.averageSession),
        })),
        borderColor: "rgba(239,68,68,1)",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `User Analytics - ${dateRange}` },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "MMM dd, yyyy",
        },
        title: { display: true, text: "Date" },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Registrations / Active Users" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Retention (%) / Avg Session (min)" },
      },
    },
  };
  // ============= bar end

  // Send data to parent for Excel export (with delay)
  useEffect(() => {
    if (!onDataUpdate) return;

    const timer = setTimeout(() => {
      onDataUpdate({
        topProducts: currentData, // or full analytics data, depending on export need
        summary: analyticsData || [],
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentData, analyticsData, onDataUpdate]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">User Analytics</h3>

      {!analyticsData ? (
        <p className="text-gray-500 italic">
          No user data available for {dateRange}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {analyticsData.map((item) => {
            const numericChange = parseFloat(item.change.replace("%", ""));
            const barWidth = Math.min(Math.abs(numericChange), 100);

            return (
              <div
                key={item.title}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <h4 className="text-gray-500 text-sm font-medium">
                  {item.title}
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {item.value}
                </p>
                <div className="mt-2">
                  {/* Bar chart */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        item.color === "green" ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      item.color === "green" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    vs previous: {item.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-6">
        {currentData.length > 0 ? (
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <Line key={chartKey} data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No user analytics available for {dateRange}
          </p>
        )}
      </div>
    </div>
  );
};
