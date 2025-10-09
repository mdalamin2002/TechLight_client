import React, { useState } from "react";

const fakeTickets = [
  { id: "TCK-1001", user: "Alice", issue: "Login problem", status: "Open" },
  { id: "TCK-1002", user: "Bob", issue: "Payment failed", status: "Resolved" },
  { id: "TCK-1003", user: "Charlie", issue: "Order not received", status: "Open" },
  { id: "TCK-1004", user: "Dana", issue: "Refund request", status: "Open" },
];

const SupportTicketsTab = () => {
  const [tickets, setTickets] = useState(fakeTickets);

  const respondTicket = (id) => {
    alert(`Respond to Ticket ID: ${id}`);
  };

  const closeTicket = (id) => {
    setTickets(
      tickets.map((t) =>
        t.id === id ? { ...t, status: "Resolved" } : t
      )
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-3 border-b">Ticket ID</th>
            <th className="p-3 border-b">User</th>
            <th className="p-3 border-b">Issue</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{ticket.id}</td>
              <td className="p-3 border-b">{ticket.user}</td>
              <td className="p-3 border-b">{ticket.issue}</td>
              <td className="p-3 border-b">{ticket.status}</td>
              <td className="p-3 border-b space-x-2">
                <button
                  onClick={() => respondTicket(ticket.id)}
                  className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Respond
                </button>
                <button
                  onClick={() => closeTicket(ticket.id)}
                  className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Close
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupportTicketsTab;
