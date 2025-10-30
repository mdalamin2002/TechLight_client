import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { Calendar } from "lucide-react";

const SalesAnalytics = () => {
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('7'); // Default to 7 days
  
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/payments/seller/analytics?period=${period}`);
        
        if (res.data.success) {
          setChartData(res.data.data.chartData);
          setRecentOrders(res.data.data.recentOrders);
        } else {
          setError("Failed to fetch analytics data");
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Sales Analytics & Recent Orders
            </h2>
            <p className="text-gray-500 text-sm">
              Loading analytics data...
            </p>
          </div>
          
          {/* Loading skeleton for period selector */}
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading skeleton for chart */}
        <div className="h-72 mb-8 bg-gray-100 rounded-xl animate-pulse"></div>
        
        {/* Loading skeleton for table */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="border-t">
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Sales Analytics & Recent Orders
            </h2>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header with period selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Sales Analytics & Recent Orders
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Analytics, charts, and recent order summaries appear here.
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            onClick={() => handlePeriodChange('7')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              period === '7'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => handlePeriodChange('30')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              period === '30'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => handlePeriodChange('365')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              period === '365'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="h-72 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: "#6b7280" }} 
              tickFormatter={(value) => {
                // For yearly data, show only month names
                if (period === '365') {
                  return value.split(' ')[0]; // Extract month name
                }
                return value;
              }}
            />
            <YAxis tick={{ fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "10px",
                border: "1px solid #eee",
              }}
              formatter={(value, name) => {
                if (name === 'sales') {
                  return [`$${value.toFixed(2)}`, 'Sales'];
                }
                return [value, name.charAt(0).toUpperCase() + name.slice(1)];
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              name="Sales"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
};

const RecentOrdersTable = ({ orders }) => (
  <div>
    <h3 className="text-md font-semibold text-gray-800 mb-3">Recent Orders</h3>
    {orders.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>No recent orders found</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-100 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-700">{order.id}</td>
                <td className="px-4 py-3 text-gray-600">{order.product}</td>
                <td className="px-4 py-3 text-gray-600">{order.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-800 font-semibold">
                  {order.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default SalesAnalytics;