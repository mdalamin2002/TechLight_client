import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";
// import useAxiosSecure from "@/utils/useAxiosSecure";

const SupportTicketsTab = () => {
  const axiosSecure = useAxiosSecure();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axiosSecure.get("/support/user/all");
        setTickets(res.data);
      } catch (error) {
        console.error("❌ Failed to load tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [axiosSecure]);

  // ✅ Respond to a ticket
  const respondTicket = async (id) => {
    const message = prompt("Enter your response to this ticket:");
    if (!message) return;

    try {
      await axiosSecure.patch(`/support/user/${id}`, { response: message });
      alert("Response sent successfully!");
    } catch (error) {
      console.error("❌ Failed to send response:", error);
    }
  };

  // ✅ Close ticket
  const closeTicket = async (id) => {
    try {
      await axiosSecure.patch(`/support/user/${id}`, { status: "Resolved" });
      setTickets(
        tickets.map((t) =>
          t._id === id ? { ...t, status: "Resolved" } : t
        )
      );
    } catch (error) {
      console.error("❌ Failed to close ticket:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">All Support Tickets</h2>

      {tickets.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No tickets found.</p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-left">
              <th className="p-3 border-b">Ticket ID</th>
              <th className="p-3 border-b">User</th>
              <th className="p-3 border-b">Subject</th>
              <th className="p-3 border-b">Priority</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-3 border-b text-gray-800 font-medium">
                  {ticket.ticketId}
                </td>
                <td className="p-3 border-b">{ticket.user || "Anonymous"}</td>
                <td className="p-3 border-b">{ticket.subject}</td>
                <td className="p-3 border-b">{ticket.priority}</td>
                <td
                  className={`p-3 border-b font-semibold ${
                    ticket.status === "Resolved"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {ticket.status}
                </td>
                <td className="p-3 border-b space-x-2">
                  <button
                    onClick={() => respondTicket(ticket._id)}
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Respond
                  </button>
                  <button
                    onClick={() => closeTicket(ticket._id)}
                    disabled={ticket.status === "Resolved"}
                    className={`px-3 py-1 rounded text-white transition ${
                      ticket.status === "Resolved"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SupportTicketsTab;
