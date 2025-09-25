import React from "react";

const sellersData = [
  { name: "Tech Store Pro", sales: 2450, revenue: "$245,000", rating: "4.8 ⭐" },
  { name: "Electronics World", sales: 1890, revenue: "$189,000", rating: "4.6 ⭐" },
  { name: "Fashion Hub", sales: 1560, revenue: "$156,000", rating: "4.7 ⭐" },
  { name: "Sports Central", sales: 890, revenue: "$89,000", rating: "4.2 ⭐" },
];

export const SellersReport = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Seller Performance</h3>
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 text-gray-600">Seller</th>
            <th className="text-left p-4 text-gray-600">Sales</th>
            <th className="text-left p-4 text-gray-600">Revenue</th>
            <th className="text-left p-4 text-gray-600">Rating</th>
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
              <td className="p-4 text-yellow-500 font-medium">{seller.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
