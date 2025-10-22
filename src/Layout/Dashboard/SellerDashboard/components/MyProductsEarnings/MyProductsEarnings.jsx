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

     
    </div>
  );
};

export default MyProductsEarnings;
