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
  UserCheck,
  Globe,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { useSocket } from "@/context/AuthContext/SocketContext/SocketContext";
import useAuth from "@/hooks/useAuth";

const Notifications = () => {
  const axiosSecure = useAxiosSecure();
  const { userData } = useAuth();
  const socket = useSocket();
  
  const [recipientType, setRecipientType] = useState("role");
  const [selectedRole, setSelectedRole] = useState("user");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users for specific selection
  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get("/users");
      setAllUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

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
    fetchUsers();
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

    if (recipientType === "specific" && selectedUsers.length === 0) {
      console.log(recipientType);
      Swal.fire({
        icon: "warning",
        title: "No Users Selected",
        text: "Please select at least one user to send notification.",
        customClass: {
          popup: "rounded-2xl",
        },
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        recipientType,
        subject,
        message,
        adminEmail: userData?.email || "admin"
      };

      if (recipientType === "role") {
        payload.role = selectedRole;
      } else if (recipientType === "specific") {
        payload.specificUsers = selectedUsers.map(u => ({
          userId: u._id,
          email: u.email,
          role: u.role
        }));
      }

      const res = await axiosSecure.post("/notifications/send", payload);

      toast.success(`Notification sent to ${res.data.recipientCount} user(s)!`);
      fetchNotifications();
      setSubject("");
      setMessage("");
      setSelectedUsers([]);
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

  const getRecipientIcon = (type, role) => {
    if (type === "all") return <Globe size={16} />;
    if (type === "specific") return <UserCheck size={16} />;
    if (type === "role") {
      if (role === "moderator") return <ShieldAlert size={16} />;
      if (role === "admin") return <ShieldAlert size={16} />;
      return <Users size={16} />;
    }
    return <Users size={16} />;
  };

  const getRecipientColor = (type, role) => {
    if (type === "all") return "bg-green-50 border-green-200 text-green-700";
    if (type === "specific") return "bg-orange-50 border-orange-200 text-orange-700";
    if (type === "role") {
      if (role === "moderator") return "bg-purple-50 border-purple-200 text-purple-700";
      if (role === "admin") return "bg-red-50 border-red-200 text-red-700";
      return "bg-blue-50 border-blue-200 text-blue-700";
    }
    return "bg-blue-50 border-blue-200 text-blue-700";
  };

  const getRecipientLabel = (notification) => {
    if (notification.recipientType === "all") return "All Users";
    if (notification.recipientType === "specific") {
      const count = notification.specificUsers?.length || 0;
      return `${count} User${count !== 1 ? 's' : ''}`;
    }
    if (notification.recipientType === "role") {
      if (notification.role === "moderator") return "Moderators";
      if (notification.role === "admin") return "Admins";
      return "Users";
    }
    return "Unknown";
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
              Send targeted notifications to specific users or groups
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

          {/* Recipient Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Recipient Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: "role", label: "By Role", icon: Users },
                { value: "specific", label: "Specific Users", icon: UserCheck },
                { value: "all", label: "All Users", icon: Globe },
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className="relative cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    name="recipientType"
                    value={value}
                    checked={recipientType === value}
                    onChange={() => setRecipientType(value)}
                    className="absolute opacity-0"
                  />
                  <div
                    className={`p-4 rounded-xl border-2 flex items-center gap-2 font-medium transition-all ${
                      recipientType === value
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

          {/* Role Selection (when recipientType is "role") */}
          {recipientType === "role" && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Select Role
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                {[
                  { value: "user", label: "Users", icon: Users },
                  { value: "moderator", label: "Moderators", icon: ShieldAlert },
                  { value: "admin", label: "Admins", icon: ShieldAlert },
                ].map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className="flex-1 relative cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={selectedRole === value}
                      onChange={() => setSelectedRole(value)}
                      className="absolute opacity-0"
                    />
                    <div
                      className={`p-3 rounded-xl border-2 flex items-center gap-2 font-medium transition-all ${
                        selectedRole === value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-background text-muted-foreground hover:border-border"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* User Selection (when recipientType is "specific") */}
          {recipientType === "specific" && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Select Users ({selectedUsers.length} selected)
              </label>
              <div className="border border-border rounded-xl p-4 bg-background max-h-64 overflow-y-auto">
                {allUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Loading users...
                  </p>
                ) : (
                  <div className="space-y-2">
                    {allUsers.map((user) => (
                      <label
                        key={user._id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.some((u) => u._id === user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user]);
                            } else {
                              setSelectedUsers(
                                selectedUsers.filter((u) => u._id !== user._id)
                              );
                            }
                          }}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {user.name || "No Name"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {user.role}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

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
                            n.recipientType,
                            n.role
                          )}`}
                        >
                          {getRecipientIcon(n.recipientType, n.role)}
                          {getRecipientLabel(n)}
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
