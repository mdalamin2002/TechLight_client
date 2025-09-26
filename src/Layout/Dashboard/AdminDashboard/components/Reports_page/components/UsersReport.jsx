import React from "react";

const analyticsData = [
  { title: "New Registrations", value: "1,250", change: "+27.6%", color: "green" },
  { title: "Active Users", value: "8,450", change: "+7.1%", color: "green" },
  { title: "User Retention", value: "68%", change: "+3%", color: "green" },
  { title: "Average Session", value: "12m 34s", change: "+6.9%", color: "green" },
];

export const UsersReport = () => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">User Analytics</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {analyticsData.map((item) => {
        // Extract numeric change for bar width
        const numericChange = parseFloat(item.change.replace("%", ""));
        const barWidth = Math.min(Math.abs(numericChange), 100); // Max 100%
        return (
          <div
            key={item.title}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <h4 className="text-gray-500 text-sm font-medium">{item.title}</h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
            <div className="mt-2">
              {/* Bar chart */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    item.color === "green" ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>
              <p
                className={`text-sm font-medium mt-1 ${
                  item.color === "green" ? "text-green-600" : "text-red-600"
                }`}
              >
                vs last month: {item.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
