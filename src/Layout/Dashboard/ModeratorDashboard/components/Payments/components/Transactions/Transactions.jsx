import React, { useEffect, useState } from "react";
import { Eye, Clock, CheckCircle, XCircle, Download } from "lucide-react";
import { CSVLink } from "react-csv";
import useAxiosSecure from "@/utils/useAxiosSecure";


const statusStyles = {
  pending: "text-yellow-600",
  success: "text-green-600",
  failed: "text-red-500",
  refunded: "text-blue-600",
};

const statusIcons = {
  pending: Clock,
  success: CheckCircle,
  failed: XCircle,
  refunded: CheckCircle,
};

const Transactions = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("28", payments)
  console.log(filter)
  // Fetch user payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosSecure.get("/payments");
    
 
        if (res.data) {

          setPayments(res.data);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [axiosSecure]);

  // Filter logic
  const filteredPayments =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);
console.log("58", filteredPayments)
  // Status counts
  const statusCounts = payments.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    { pending: 0, success: 0, failed: 0, refunded: 0 }
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading transactions...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Transaction Overview
        </h1>
        <CSVLink
          data={payments}
          filename={"transactions-report.csv"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Download size={18} /> Export CSV
        </CSVLink>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.keys(statusCounts).map((status) => {
          const Icon = statusIcons[status];
          const isActive = filter === status;
          return (
            <div
              key={status}
              onClick={() => setFilter(status)}
              className={`p-4 rounded-xl bg-white flex justify-between items-center cursor-pointer transition border ${
                isActive
                  ? "border-blue-500 shadow-md"
                  : "hover:shadow-sm border-gray-200"
              }`}
            >
              <div>
                <p className="text-gray-500 text-sm capitalize">{status}</p>
                <p className="text-xl font-semibold">{statusCounts[status]}</p>
              </div>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
                  status === "pending"
                    ? "bg-yellow-400"
                    : status === "success"
                    ? "bg-green-500"
                    : status === "failed"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <select
            className="border border-gray-300 rounded-lg p-2 w-44 text-gray-700 focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              {[
                "Transaction ID",
                "User",
                "Method",
                "Amount",
                "Status",
                "Date",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-sm font-semibold text-left"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length ? (
              filteredPayments.map((p, i) => {

                const Icon = statusIcons[p.status];
                return (
                  <tr
                    key={p._id || p.id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                    } hover:bg-indigo-100/70 text-left transition-colors`}
                  >
                    <td className="px-4 py-3 text-purple-500 font-medium">
                      {p.tran_id || p.id}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {p.customer?.name || p.user || "N/A"}
                    </td>
                    <td className="px-4 py-3 font-medium">{p.payment_method || p.method}</td>
                    <td className="px-4 py-3 font-medium">{p.total_amount || p.amount} BDT</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${statusStyles[p.status]}`}
                      >
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(p.createdAt || p.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
                        <Eye size={15} /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500 text-sm font-medium">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;