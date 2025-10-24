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

const SalesAnalytics = ({ sellerId }) => {
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Dummy API simulation — replace with your backend route
        // const res = await fetch(`/api/seller/${sellerId}/analytics`);
        // const data = await res.json();

        // 👉 Generate dynamic last 7 months labels
        const months = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = d.toLocaleString("default", { month: "short" });
          months.push(monthName);
        }

        // 👉 Generate dummy data based on those months
        const chart = months.map((m) => ({
          month: m,
          sales: Math.floor(Math.random() * 3000) + 1000, // random sales
          orders: Math.floor(Math.random() * 100) + 20, // random orders
        }));

        // 👉 Dummy recent orders
        const orders = [
          {
            id: "ORD-1024",
            product: "Wireless Headphones",
            date: "Oct 15, 2025",
            status: "Delivered",
            price: "$89",
          },
          {
            id: "ORD-1025",
            product: "Gaming Mouse",
            date: "Oct 16, 2025",
            status: "Shipped",
            price: "$49",
          },
          {
            id: "ORD-1026",
            product: "Mechanical Keyboard",
            date: "Oct 18, 2025",
            status: "Pending",
            price: "$75",
          },
        ];

        setChartData(chart);
        setRecentOrders(orders);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchAnalytics();
  }, [sellerId]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Sales Analytics & Recent Orders
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Analytics, charts, and recent order summaries appear here.
      </p>

      {/* Sales Chart */}
      <div className="h-72 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
            <YAxis tick={{ fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "10px",
                border: "1px solid #eee",
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
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
                    order.status === "Delivered"
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
  </div>
);

export default SalesAnalytics;
