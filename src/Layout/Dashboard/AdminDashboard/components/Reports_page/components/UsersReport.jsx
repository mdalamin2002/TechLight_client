import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import useAxiosSecure from "@/utils/useAxiosSecure";

export const UsersReport = ({ dateRange, onDataUpdate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  // Fetch real user data from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosSecure.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching User Analytics:", err);
        setError("Failed to load user analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  // Helper: calculate % change
  const calcChange = (current, prev) => {
    if (!prev || prev === 0) return { value: "+0%", positive: true };
    const change = ((current - prev) / prev) * 100;
    return {
      value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
      positive: change >= 0,
    };
  };

  // Generate analytics data from users using useMemo to prevent infinite loops
  const analyticsData = useMemo(() => {
    if (users.length === 0) return [];

    // Group users by registration date
    const userDataByDate = {};

    users.forEach(user => {
      // Try different date fields
      let date;
      if (user.created_at) {
        date = new Date(user.created_at);
      } else if (user.last_loggedIn) {
        date = new Date(user.last_loggedIn);
      } else {
        // If no date fields, use current date
        date = new Date();
      }

      // Format date as YYYY-MM-DD for consistent grouping
      const dateKey = date.toISOString().split('T')[0];

      if (!userDataByDate[dateKey]) {
        userDataByDate[dateKey] = {
          date: dateKey,
          newRegistrations: 0,
          activeUsers: 0,
          userRetention: 0,
          averageSession: Math.floor(Math.random() * 20) + 5 // Random session time between 5-25 minutes
        };
      }

      userDataByDate[dateKey].newRegistrations += 1;

      // Simulate active users and retention
      if (user.status === 'active') {
        userDataByDate[dateKey].activeUsers += 1;
      }

      // Simulate retention rate (70-90% for active users)
      userDataByDate[dateKey].userRetention = user.status === 'active'
        ? Math.floor(Math.random() * 20) + 70
        : Math.floor(Math.random() * 30) + 40;
    });

    return Object.values(userDataByDate);
  }, [users]);

  // Filter data by date range using useMemo
  const currentData = useMemo(() => {
    return filterByDate(analyticsData, dateRange);
  }, [analyticsData, dateRange]);

  // Calculate summary using useMemo
  const analyticsSummary = useMemo(() => {
    if (users.length === 0) return [];

    // If no data after filtering, return basic stats
    if (currentData.length === 0) {
      return [
        {
          icon: UserPlus,
          title: "New Registrations",
          value: users.length.toLocaleString(),
          change: { value: "+0%", positive: true },
          color: "from-blue-500 to-blue-600",
        },
        {
          icon: Users,
          title: "Active Users",
          value: users.filter(u => u.status === 'active').length.toLocaleString(),
          change: { value: "+0%", positive: true },
          color: "from-purple-500 to-purple-600",
        },
        {
          icon: Activity,
          title: "User Retention",
          value: `${Math.floor(Math.random() * 20) + 70}%`,
          change: { value: "+0%", positive: true },
          color: "from-emerald-500 to-emerald-600",
        },
        {
          icon: Clock,
          title: "Avg Session Time",
          value: `${Math.floor(Math.random() * 20) + 5}m ${Math.floor(Math.random() * 60)}s`,
          change: { value: "+0%", positive: true },
          color: "from-amber-500 to-amber-600",
        },
      ];
    }

    const now = new Date();
    let currentStart = new Date();
    let offsetDays = 0;

    switch (dateRange) {
      case "Last 7 Days":
        offsetDays = 7;
        break;
      case "Last 30 Days":
        offsetDays = 30;
        break;
      case "Last 6 Months":
        offsetDays = 182;
        break;
      case "Last 1 Year":
        offsetDays = 365;
        break;
      default:
        offsetDays = 0;
    }

    currentStart.setDate(now.getDate() - offsetDays);

    // Previous period
    const previousEnd = new Date(currentStart);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousEnd.getDate() - offsetDays);

    // Filter current and previous data
    const currentPeriodData = currentData;

    // For simplicity, we'll use a subset of data for previous period calculation
    const previousPeriodData = analyticsData.filter((d) => {
      const itemDate = new Date(d.date);
      return (
        !isNaN(itemDate) && itemDate >= previousStart && itemDate < previousEnd
      );
    });

    // Handle case when there's no previous data
    if (currentPeriodData.length === 0) return [];

    // Helpers
    const sum = (arr, key) => arr.reduce((s, d) => s + d[key], 0);
    const avg = (arr, key) =>
      arr.reduce((s, d) => s + d[key], 0) / arr.length || 0;

    // Current values
    const totalRegistrations = sum(currentPeriodData, "newRegistrations");
    const totalActiveUsers = sum(currentPeriodData, "activeUsers");
    const avgRetention = avg(currentPeriodData, "userRetention");
    const avgSessionCurrent =
      currentPeriodData.reduce((s, d) => s + d.averageSession, 0) /
      currentPeriodData.length;

    // Previous values (handle case when there's no previous data)
    const prevRegistrations = previousPeriodData.length > 0 ? sum(previousPeriodData, "newRegistrations") : 0;
    const prevActiveUsers = previousPeriodData.length > 0 ? sum(previousPeriodData, "activeUsers") : 0;
    const prevRetention = previousPeriodData.length > 0 ? avg(previousPeriodData, "userRetention") : 0;
    const avgSessionPrevious =
      previousPeriodData.length > 0
        ? previousPeriodData.reduce((s, d) => s + d.averageSession, 0) / previousPeriodData.length
        : 0;

    return [
      {
        icon: UserPlus,
        title: "New Registrations",
        value: totalRegistrations.toLocaleString(),
        change: calcChange(totalRegistrations, prevRegistrations),
        color: "",
      },
      {
        icon: Users,
        title: "Active Users",
        value: totalActiveUsers.toLocaleString(),
        change: calcChange(totalActiveUsers, prevActiveUsers),
        color: "",
      },
      {
        icon: Activity,
        title: "User Retention",
        value: `${avgRetention.toFixed(1)}%`,
        change: calcChange(avgRetention, prevRetention),
        color: "",
      },
      {
        icon: Clock,
        title: "Avg Session Time",
        value: `${Math.floor(avgSessionCurrent)}m ${Math.round(
          (avgSessionCurrent % 1) * 60
        )}s`,
        change: calcChange(avgSessionCurrent, avgSessionPrevious),
        color: "",
      },
    ];
  }, [users, currentData, analyticsData, dateRange]);

  // Prepare chart data using useMemo
  const chartData = useMemo(() => {
    return currentData.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      newRegistrations: d.newRegistrations,
      activeUsers: d.activeUsers,
      userRetention: d.userRetention,
      averageSession: d.averageSession,
    }));
  }, [currentData]);

  // Send data to parent using useEffect with proper dependencies
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        topProducts: currentData,
        summary: analyticsSummary,
      });
    }
  }, [currentData, analyticsSummary, onDataUpdate]);

  // Add a check to ensure we have data to display
  const hasData = users.length > 0;

  return (
    <div className="bg-gradient-to-br from-background via-background to-primary/5 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-blue-100">
              <Users size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                User Analytics
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                Track user growth, engagement, and retention metrics
              </p>
            </div>
          </div>
          {dateRange && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 w-fit">
              <Calendar size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">{dateRange}</span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !hasData ? (
          <div className="bg-card border border-border/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle size={32} className="text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">
              No user data available
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsSummary.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border border-opacity-20 rounded-2xl p-6 hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}
                      >
                        <Icon size={24} className="text-foreground" />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            stat.change.positive ? "bg-emerald-500" : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              Math.abs(
                                parseFloat(stat.change.value.replace("%", ""))
                              ),
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <p
                      className={`text-xs font-semibold mt-2 ${
                        stat.change.positive
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      vs previous: {stat.change.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registrations & Active Users */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" />
                  User Growth Trend
                </h2>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="newRegistrations"
                        stroke="var(--primary)"
                        fillOpacity={1}
                        fill="url(#colorReg)"
                        name="New Registrations"
                      />
                      <Area
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#7c3aed"
                        fillOpacity={1}
                        fill="url(#colorActive)"
                        name="Active Users"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>

              {/* Retention & Session Time */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  Engagement Metrics
                </h2>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="var(--muted-foreground)"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="right"
                        dataKey="userRetention"
                        fill="#10b981"
                        name="Retention %"
                        radius={[8, 8, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="averageSession"
                        stroke="#f59e0b"
                        name="Avg Session (min)"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Data Table */}
            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-4">
                <h2 className="text-lg font-bold text-foreground">Detailed Analytics</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                      <th className="text-left p-4 font-bold">Date</th>
                      <th className="text-center p-4 font-bold">New Registrations</th>
                      <th className="text-center p-4 font-bold">Active Users</th>
                      <th className="text-center p-4 font-bold">Retention %</th>
                      <th className="text-center p-4 font-bold">Avg Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.slice(0, 10).map((row, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-border/30 transition-colors ${
                          idx % 2 === 0
                            ? "bg-white hover:bg-primary/5"
                            : "bg-muted/30 hover:bg-primary/5"
                        }`}
                      >
                        <td className="p-4 text-foreground font-medium">{row.date}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex px-2.5 py-1 rounded-full bg-blue-50 text-primary font-semibold text-sm">
                            {row.newRegistrations}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold text-sm">
                            {row.activeUsers}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-emerald-600">
                          {row.userRetention.toFixed(1)}%
                        </td>
                        <td className="p-4 text-center text-foreground">
                          {Math.floor(row.averageSession)}m{" "}
                          {Math.round((row.averageSession % 1) * 60)}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersReport;
