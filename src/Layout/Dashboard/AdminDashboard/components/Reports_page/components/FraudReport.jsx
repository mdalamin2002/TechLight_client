import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const FraudReport = ({ dateRange, onDataUpdate }) => {
  const [fraudData, setFraudData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const axiosSecure = useAxiosSecure(); // Commented out unused variable

  const itemsPerPage = 5;

  // In a real application, you would fetch fraud data from your backend
  // For now, we'll simulate with sample data
  useEffect(() => {
    const fetchFraudData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call with sample data
        // In a real implementation, you would fetch from:
        // axiosSecure.get('/fraud-reports') or similar endpoint
        const sampleData = generateSampleFraudData();
        setFraudData(sampleData);
      } catch (err) {
        console.error("Error loading fraud data:", err);
        setError("Failed to load fraud data");
      } finally {
        setLoading(false);
      }
    };

    fetchFraudData();
  }, []);

  // Generate sample fraud data
  const generateSampleFraudData = () => {
    const statuses = ["Resolved", "Investigating", "Pending"];
    const types = ["Payment Fraud", "Account Takeover", "Phishing", "Spam"];
    const users = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry"];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `FRD${String(i + 1).padStart(3, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      user: users[Math.floor(Math.random() * users.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      details: `Fraud case details for case ${i + 1}`
    }));
  };

  // Filter by Date Range
  const filterByDateRange = (data) => {
    const today = new Date();
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const diffDays = (today - itemDate) / (1000 * 60 * 60 * 24);

      switch (dateRange) {
        case "Last 7 Days":
          return diffDays <= 7;
        case "Last 30 Days":
          return diffDays <= 30;
        case "Last 6 Months":
          return diffDays <= 182;
        case "Last 1 Year":
          return diffDays <= 365;
        default:
          return true;
      }
    });
  };

  const filteredByDate = filterByDateRange(fraudData);

  // Search + Status Filter
  const filteredData = filteredByDate.filter((item) => {
    const matchesSearch =
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Chart Data
  const statusCounts = { Resolved: 0, Investigating: 0, Pending: 0 };
  filteredData.forEach((item) => {
    statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Cases",
        data: Object.values(statusCounts),
        backgroundColor: ["#34D399", "#FBBF24", "#F87171"],
      },
    ],
  };

  // Summary Metrics
  const totalCases = filteredData.length;
  const resolvedPercent = (
    (statusCounts["Resolved"] / totalCases) * 100 || 0
  ).toFixed(1);
  const investigatingPercent = (
    (statusCounts["Investigating"] / totalCases) * 100 || 0
  ).toFixed(1);
  const pendingPercent = (
    (statusCounts["Pending"] / totalCases) * 100 || 0
  ).toFixed(1);

  // 🟩 Send real data to parent for export (with delay)
  useEffect(() => {
    if (!onDataUpdate) return;

    const timer = setTimeout(() => {
      onDataUpdate({
        cases: filteredData,
        summary: {
          totalCases,
          resolvedPercent,
          investigatingPercent,
          pendingPercent,
        },
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [
    filteredData,
    totalCases,
    resolvedPercent,
    investigatingPercent,
    pendingPercent,
    onDataUpdate,
  ]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-red-600 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-primary/5 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Fraud & Suspicious Users Report
          </h1>
          <p className="text-muted-foreground">
            Monitor and track fraud cases and suspicious activities
          </p>
          {dateRange && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 w-fit mt-4">
              <span className="text-sm font-medium text-primary">{dateRange}</span>
            </div>
          )}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by user, case ID, or type..."
            className="w-full md:w-1/2 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card text-foreground border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card text-foreground border-border"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Resolved">Resolved</option>
            <option value="Investigating">Investigating</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Cases</p>
            <p className="text-2xl font-bold text-foreground">{totalCases}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-1">Resolved %</p>
            <p className="text-2xl font-bold text-foreground text-green-600">
              {resolvedPercent}%
            </p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-1">Investigating %</p>
            <p className="text-2xl font-bold text-foreground text-yellow-600">
              {investigatingPercent}%
            </p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-1">Pending %</p>
            <p className="text-2xl font-bold text-foreground text-red-600">
              {pendingPercent}%
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-4">
            <h2 className="text-lg font-bold text-foreground">Fraud Cases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                  <th className="p-4 text-left font-bold">Case ID</th>
                  <th className="p-4 text-left font-bold">User</th>
                  <th className="p-4 text-left font-bold">Type</th>
                  <th className="p-4 text-center font-bold">Status</th>
                  <th className="p-4 text-left font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`
                        border-b border-border/30 transition-colors cursor-pointer
                        ${index % 2 === 0
                          ? "bg-white hover:bg-primary/5"
                          : "bg-muted/30 hover:bg-primary/5"
                        }
                      `}
                      onClick={() => setSelectedCase(item)}
                    >
                      <td className="p-4 text-foreground font-medium">{item.id}</td>
                      <td className="p-4 text-foreground">{item.user}</td>
                      <td className="p-4 text-foreground">{item.type}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Investigating"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{item.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition text-foreground border-border"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-foreground">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages || 1))}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition text-foreground border-border"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Chart */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Cases Distribution by Status
          </h2>
          {filteredData.length > 0 ? (
            <div className="h-80">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw} cases`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No data available for chart
            </div>
          )}
        </div>

        {/* Modal for Case Details */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-card rounded-xl w-full max-w-md relative border border-border shadow-lg">
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl font-bold"
                onClick={() => setSelectedCase(null)}
              >
                ✕
              </button>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Case Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Case ID</p>
                    <p className="font-medium text-foreground">{selectedCase.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium text-foreground">{selectedCase.user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium text-foreground">{selectedCase.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium text-foreground">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedCase.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : selectedCase.status === "Investigating"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedCase.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">{selectedCase.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Details</p>
                    <p className="font-medium text-foreground">{selectedCase.details}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudReport;
