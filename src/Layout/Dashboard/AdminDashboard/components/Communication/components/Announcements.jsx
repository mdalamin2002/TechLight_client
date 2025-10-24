import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, MoreVertical, Bell, Calendar, Badge, AlertCircle, CheckCircle } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Announcements = () => {
  const axiosSecure = useAxiosSecure();
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/announcements");
      setAnnouncements(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Add or Update Announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      title: e.target.title.value,
      desc: e.target.desc.value,
      date: e.target.date.value,
      status: e.target.status.value,
    };

    try {
      if (editingAnnouncement) {
        await axiosSecure.put(`/announcements/${editingAnnouncement._id}`, data);
      } else {
        await axiosSecure.post("/announcements", data);
      }
      setShowModal(false);
      setEditingAnnouncement(null);
      e.target.reset();
      fetchAnnouncements();
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError("Failed to save announcement!");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowModal(true);
    setOpenMenuId(null);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await axiosSecure.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
      setOpenMenuId(null);
      setError(null);
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Failed to delete announcement!");
    }
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       a.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    if (status === "Active") {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <CheckCircle size={14} className="text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">Active</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
        <Calendar size={14} className="text-amber-600" />
        <span className="text-xs font-semibold text-amber-700">Scheduled</span>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Bell size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Announcements</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage system announcements</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingAnnouncement(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/30 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all w-full md:w-auto"
          >
            <Plus size={18} />
            New Announcement
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-sm font-medium min-w-[150px]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
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
        ) : filteredAnnouncements.length > 0 ? (
          <div className="space-y-3">
            {filteredAnnouncements.map((a) => (
              <div
                key={a._id}
                className="group p-4 border border-border/50 rounded-xl hover:bg-muted/40 hover:border-border transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
                      {getStatusBadge(a.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{a.desc}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Menu Button */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === a._id ? null : a._id)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical size={18} className="text-muted-foreground" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === a._id && (
                      <div className="absolute right-0 top-10 bg-card border border-border rounded-lg shadow-lg w-40 z-10 overflow-hidden">
                        <button
                          onClick={() => handleEdit(a)}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm font-medium text-foreground border-b border-border/30"
                        >
                          <Edit size={16} className="text-primary" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-sm font-medium text-red-600"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Bell size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No announcements found</h3>
            <p className="text-muted-foreground text-sm text-center mb-6 max-w-sm">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter"
                : "Create your first announcement to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary/20 to-blue-50 border-b border-border/30 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAnnouncement(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingAnnouncement?.title || ""}
                  placeholder="Enter announcement title"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="desc"
                  defaultValue={editingAnnouncement?.desc || ""}
                  placeholder="Enter announcement details"
                  rows="4"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={editingAnnouncement?.date || ""}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingAnnouncement?.status || "Active"}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAnnouncement(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : editingAnnouncement
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
