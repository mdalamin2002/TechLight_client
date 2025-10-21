import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Download,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const SalesReport = ({ dateRange, onDataUpdate }) => {
  const [salesPerformance, setSalesPerformance] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/SalesReport_SalesPerformance_Data.json").then((r) => r.json()),
      fetch("/SalesReport_TopProducts_Data.json").then((r) => r.json()),
    ])
      .then(([sales, products]) => {
        console.log(sales,products);
        setSalesPerformance(sales);
        setTopProducts(products);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching sales data:", err);
        setError("Failed to load sales data");
      })
      .finally(() => setLoading(false));
  }, []);

  const filterByDate = (data) => {
    if (!dateRange) return data;
    const now = new Date();
    let cutoff = new Date(now);

    switch (dateRange) {
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

  const filteredSales = filterByDate(salesPerformance);
  const filteredProducts = filterByDate(topProducts);

  // Calculate stats
  const totalRevenue = filteredSales.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalOrders = filteredSales.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue =
    totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  const totalProductsSold = filteredProducts.reduce(
    (sum, item) => sum + item.sales,
    0
  );

  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        salesPerformance: filteredSales,
        topProducts: filteredProducts,
      });
    }
  }, [filteredSales, filteredProducts, onDataUpdate]);

  const COLORS = [
    "#0071e3",
    "#5a5af0",
    "#7c3aed",
    "#ec4899",
    "#f59e0b",
    "#10b981",
  ];

  return (
    <div className="bg-gradient-to-br from-background via-background to-primary/5 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-blue-100">
              <TrendingUp size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Sales Report
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                Analyze your sales performance and top products
              </p>
            </div>
          </div>
          {dateRange && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 w-fit">
              <Calendar size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {dateRange}
              </span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle
              size={18}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={ShoppingCart}
                label="Total Orders"
                value={totalOrders.toLocaleString()}
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                icon={Package}
                label="Products Sold"
                value={totalProductsSold.toLocaleString()}
                color="from-emerald-500 to-emerald-600"
              />
              <StatCard
                icon={TrendingUp}
                label="Avg Order Value"
                value={`$${avgOrderValue}`}
                color="from-amber-500 to-amber-600"
              />
            </div>

            {/* Sales Performance */}
            <div className="mb-8">
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <TrendingUp size={24} className="text-primary" />
                  Sales Performance
                </h2>

                {filteredSales.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle
                      size={32}
                      className="text-muted-foreground mb-3"
                    />
                    <p className="text-muted-foreground font-medium">
                      No data available for {dateRange}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Line Chart */}
                    <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={filteredSales}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border)"
                          />
                          <XAxis
                            dataKey="month"
                            stroke="var(--muted-foreground)"
                          />
                          <YAxis stroke="var(--muted-foreground)" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "8px",
                            }}
                            formatter={(value) => `$${value.toLocaleString()}`}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            dot={{ fill: "var(--primary)", r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Sales Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredSales.map((item) => (
                        <div
                          key={item.key}
                          className="bg-gradient-to-br from-primary/10 to-blue-50 border border-primary/20 p-4 rounded-xl hover:shadow-md transition-all"
                        >
                          <h4 className="text-sm text-muted-foreground font-medium mb-2">
                            {item.month}
                          </h4>
                          <p className="text-2xl font-bold text-foreground">
                            ${item.revenue.toLocaleString()}
                          </p>
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>{item.orders} orders</span>
                            <span className="text-primary font-semibold">
                              Avg: ${item.avg}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Products Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Table */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Package size={20} className="text-primary" />
                      Top Selling Products
                    </h2>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center p-6">
                      <AlertCircle
                        size={32}
                        className="text-muted-foreground mb-3"
                      />
                      <p className="text-muted-foreground font-medium">
                        No product data for {dateRange}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                            <th className="text-left p-4 font-bold">Product</th>
                            <th className="text-center p-4 font-bold">Sales</th>
                            <th className="text-right p-4 font-bold">
                              Revenue
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((p, index) => (
                            <tr
                              key={p.key}
                              className={`border-b border-border/30 transition-colors ${
                                index % 2 === 0
                                  ? "bg-white hover:bg-primary/5"
                                  : "bg-muted/30 hover:bg-primary/5"
                              }`}
                            >
                              <td className="p-4 text-foreground font-medium">
                                {p.name}
                              </td>
                              <td className="p-4 text-center text-muted-foreground">
                                <span className="inline-flex px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                  {p.sales}
                                </span>
                              </td>
                              <td className="p-4 text-right font-bold text-primary">
                                ${p.revenue.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue Distribution Chart */}
              <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-4">
                  <h2 className="text-lg font-bold text-foreground">
                    Revenue Distribution
                  </h2>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="flex items-center justify-center h-80">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={filteredProducts.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name.substring(0, 10)} ${(percent * 100).toFixed(
                            0
                          )}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {filteredProducts.slice(0, 6).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className={`group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out`}
    style={{ borderColor: `` }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-primary/10`}>
        <Icon size={24} className="text-primary" />
      </div>
    </div>
    <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
    <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
  </div>
);

export default SalesReport;
