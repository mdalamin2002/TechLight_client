import React, { useState } from "react";
import { Megaphone, Mail, Bell, Tag, Plus, Edit, Trash2 } from "lucide-react";

// ================= Announcements Component =================
const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Big Sale Coming!",
      desc: "Get ready for our mega discount week!",
      img: "https://via.placeholder.com/150",
      date: "2025-09-28",
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    desc: "",
    img: "",
    date: "",
    status: "Active",
  });

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update announcement
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAnnouncements(
        announcements.map((a) =>
          a.id === editingId ? { ...a, ...form, id: editingId } : a
        )
      );
    } else {
      setAnnouncements([
        ...announcements,
        { ...form, id: Date.now() },
      ]);
    }
    setForm({ title: "", desc: "", img: "", date: "", status: "Active" });
    setEditingId(null);
    setShowForm(false);
  };

  // Edit announcement
  const handleEdit = (a) => {
    setForm(a);
    setEditingId(a.id);
    setShowForm(true);
  };

  // Delete announcement
  const handleDelete = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Announcements</h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm({
              title: "",
              desc: "",
              img: "",
              date: "",
              status: "Active",
            });
          }}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg shadow-md hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 border p-4 rounded-lg mb-4 bg-gray-50"
        >
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="desc"
            value={form.desc}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="img"
            value={form.img}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg"
          >
            {editingId ? "Update Announcement" : "Add Announcement"}
          </button>
        </form>
      )}

      {/* Announcement List */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="p-4 border rounded-lg flex items-center gap-4"
          >
            {a.img && (
              <img
                src={a.img}
                alt={a.title}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold">{a.title}</h4>
              <p className="text-sm text-gray-600">{a.desc}</p>
              <p className="text-xs text-gray-400">
                {a.date} | {a.status}
              </p>
            </div>
            <button
              onClick={() => handleEdit(a)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(a.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= Communication Center =================
const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState("Announcements");

  const tabs = [
    { name: "Announcements", icon: <Megaphone className="w-4 h-4" /> },
    { name: "Support Tickets", icon: <Mail className="w-4 h-4" /> },
    { name: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { name: "Coupons", icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Communication Center
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage announcements, support tickets, and customer communications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.name
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "Announcements" && <Announcements />}
        {activeTab === "Support Tickets" && (
          <div className="p-6 bg-white rounded-xl shadow">Support Tickets</div>
        )}
        {activeTab === "Notifications" && (
          <div className="p-6 bg-white rounded-xl shadow">Notifications</div>
        )}
        {activeTab === "Coupons" && (
          <div className="p-6 bg-white rounded-xl shadow">Coupons</div>
        )}
      </div>
    </div>
  );
};

export default CommunicationCenter;
