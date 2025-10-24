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
  Zap,
  UserCheck,
  Globe,
  History,
  Eye,
  Filter,
  Search,
  X,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [userSearchTerm, setUserSearchTerm] = useState("");

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

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || n.recipientType === filterType;
    return matchesSearch && matchesFilter;
  });

  // Filter users based on search
  const filteredUsers = allUsers.filter(user => {
    const searchLower = userSearchTerm.toLowerCase();
    return (
      (user.name || "").toLowerCase().includes(searchLower) ||
      (user.email || "").toLowerCase().includes(searchLower) ||
      (user.role || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen">
      <div className=" space-y-6">
        {/* Page Header */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20">
              <Bell size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground">
                Notification Center
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Send targeted notifications and manage notification history
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 shadow-sm">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Send Notification Form */}
          <div className="xl:col-span-1">
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm sticky top-6" style={{ height: 'calc(100vh - 12rem)' }}>
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Send size={20} className="text-primary" />
                  Send Notification
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Compose and send to users
                </p>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar" style={{ height: 'calc(100vh - 20rem)' }}>
                {/* Recipient Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Recipient Type
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: "role", label: "By Role", icon: Users, desc: "Target specific roles" },
                      { value: "specific", label: "Specific Users", icon: UserCheck, desc: "Select individuals" },
                      { value: "all", label: "All Users", icon: Globe, desc: "Broadcast to everyone" },
                    ].map(({ value, label, icon: Icon, desc }) => (
                      <label key={value} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="recipientType"
                          value={value}
                          checked={recipientType === value}
                          onChange={() => setRecipientType(value)}
                          className="absolute opacity-0"
                        />
                        <div className={`p-3 rounded-lg border-2 transition-all ${
                            recipientType === value
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border/50 hover:border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              recipientType === value ? "bg-primary/10" : "bg-muted/50"
                            }`}>
                              <Icon size={18} className={recipientType === value ? "text-primary" : "text-muted-foreground"} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                recipientType === value ? "text-primary" : "text-foreground"
                              }`}>{label}</p>
                              <p className="text-xs text-muted-foreground">{desc}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Role Selection */}
                {recipientType === "role" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-foreground">
                      Select Role
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { value: "user", label: "Users", icon: Users, color: "blue" },
                        { value: "moderator", label: "Moderators", icon: ShieldAlert, color: "purple" },
                        { value: "admin", label: "Admins", icon: ShieldAlert, color: "red" },
                      ].map(({ value, label, icon: Icon, color }) => (
                        <label key={value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="role"
                            value={value}
                            checked={selectedRole === value}
                            onChange={() => setSelectedRole(value)}
                            className="peer sr-only"
                          />
                          <div className="p-3 rounded-lg border-2 border-border/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex items-center gap-2">
                            <Icon size={16} className="peer-checked:text-primary text-muted-foreground" />
                            <span className="text-sm font-medium peer-checked:text-primary">{label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Selection */}
                {recipientType === "specific" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-foreground">
                      Select Users ({selectedUsers.length} selected)
                    </label>
                    
                    {/* User Search Bar */}
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      />
                      {userSearchTerm && (
                        <button
                          onClick={() => setUserSearchTerm("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          title="Clear search"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="border border-border rounded-lg p-3 bg-muted/20 max-h-64 overflow-y-auto custom-scrollbar">
                      {allUsers.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Loading users...
                        </p>
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                            <Search size={24} className="text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">No users found</p>
                          <p className="text-xs text-muted-foreground">
                            Try adjusting your search terms
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredUsers.map((user) => (
                            <label
                              key={user._id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedUsers.some((u) => u._id === user._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, user]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
                                  }
                                }}
                                className="w-4 h-4 text-primary border-border rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {user.name || "No Name"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                              </div>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex-shrink-0">
                                {user.role}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Selected Users Summary */}
                    {selectedUsers.length > 0 && (
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-xs font-medium text-primary mb-2 flex items-center gap-2">
                          <UserCheck size={14} />
                          {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedUsers.slice(0, 5).map((user) => (
                            <span
                              key={user._id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs"
                            >
                              {user.name || user.email}
                              <button
                                onClick={() => setSelectedUsers(selectedUsers.filter(u => u._id !== user._id))}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                title="Remove"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                          {selectedUsers.length > 5 && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-muted text-muted-foreground rounded-md text-xs">
                              +{selectedUsers.length - 5} more
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedUsers([])}
                          className="text-xs text-primary hover:underline mt-2"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Subject Input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Mail size={14} className="text-primary" />
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter notification subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={100}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{subject.length}/100 characters</p>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Zap size={14} className="text-primary" />
                    Message
                  </label>
                  <textarea
                    placeholder="Enter your notification message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition text-sm resize-none custom-scrollbar"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{message.length}/500 characters</p>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={18} />
                  {loading ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Notification History Table */}
          <div className="xl:col-span-2">
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm" style={{ height: 'calc(100vh - 12rem)' }}>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <History size={20} className="text-primary" />
                      Notification History
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:min-w-[200px]">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      />
                    </div>
                    
                    {/* Filter */}
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="role">By Role</option>
                      <option value="specific">Specific Users</option>
                      <option value="all">Broadcast</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-y-auto custom-scrollbar" style={{ height: 'calc(100vh - 24rem)' }}>
                <div className="overflow-x-auto">
                {fetchLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <Bell size={40} className="text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {searchTerm || filterType !== "all" ? "No notifications found" : "No notifications yet"}
                    </h4>
                    <p className="text-muted-foreground text-sm max-w-md">
                      {searchTerm || filterType !== "all" 
                        ? "Try adjusting your search or filter criteria" 
                        : "Send your first notification to get started"}
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-muted/30 border-b border-border/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                          Recipient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredNotifications.map((n) => (
                        <tr key={n._id} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-1">{n.subject}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                              {/* Mobile: Show recipient and date */}
                              <div className="md:hidden flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${getRecipientColor(n.recipientType, n.role)}`}>
                                  {getRecipientIcon(n.recipientType, n.role)}
                                  {getRecipientLabel(n)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${getRecipientColor(n.recipientType, n.role)}`}>
                              {getRecipientIcon(n.recipientType, n.role)}
                              {getRecipientLabel(n)}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(n.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDelete(n._id)}
                                className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  );
};

export default Notifications;
