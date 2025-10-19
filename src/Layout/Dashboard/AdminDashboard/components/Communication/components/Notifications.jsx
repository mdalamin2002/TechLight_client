import React, { useState, useEffect } from "react";
import { Bell, Send, Mail, } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Notifications = () => {
  const axiosSecure = useAxiosSecure();
  const [recipient, setRecipient] = useState("users");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await axiosSecure.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Failed to load notifications" });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "Subject and message are required!" });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await axiosSecure.post("/notifications/send", {
        recipient,
        subject,
        message,
      });

      fetchNotifications();
      setSubject("");
      setMessage("");
      setFeedback({ type: "success", text: res.data.message });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Failed to send notification" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto my-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <Bell className="w-5 h-5 text-gray-500" />
          Mass Notifications
        </h3>
      </div>

      {feedback && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            feedback.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Form */}
      <div className="mb-6 bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
        <div>
          <label className="block text-sm mb-2 text-gray-700">Recipient Type</label>
          <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-6">
            {[
              { label: "users", },
              { label: "moderator",},
            ].map(({ label, }) => (
              <label key={label} className="cursor-pointer font-semibold">
                <input
                  type="radio"
                  name="recipient"
                  value={label}
                  checked={recipient === label}
                  onChange={() => setRecipient(label)}
                />
                <span className="pl-1">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm mb-2 text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter notification subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">Message</label>
          <textarea
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSend}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <Send className="w-4 h-4" />
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications yet.</p>
        ) : (
          notifications.map((n, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
              <h4 className="text-gray-800 font-medium text-sm">{n.subject}</h4>
              <p className="text-gray-600 text-sm mt-1">{n.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(n.createdAt).toLocaleString()} • {n.recipient}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
