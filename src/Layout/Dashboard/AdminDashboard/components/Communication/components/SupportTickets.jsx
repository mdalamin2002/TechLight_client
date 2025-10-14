import React, { useEffect, useState } from "react";
import { Settings, X, Trash2, BarChart3, CheckCircle, MessageSquare } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const SupportTickets = () => {
  const axiosSecure = useAxiosSecure();
  const [tickets, setTickets] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);
  const [error, setError] = useState(null);

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const res = await axiosSecure.get("/support");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets!");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Delete ticket
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axiosSecure.delete(`/support/${id}`);
      setTickets(tickets.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting ticket:", err);
      setError("Failed to delete ticket!");
    }
  };

  // Change status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/support/${id}`, { status: newStatus });
      fetchTickets();
    } catch (err) {
      console.error("Status update failed:", err);
      setError("Failed to update status!");
    }
  };

  // Summary counts
  const total = tickets.length;
  const pending = tickets.filter((t) => t.status === "Pending").length;
  const inProgress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl border border-gray-200 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Support Tickets</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard icon={<BarChart3 className="text-indigo-600" />} label="Total" value={total} color="indigo" />
        <SummaryCard icon={<MessageSquare className="text-yellow-600" />} label="Pending" value={pending} color="yellow" />
        <SummaryCard icon={<CheckCircle className="text-blue-600" />} label="In Progress" value={inProgress} color="blue" />
        <SummaryCard icon={<CheckCircle className="text-green-600" />} label="Resolved" value={resolved} color="green" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Tickets Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Subject</th>
              <th className="px-5 py-3 text-left font-semibold">Category</th>
              <th className="px-5 py-3 text-left font-semibold">Date</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length > 0 ? (
              tickets.map((t, i) => (
                <tr
                  key={t._id}
                  className={`transition-all ${i % 2 === 0 ? "bg-white" : "bg-indigo-50/30"} hover:bg-indigo-100/50`}
                >
                  <td className="px-5 py-3 font-medium text-gray-800">{t.subject}</td>
                  <td className="px-5 py-3 text-gray-600">{t.category}</td>
                  <td className="px-5 py-3 text-gray-500">{t.date}</td>
                  <td className={`px-5 py-3 font-semibold ${
                    t.status === "Pending"
                      ? "text-yellow-600"
                      : t.status === "Resolved"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}>
                    {t.status}
                  </td>
                  <td className="relative px-5 py-3 text-center">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === t._id ? null : t._id)}
                      className="p-2 rounded-md hover:bg-indigo-50 transition"
                    >
                      <Settings className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Dropdown */}
                    {openMenuId === t._id && (
                      <div className="absolute right-8 top-10 bg-white border border-gray-200 rounded-lg shadow-lg w-36 z-10">
                        <button
                          onClick={() => {
                            setDetailsModal(t);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500 bg-gray-50 font-medium">
                  No Support Tickets Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white max-w-lg w-full rounded-2xl p-8 relative shadow-2xl">
            <button
              onClick={() => setDetailsModal(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 p-2 rounded-full"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h3 className="text-2xl font-bold mb-4 text-gray-800">{detailsModal.subject}</h3>
            <p className="text-gray-700 mb-3"><strong>Category:</strong> {detailsModal.category}</p>
            <p className="text-gray-700 mb-3"><strong>Description:</strong> {detailsModal.description}</p>
            <p className="text-sm text-gray-500 mb-3"><strong>Date:</strong> {detailsModal.date}</p>
            <p className="text-sm mb-4">
              <strong>Status:</strong>{" "}
              <span className={`${detailsModal.status === "Pending" ? "text-yellow-600" : detailsModal.status === "Resolved" ? "text-green-600" : "text-blue-600"} font-semibold`}>
                {detailsModal.status}
              </span>
            </p>

            {/* Admin status control */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-2">Change Ticket Status:</h4>
              <div className="flex gap-3">
                {["Pending", "In Progress", "Resolved"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(detailsModal._id, s)}
                    className={`px-4 py-2 rounded-lg border font-medium transition ${
                      detailsModal.status === s ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-indigo-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, label, value, color }) => (
  <div className={`flex items-center gap-3 p-4 rounded-xl bg-${color}-100 shadow-sm`}>
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default SupportTickets;
