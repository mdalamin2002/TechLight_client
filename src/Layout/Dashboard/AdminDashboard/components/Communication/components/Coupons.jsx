import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, MoreVertical } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Announcements = () => {
  const axiosSecure = useAxiosSecure();
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // ✅ Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/announcements");
      setAnnouncements(res.data);
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

  // ✅ Add or Update Announcement
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

  // ✅ Edit
  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowModal(true);
    setOpenMenuId(null);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await axiosSecure.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Failed to delete announcement!");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Global Announcements
        </h2>
        <button
          onClick={() => {
            setEditingAnnouncement(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow-md transition"
        >
          <Plus className="w-5 h-5" /> New Announcement
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* List */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {announcements.length > 0 ? (
              announcements.map((a, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                  } hover:bg-indigo-100/70 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium ">
                    {a.title}
                  </td>
                  <td className="px-4 py-3 ">{a.desc}</td>
                  <td className="px-4 py-3 ">{a.date}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      a.status === "Active"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {a.status}
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === a._id ? null : a._id)
                      }
                      className="p-2 rounded-md hover:bg-indigo-50 text-indigo-700"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuId === a._id && (
                      <div className="absolute right-10 top-8 bg-white border shadow-lg rounded-lg z-10 w-36">
                        <button
                          onClick={() => handleEdit(a)}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-50 text-left text-sm text-blue-600"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-50 text-left text-sm text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-500 bg-gray-50 font-medium"
                >
                  No Announcements Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 p-2 rounded-full"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              {editingAnnouncement
                ? "Edit Announcement"
                : "Add New Announcement"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                defaultValue={editingAnnouncement?.title || ""}
                placeholder="Title"
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                name="desc"
                defaultValue={editingAnnouncement?.desc || ""}
                placeholder="Description"
                required
                rows="3"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
              <input
                type="date"
                name="date"
                defaultValue={editingAnnouncement?.date || ""}
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                name="status"
                defaultValue={editingAnnouncement?.status || "Active"}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition"
              >
                {loading
                  ? "Processing..."
                  : editingAnnouncement
                  ? "Update Announcement"
                  : "Add Announcement"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
