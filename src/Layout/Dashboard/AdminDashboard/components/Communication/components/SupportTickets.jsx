import React, { useEffect, useState } from "react";
import {
  Eye,
  CheckCircle,
  Trash2,
  BarChart3,
  Filter,
  MessageSquare,
  Bell,
} from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch Tickets
  const fetchTickets = async () => {
    try {
      const res = await axiosSecure.get("/api/support");
      setTickets(res.data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ✅ Status Update Flow
  const handleStatusUpdate = async (id, nextStatus) => {
    try {
      await axiosSecure.patch(`/api/support/${id}`, { status: nextStatus });
      setTickets((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: nextStatus } : t))
      );
      alert(`Status updated to "${nextStatus}"`);
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/api/support/${id}`);
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  // ✅ Filter
  const filteredTickets =
    filterStatus === "All"
      ? tickets
      : tickets.filter((t) => t.status === filterStatus);

  // ✅ Reporting Summary
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const closed = tickets.filter((t) => t.status === "closed").length;

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="space-y-6">
      {/* 📊 Reporting Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-100 p-4 rounded-xl flex items-center gap-3">
          <BarChart3 className="text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Total Tickets</p>
            <p className="text-lg font-semibold">{total}</p>
          </div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl flex items-center gap-3">
          <MessageSquare className="text-yellow-600" />
          <div>
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-lg font-semibold">{inProgress}</p>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="text-lg font-semibold">{resolved}</p>
          </div>
        </div>
        <div className="bg-red-100 p-4 rounded-xl flex items-center gap-3">
          <Trash2 className="text-red-600" />
          <div>
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-lg font-semibold">{closed}</p>
          </div>
        </div>
      </div>

      {/* 🧭 Filter Section */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Support Tickets</h3>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="All">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="pending_customer">Pending Customer</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-medium text-gray-800">
                  {ticket.ticketId}
                </td>
                <td className="py-3 px-4">{ticket.user}</td>
                <td className="py-3 px-4">{ticket.subject}</td>
                <td className="py-3 px-4">{ticket.priority}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "open"
                        ? "bg-red-100 text-red-600"
                        : ticket.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : ticket.status === "pending_customer"
                        ? "bg-orange-100 text-orange-600"
                        : ticket.status === "resolved"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="py-3 px-4">{ticket.date}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition">
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Status Change Buttons */}
                  {ticket.status !== "resolved" &&
                    ticket.status !== "closed" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            ticket._id,
                            getNextStatus(ticket.status)
                          )
                        }
                        className="p-2 bg-blue-100 rounded hover:bg-blue-200 transition"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </button>
                    )}

                  <button
                    onClick={() => handleDelete(ticket._id)}
                    className="p-2 bg-red-100 rounded hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTickets.length === 0 && (
          <p className="text-center py-6 text-gray-500">No tickets found.</p>
        )}
      </div>
    </div>
  );
};

// ✅ Status Flow Helper Function
const getNextStatus = (current) => {
  const flow = ["open", "in_progress", "pending_customer", "resolved", "closed"];
  const index = flow.indexOf(current);
  return flow[index + 1] || "closed";
};

export default SupportTickets;
