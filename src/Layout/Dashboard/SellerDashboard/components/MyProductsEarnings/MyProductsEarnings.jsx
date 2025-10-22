import React, { useState } from "react";
import { Search, DollarSign, Calendar, Eye, X } from "lucide-react";

const MyProductsEarnings = () => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const products = [
    {
      id: 1,
      name: "Wireless Earbuds",
      image: "https://i.ibb.co/yYxZf5L/earbuds.jpg",
      sold: 120,
      earnings: 4800,
      status: "Completed",
      date: "2025-10-18",
    },
    {
      id: 2,
      name: "Smart Watch",
      image: "https://i.ibb.co/mDnV5Ps/smartwatch.jpg",
      sold: 85,
      earnings: 6800,
      status: "Pending",
      date: "2025-10-19",
    },
    {
      id: 3,
      name: "Gaming Mouse",
      image: "https://i.ibb.co/FxpHxZD/mouse.jpg",
      sold: 150,
      earnings: 7500,
      status: "Completed",
      date: "2025-10-21",
    },
    {
      id: 4,
      name: "Mechanical Keyboard",
      image: "https://i.ibb.co/sHZygdK/keyboard.jpg",
      sold: 60,
      earnings: 4200,
      status: "Pending",
      date: "2025-10-22",
    },
  ];

  // 🔍 Filter logic
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const inDateRange =
      (!dateRange.from || new Date(p.date) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(p.date) <= new Date(dateRange.to));
    return matchesSearch && inDateRange;
  });

  //Summary
  const totalSales = products.reduce((sum, p) => sum + p.earnings, 0);
  const pendingPayout = products
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.earnings, 0);
  const completedPayout = products
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.earnings, 0);
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl text-center">
          <DollarSign className="text-blue-600 mx-auto mb-2" size={28} />
          <h3 className="text-gray-600 text-sm">Total Sales</h3>
          <p className="text-2xl font-semibold text-blue-700">
            ${totalSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl text-center">
          <DollarSign className="text-yellow-600 mx-auto mb-2" size={28} />
          <h3 className="text-gray-600 text-sm">Pending Payout</h3>
          <p className="text-2xl font-semibold text-yellow-700">
            ${pendingPayout.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 p-5 rounded-2xl text-center">
          <DollarSign className="text-green-600 mx-auto mb-2" size={28} />
          <h3 className="text-gray-600 text-sm">Completed Payout</h3>
          <p className="text-2xl font-semibold text-green-700">
            ${completedPayout.toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl text-center">
          <Calendar className="text-purple-600 mx-auto mb-2" size={28} />
          <h3 className="text-gray-600 text-sm">Total Products Sold</h3>
          <p className="text-2xl font-semibold text-purple-700">{totalSold}</p>
        </div>
      </div>

      {/*Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 w-full sm:w-1/3">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-2 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/*  Earnings Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Sold</th>
              <th className="py-3 px-4">Earnings</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="py-3 px-4">{p.sold}</td>
                <td className="py-3 px-4 text-green-600 font-semibold">
                  ${p.earnings}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4">{p.date}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition mx-auto"
                  >
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🪟 Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative animate-fadeIn">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center space-y-3">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-24 h-24 rounded-xl object-cover border"
              />
              <h2 className="text-lg font-semibold">
                {selectedProduct.name}
              </h2>
              <div className="w-full text-sm space-y-2">
                <p>
                  <strong>Sold:</strong> {selectedProduct.sold}
                </p>
                <p>
                  <strong>Earnings:</strong> ${selectedProduct.earnings}
                </p>
                <p>
                  <strong>Status:</strong> {selectedProduct.status}
                </p>
                <p>
                  <strong>Date:</strong> {selectedProduct.date}
                </p>
                <p>
                  <strong>Commission (10%):</strong> $
                  {(selectedProduct.earnings * 0.1).toFixed(2)}
                </p>
                <p>
                  <strong>Net Payout:</strong> $
                  {(selectedProduct.earnings * 0.9).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsEarnings;
