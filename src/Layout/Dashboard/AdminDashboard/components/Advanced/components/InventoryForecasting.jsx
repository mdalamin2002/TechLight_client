import React, { useState } from "react";

const InventoryForecasting = () => {
  const [threshold, setThreshold] = useState(10);
  const [forecastPeriod, setForecastPeriod] = useState(30);

  const lowStockProducts = [
    { product: "iPhone 15 Pro", stock: 5, days: 3, action: "Reorder" },
    { product: "MacBook Pro", stock: 2, days: 1, action: "Urgent" },
    { product: "AirPods Pro", stock: 8, days: 5, action: "Monitor" },
    { product: "iPad Air", stock: 12, days: 7, action: "Normal" },
  ];

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-900">Inventory Forecasting</h2>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Low Stock Alerts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-5 text-gray-600 font-medium">Product</th>
                <th className="py-3 px-5 text-gray-600 font-medium">Current Stock</th>
                <th className="py-3 px-5 text-gray-600 font-medium">Days Until Empty</th>
                <th className="py-3 px-5 text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-5 text-gray-800 font-medium">{item.product}</td>
                  <td className="py-3 px-5 text-gray-700">{item.stock}</td>
                  <td className="py-3 px-5 text-gray-700">{item.days}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-sm ${
                        item.action === "Urgent"
                          ? "bg-red-100 text-red-700"
                          : item.action === "Reorder"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.action === "Monitor"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecasting Settings */}
      <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Forecasting Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">Low Stock Threshold</label>
            <input
              type="number"
              className="border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">Forecast Period (days)</label>
            <input
              type="number"
              className="border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all duration-300">
            Save Forecasting Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryForecasting;
