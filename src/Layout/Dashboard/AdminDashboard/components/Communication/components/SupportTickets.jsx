import React, { useState } from "react";
import { Eye, CheckCircle, Trash2 } from "lucide-react";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([
    {
      id: "TKT-001",
      user: "John Doe",
      subject: "Order not received",
      priority: "High",
      status: "Open",
      date: "2024-01-20",
    },
    {
      id: "TKT-002",
      user: "Jane Smith",
      subject: "Refund request",
      priority: "Medium",
      status: "In Progress",
      date: "2024-01-19",
    },
    {
      id: "TKT-003",
      user: "Mike Johnson",
      subject: "Account login issue",
      priority: "Low",
      status: "Resolved",
      date: "2024-01-18",
    },
  ]);

  const handleResolve = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "Resolved" } : t
      )
    );
  };

  const handleDelete = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">Support Tickets</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
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
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 text-gray-800 font-medium">{ticket.id}</td>
                <td className="py-3 px-4 text-gray-700">{ticket.user}</td>
                <td className="py-3 px-4 text-gray-700">{ticket.subject}</td>
                <td className="py-3 px-4 text-gray-700">{ticket.priority}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "Open"
                        ? "bg-red-100 text-red-600"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{ticket.date}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition">
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>
                  {ticket.status !== "Resolved" && (
                    <button
                      onClick={() => handleResolve(ticket.id)}
                      className="p-2 bg-green-100 rounded hover:bg-green-200 transition"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="p-2 bg-red-100 rounded hover:bg-red-200 transition"
                  >
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

export default SupportTickets;
