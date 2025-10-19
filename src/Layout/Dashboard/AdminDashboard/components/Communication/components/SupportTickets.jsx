import React, { useEffect, useState } from "react";
import {
  Settings,
  X,
  Trash2,
  BarChart3,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  Clock,
  MoreVertical,
  Eye,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "@/utils/useAxiosSecure";

const SupportTickets = () => {
  const axiosSecure = useAxiosSecure();
  const [tickets, setTickets] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/support");
      setTickets(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets!");
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Delete ticket with SweetAlert confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Ticket?",
      text: "Are you sure you want to delete this support ticket? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      customClass: {
        popup: "rounded-2xl",
        header: "rounded-t-2xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/support/${id}`);
          setTickets(tickets.filter((t) => t._id !== id));
          toast.success("Ticket deleted successfully!");
          setOpenMenuId(null);
        } catch (err) {
          console.error("Error deleting ticket:", err);
          toast.error("Failed to delete ticket!");
        }
      }
    });
  };

  // Change status with toast notification
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/support/${id}`, { status: newStatus });
      setTickets(
        tickets.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
      );
      setDetailsModal({
        ...detailsModal,
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status!");
    }
  };

  // Summary counts
  const total = tickets.length;
  const pending = tickets.filter((t) => t.status === "Pending").length;
  const inProgress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "In Progress":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "Resolved":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={14} />;
      case "In Progress":
        return <TrendingUp size={14} />;
      case "Resolved":
        return <CheckCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <MessageSquare size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Support Tickets</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage customer support requests</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard
            icon={<BarChart3 size={20} />}
            label="Total"
            value={total}
            color="primary"
          />
          <SummaryCard
            icon={<Clock size={20} />}
            label="Pending"
            value={pending}
            color="amber"
          />
          <SummaryCard
            icon={<TrendingUp size={20} />}
            label="In Progress"
            value={inProgress}
            color="blue"
          />
          <SummaryCard
            icon={<CheckCircle size={20} />}
            label="Resolved"
            value={resolved}
            color="emerald"
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-muted/30 border-b border-border/30 px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by subject or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-sm font-medium min-w-[140px]"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-700 hover:text-red-900 mt-1 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t, i) => (
                  <tr
                    key={t._id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-indigo-50/30"
                    } hover:bg-indigo-100/50 transition-colors border-b border-border/30 last:border-b-0`}
                  >
                    <td className="px-6 py-4 font-semibold text-foreground text-sm">
                      {t.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusColor(
                          t.status
                        )}`}
                      >
                        {getStatusIcon(t.status)}
                        {t.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center relative group">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === t._id ? null : t._id)
                        }
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <MoreVertical size={18} className="text-muted-foreground" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === t._id && (
                        <div className="absolute right-0 top-10 bg-card border border-border rounded-lg shadow-lg w-40 z-10 overflow-hidden">
                          <button
                            onClick={() => {
                              setDetailsModal(t);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm font-medium text-foreground border-b border-border/30"
                          >
                            <Eye size={16} className="text-primary" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-sm font-medium text-red-600"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No tickets found
            </h3>
            <p className="text-muted-foreground text-sm text-center">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter"
                : "No support tickets yet"}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary/20 to-blue-50 border-b border-border/30 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Ticket Details</h3>
              <button
                onClick={() => setDetailsModal(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {detailsModal.subject}
                </h2>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="inline-flex px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium">
                    {detailsModal.category}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusColor(
                      detailsModal.status
                    )}`}
                  >
                    {getStatusIcon(detailsModal.status)}
                    {detailsModal.status}
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(detailsModal.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/30 pt-4">
                <h4 className="font-semibold text-foreground mb-3">Description</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {detailsModal.description}
                </p>
              </div>

              <div className="border-t border-border/30 pt-4">
                <h4 className="font-semibold text-foreground mb-3">Change Status</h4>
                <div className="flex flex-wrap gap-2">
                  {["Pending", "In Progress", "Resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(detailsModal._id, status)}
                      className={`px-4 py-2.5 rounded-lg font-semibold transition-all ${
                        detailsModal.status === status
                          ? "bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-md"
                          : "border border-border bg-background hover:bg-muted text-foreground"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/30">
                <button
                  onClick={() => setDetailsModal(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border border-border/50 ${colorClasses[color]}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default SupportTickets;
