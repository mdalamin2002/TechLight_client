import React, { useState } from "react";

const NotificationsTab = () => {
  const [recipient, setRecipient] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const sendNotification = () => {
    if (!title || !message) return;
    alert(`Notification sent!\nRecipient: ${recipient}\nTitle: ${title}\nMessage: ${message}`);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="flex justify-center items-center h-full p-4">
      <div className="w-full max-w-md  rounded-xl shadow-lg p-6 space-y-4 text-black">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-500 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center">Send Notification</h2>
        <p className="text-sm text-center">
          Send mass notifications to users and sellers
        </p>

        {/* Recipient */}
        <div>
          <label className="block mb-1 font-medium">Recipient</label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 rounded border border-black text-black"
          >
            <option value="all">All Users</option>
            <option value="sellers">Sellers</option>
            <option value="users">Users</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
            className="w-full p-2 rounded border border-black text-black"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification message"
            rows={4}
            className="w-full p-2 rounded border border-black text-black"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={sendNotification}
          className="w-full bg-purple-500 hover:bg-purple-600 text-black py-2 rounded flex justify-center items-center gap-2 font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18a8 8 0 110 16 8 8 0 010-16zm.5 4h-1v6h1V8zm0 8h-1v2h1v-2z" />
          </svg>
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationsTab;
