import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Mail,
  Users,
  ShieldAlert,
  Clock,
  Trash2,
  AlertCircle,
  CheckCircle,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Notifications = () => {
  const axiosSecure = useAxiosSecure();
  const [recipient, setRecipient] = useState("users");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setFetchLoading(true);
    try {
      const res = await axiosSecure.get("/notifications");
      setNotifications(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications!");
      toast.error("Failed to load notifications");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Subject and message are required!",
        customClass: {
          popup: "rounded-2xl",
        },
      });
      return;
    }

    if (subject.length < 5 || message.length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Message Too Short",
        text: "Subject should be at least 5 characters and message at least 10 characters.",
        customClass: {
          popup: "rounded-2xl",
        },
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axiosSecure.post("/notifications/send", {
        recipient,
        subject,
        message,
      });

      toast.success("Notification sent successfully!");
      fetchNotifications();
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notification");
      setError("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Notification?",
      text: "This action cannot be undone.",
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
          await axiosSecure.delete(`/notifications/${id}`);
          setNotifications(notifications.filter((n) => n._id !== id));
          toast.success("Notification deleted!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete notification");
        }
      }
    });
  };

  const getRecipientIcon = (type) => {
    return type === "moderator" ? (
      <ShieldAlert size={16} />
    ) : (
      <Users size={16} />
    );
  };

  const getRecipientColor = (type) => {
    return type === "moderator"
      ? "bg-purple-50 border-purple-200 text-purple-700"
      : "bg-blue-50 border-blue-200 text-blue-700";
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <Bell size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Mass Notifications
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Send notifications to users and moderators
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle
              size={18}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
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

        {/* Form Section */}
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Send size={20} className="text-primary" />
            Send New Notification
          </h3>

          {/* Recipient Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Send To
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { value: "users", label: "Users", icon: Users },
                { value: "moderator", label: "Moderators", icon: ShieldAlert },
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex-1 relative cursor-pointer transition-all`}
                >
                  <input
                    type="radio"
                    name="recipient"
                    value={value}
                    checked={recipient === value}
                    onChange={() => setRecipient(value)}
                    className="absolute opacity-0"
                  />
                  <div
                    className={`p-4 rounded-xl border-2 flex items-center gap-2 font-medium transition-all ${
                      recipient === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-background text-muted-foreground hover:border-border"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Subject Input */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Mail size={16} className="text-primary" />
              Subject
            </label>
            <input
              type="text"
              placeholder="Enter notification subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={100}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground placeholder:text-muted-foreground text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {subject.length}/100 characters
            </p>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              Message
            </label>
            <textarea
              placeholder="Enter your notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={5}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground placeholder:text-muted-foreground text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30"></div>

        {/* Notifications History */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            Recent Notifications
          </h3>

          {fetchLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Bell size={32} className="text-muted-foreground" />
              </div>
              <h4 className="text-foreground font-semibold mb-1">
                No notifications yet
              </h4>
              <p className="text-muted-foreground text-sm">
                Send your first notification to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className="group p-4 border border-border/50 rounded-xl hover:bg-muted/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-bold text-foreground">
                          {n.subject}
                        </h4>
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${getRecipientColor(
                            n.recipient
                          )}`}
                        >
                          {getRecipientIcon(n.recipient)}
                          {n.recipient === "moderator" ? "Moderators" : "Users"}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 break-words">
                        {n.message}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
