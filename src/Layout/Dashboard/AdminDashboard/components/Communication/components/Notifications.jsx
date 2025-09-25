import React, { useState } from "react";
import { Bell, Send, Users, Store, Mail, Star, UserX } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [recipient, setRecipient] = useState("All Users");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) return;

    const newNotification = {
      id: notifications.length + 1,
      recipient,
      subject,
      message,
      date: new Date().toISOString().split("T")[0],
    };

    setNotifications([newNotification, ...notifications]);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <Bell className="w-5 h-5 text-gray-500" />
          Mass Notifications
        </h3>
      </div>

      {/* Send Notification Form */}
      <div className="mb-6 bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
        {/* Recipient */}
        <div>
          <label className="block text-sm mb-2 text-gray-700">
            Recipient Type
          </label>
          <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-6">
            {/* All Users */}
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="radio"
                name="recipient"
                value="All Users"
                checked={recipient === "All Users"}
                onChange={() => setRecipient("All Users")}
              />
              <Users className="w-4 h-4 text-gray-500" />
              All Users
            </label>

            {/* Sellers */}
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="radio"
                name="recipient"
                value="Sellers"
                checked={recipient === "Sellers"}
                onChange={() => setRecipient("Sellers")}
              />
              <Store className="w-4 h-4 text-gray-500" />
              Sellers
            </label>

            {/* Premium Users */}
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="radio"
                name="recipient"
                value="Premium Users"
                checked={recipient === "Premium Users"}
                onChange={() => setRecipient("Premium Users")}
              />
              <Star className="w-4 h-4 text-yellow-500" />
              Premium Users
            </label>

            {/* Inactive Users */}
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="radio"
                name="recipient"
                value="Inactive Users"
                checked={recipient === "Inactive Users"}
                onChange={() => setRecipient("Inactive Users")}
              />
              <UserX className="w-4 h-4 text-red-500" />
              Inactive Users
            </label>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className=" text-sm mb-2 text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter notification subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm mb-2 text-gray-700">Message</label>
          <textarea
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            rows={4}
          />
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition"
          >
            <Send className="w-4 h-4" />
            Send Notification
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
            >
              <h4 className="text-gray-800 font-medium text-sm">{n.subject}</h4>
              <p className="text-gray-600 text-sm mt-1">{n.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {n.date} • {n.recipient}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
