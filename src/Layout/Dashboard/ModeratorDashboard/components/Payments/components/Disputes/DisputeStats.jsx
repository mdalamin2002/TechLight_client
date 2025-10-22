import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const statusIcons = {
  pending: Clock,
  resolved: CheckCircle,
  rejected: XCircle,
};

const DisputeStats = ({ statusCounts, setFilter }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {Object.entries(statusCounts).map(([status, count]) => {
        const Icon = statusIcons[status];
        const bgGradient =
          status === "pending"
            ? "from-yellow-50 to-yellow-100"
            : status === "resolved"
            ? "from-green-50 to-green-100"
            : "from-red-50 to-red-100";

        const borderColor =
          status === "pending"
            ? "border-yellow-200"
            : status === "resolved"
            ? "border-green-200"
            : "border-red-200";

        const textColor =
          status === "pending"
            ? "text-yellow-600"
            : status === "resolved"
            ? "text-green-600"
            : "text-red-600";

        return (
          <motion.div
            key={status}
            whileHover={{ scale: 1.03 }}
            onClick={() => setFilter(status)}
            className={`bg-gradient-to-br ${bgGradient} border ${borderColor} p-5 rounded-xl flex justify-between items-center shadow-sm cursor-pointer`}
          >
            <div>
              <p className="text-gray-600 text-sm capitalize">{status}</p>
              <h2 className="text-2xl font-bold text-gray-800">{count}</h2>
            </div>
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full border ${textColor}`}
            >
              <Icon size={24} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DisputeStats;
