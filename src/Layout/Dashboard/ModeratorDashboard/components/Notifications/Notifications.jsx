import React, { useState } from "react";

const Notifications = () => {
  const [recipient, setRecipient] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Fake notification history
  const [history, setHistory] = useState([
    { id: 1, recipient: "All Users", title: "Welcome", date: "2025-10-01", status: "Sent" },
    { id: 2, recipient: "Sellers", title: "New Policy", date: "2025-10-03", status: "Sent" },
    { id: 3, recipient: "Users", title: "Maintenance Notice", date: "2025-10-05", status: "Pending" },
  ]);

  const sendNotification = () => {
    if (!title || !message) return alert("Please fill title and message.");
    const newNotification = {
      id: history.length + 1,
      recipient: recipient === "all" ? "All Users" : recipient.charAt(0).toUpperCase() + recipient.slice(1),
      title,
      date: new Date().toISOString().split("T")[0],
      status: "Sent",
    };
    setHistory([newNotification, ...history]);
    setTitle("");
    setMessage("");
    alert("Notification sent!");
  };

  const statusColors = {
    Sent: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>

      {/* Send Mass Notification */}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Mass Notification</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Users</option>
              <option value="sellers">Sellers</option>
              <option value="users">Users</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              rows={4}
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={sendNotification}
            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
          >
            Send Notification
          </button>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Recipient</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((note) => (
                <tr key={note.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{note.id}</td>
                  <td className="p-3">{note.recipient}</td>
                  <td className="p-3">{note.title}</td>
                  <td className="p-3">{note.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColors[note.status]}`}
                    >
                      {note.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
