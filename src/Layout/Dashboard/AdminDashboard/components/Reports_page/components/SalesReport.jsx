import React from "react";

const salesPerformance = [
  { month: "Jan 2024", revenue: "$45,000", orders: 320, avg: "$140.63" },
  { month: "Feb 2024", revenue: "$52,000", orders: 380, avg: "$136.84" },
  { month: "Mar 2024", revenue: "$48,000", orders: 350, avg: "$137.14" },
  { month: "Apr 2024", revenue: "$61,000", orders: 420, avg: "$145.24" },
];

const topProducts = [
  { name: "iPhone 15 Pro", sales: 245, revenue: "$244,755" },
  { name: "MacBook Pro", sales: 89, revenue: "$177,911" },
  { name: "AirPods Pro", sales: 156, revenue: "$38,844" },
  { name: "iPad Air", sales: 78, revenue: "$46,722" },
];

export const SalesReport = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {salesPerformance.map((item) => (
          <div
            key={item.month}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <h4 className="text-gray-500 font-medium">{item.month}</h4>
            <p className="text-2xl font-bold text-gray-900">{item.revenue}</p>
            <p className="text-gray-600 text-sm">{item.orders} orders</p>
            <p className="text-indigo-500 text-sm">Avg: {item.avg}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-gray-600">Product</th>
              <th className="text-left p-4 text-gray-600">Sales</th>
              <th className="text-left p-4 text-gray-600">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr
                key={p.name}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-gray-800">{p.name}</td>
                <td className="p-4 text-gray-600">{p.sales}</td>
                <td className="p-4 font-semibold text-indigo-600">{p.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
