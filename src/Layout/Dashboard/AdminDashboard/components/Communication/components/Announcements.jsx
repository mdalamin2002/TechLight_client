import React, { useEffect, useState, useRef } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/announcements";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const titleRef = useRef();
  const descRef = useRef();
  const statusRef = useRef();
  const dateRef = useRef();

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setAnnouncements(res.data);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Open modal for add/edit
  const openModal = (announcement = null) => {
    setEditing(announcement);
    setShowModal(true);
    setTimeout(() => {
      titleRef.current?.focus();
    }, 100);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: titleRef.current.value,
      desc: descRef.current.value,
      status: statusRef.current.value,
      date: dateRef.current.value,
    };

    try {
      if (editing) {
        // update
        const res = await axios.put(`${API_URL}/${editing._id}`, data);
        setAnnouncements((prev) =>
          prev.map((a) => (a._id === editing._id ? res.data : a))
        );
      } else {
        // create
        const res = await axios.post(API_URL, data);
        setAnnouncements((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save announcement");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete announcement");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Global Announcements</h3>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-shadow shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a._id}
            className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md transition"
          >
            <div className="flex-1">
              <h4 className="text-gray-800 font-medium text-lg">{a.title}</h4>
              <p className="text-gray-500 mt-1">{a.desc}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span>{a.date}</span>
                <span
                  className={`flex items-center gap-2 font-medium ${
                    a.status === "Active" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      a.status === "Active" ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  ></span>
                  {a.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => openModal(a)}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition shadow-sm hover:shadow-md"
              >
                <Edit className="w-4 h-4 text-blue-500" />
              </button>
              <button
                onClick={() => handleDelete(a._id)}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">
              {editing ? "Edit Announcement" : "New Announcement"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                ref={titleRef}
                type="text"
                defaultValue={editing?.title || ""}
                placeholder="Title"
                required
                className="w-full border p-3 rounded-lg"
              />
              <textarea
                ref={descRef}
                defaultValue={editing?.desc || ""}
                placeholder="Description"
                required
                className="w-full border p-3 rounded-lg"
                rows={3}
              />
              <input
                ref={dateRef}
                type="date"
                defaultValue={editing?.date || ""}
                required
                className="w-full border p-3 rounded-lg"
              />
              <select
                ref={statusRef}
                defaultValue={editing?.status || "Active"}
                className="w-full border p-3 rounded-lg"
              >
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
              </select>
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-gray-800 text-white rounded-lg font-semibold"
              >
                {editing ? "Update" : "Add"} Announcement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
