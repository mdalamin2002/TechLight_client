import React from "react";

const sellersData = [
  { name: "TechStore", sales: 120, revenue: "$45,000" },
  { name: "GadgetHub", sales: 95, revenue: "$38,000" },
  { name: "MobileWorld", sales: 75, revenue: "$28,000" },
];

export const SellersReport = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Seller Report</h3>
    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="text-left p-4 text-gray-600">Seller</th>
          <th className="text-left p-4 text-gray-600">Sales</th>
          <th className="text-left p-4 text-gray-600">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {sellersData.map((seller) => (
          <tr
            key={seller.name}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <td className="p-4 text-gray-800">{seller.name}</td>
            <td className="p-4 text-gray-600">{seller.sales}</td>
            <td className="p-4 font-semibold text-indigo-600">{seller.revenue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
