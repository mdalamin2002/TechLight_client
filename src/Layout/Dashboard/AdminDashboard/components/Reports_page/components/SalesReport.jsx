

import React, { useEffect, useState } from "react";

export const SalesReport = ({ dateRange, onDataUpdate }) => {
  const [salesPerformance, setSalesPerformance] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/SalesReport_SalesPerformance_Data.json").then((r) => r.json()),
      fetch("/SalesReport_TopProducts_Data.json").then((r) => r.json()),
    ])
      .then(([sales, products]) => {
        setSalesPerformance(sales);
        setTopProducts(products);
      })
      .catch((err) => console.error("Error fetching sales data:", err));
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

  // 🟩 Send real data back to parent for export
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        salesPerformance: filteredSales,
        topProducts: filteredProducts,
      });
    }
  }, [filteredSales, filteredProducts, onDataUpdate]);

  return (
    <div className="space-y-8">
      {/* Sales Performance */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Sales Performance
        </h3>
        {filteredSales.length === 0 ? (
          <p className="text-gray-500 italic">No data available for {dateRange}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredSales.map((item) => (
              <div
                key={item.key}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h4 className="text-gray-500 font-medium">{item.month}</h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${item.revenue.toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm mt-1">{item.orders} orders</p>
                <p className="text-indigo-600 font-medium text-sm mt-1">
                  Avg: ${item.avg}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Products */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Top Selling Products
        </h3>
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 italic">No product data for {dateRange}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-gray-600 font-medium">Product</th>
                  <th className="text-left p-4 text-gray-600 font-medium">Sales</th>
                  <th className="text-left p-4 text-gray-600 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p.key}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-4 text-gray-800 font-medium">{p.name}</td>
                    <td className="p-4 text-gray-600">{p.sales}</td>
                    <td className="p-4 font-semibold text-indigo-600">
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
  );
};
