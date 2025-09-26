import React from "react";
import { Edit, Trash2, Plus } from "lucide-react";

const Announcements = () => {
  const announcements = [
    {
      title: "New Year Sale - 50% Off",
      desc: "Celebrate the new year with amazing discounts on all products!",
      date: "2024-01-01",
      status: "Active",
    },
    {
      title: "System Maintenance Notice",
      desc: "We will be performing scheduled maintenance to improve system performance.",
      date: "2024-01-15",
      status: "Scheduled",
    },
    {
      title: "New Payment Method Added",
      desc: "We now accept cryptocurrency payments for faster transactions.",
      date: "2024-01-10",
      status: "Active",
    },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Global Announcements</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-shadow shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md transition"
          >
            {/* Content */}
            <div className="flex-1">
              <h4 className="text-gray-800 font-medium text-lg">{a.title}</h4>
              <p className="text-gray-500 mt-1">{a.desc}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span>{a.date}</span>
                <span
                  className={`flex items-center gap-2 font-medium ${
                    a.status === "Active"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      a.status === "Active"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  ></span>
                  {a.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition shadow-sm hover:shadow-md">
                <Edit className="w-4 h-4 text-blue-500" />
              </button>
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition shadow-sm hover:shadow-md">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
