import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";

const SellerTicketSupport = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Order not received",
      description: "I placed an order 5 days ago but haven’t received it yet.",
      status: "Pending",
      createdAt: "2025-10-21",
    },
    {
      id: 2,
      title: "Payment issue",
      description: "Payment was deducted but order not confirmed.",
      status: "Resolved",
      createdAt: "2025-10-19",
    },
    {
      id: 3,
      title: "Product damaged",
      description: "Received the product damaged. Need replacement.",
      status: "In Progress",
      createdAt: "2025-10-20",
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      alert("Please fill all fields!");
      return;
    }
    setTickets([
      ...tickets,
      { id: Date.now(), createdAt: new Date().toLocaleDateString(), ...newTicket },
    ]);
    setNewTicket({ title: "", description: "", status: "Pending" });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Ticket Support</h1>
          <p className="text-gray-500">
            Submit a new ticket or view existing tickets for assistance.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" /> Create New Ticket
        </button>
      </div>

      {/* Ticket List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl shadow p-4 border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg">{ticket.title}</h2>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  ticket.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : ticket.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {ticket.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2 truncate">{ticket.description}</p>
            <p className="text-gray-400 text-xs mt-1">Created on: {ticket.createdAt}</p>
            <button
              onClick={() => {
                setSelectedTicket(ticket);
                setIsViewModalOpen(true);
              }}
              className="mt-4 w-full text-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create New Ticket</h2>
              <X
                className="cursor-pointer"
                onClick={() => setIsCreateModalOpen(false)}
              />
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Ticket Title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Description"
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows={4}
              ></textarea>
              <select
                value={newTicket.status}
                onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{selectedTicket.title}</h2>
              <X
                className="cursor-pointer"
                onClick={() => setIsViewModalOpen(false)}
              />
            </div>
            <p className="text-gray-500">{selectedTicket.description}</p>
            <p className="text-gray-400 text-sm mt-2">Created on: {selectedTicket.createdAt}</p>
            <span
              className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                selectedTicket.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : selectedTicket.status === "In Progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {selectedTicket.status}
            </span>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerTicketSupport;
