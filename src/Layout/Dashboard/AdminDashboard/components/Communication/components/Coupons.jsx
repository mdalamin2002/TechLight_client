import React, { useState } from "react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

const Coupons = () => {
  const [coupons, setCoupons] = useState([
    {
      code: "NEWYEAR50",
      discount: "50%",
      expiry: "2024-12-31",
      status: "Active",
    },
    {
      code: "WELCOME10",
      discount: "10%",
      expiry: "2024-06-30",
      status: "Expired",
    },
  ]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <Tag className="w-5 h-5 text-gray-500" />
          Coupon & Discount Management
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition">
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Expiry Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-semibold text-gray-800">
                  {c.code}
                </td>
                <td className="py-3 px-4 text-gray-600">{c.discount}</td>
                <td className="py-3 px-4 text-gray-600">{c.expiry}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded hover:bg-red-100 transition">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;
