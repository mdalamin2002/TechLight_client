import React, { useState, useEffect } from "react";
import { Bell, Clock, Trash2, CheckCircle, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { useSocket } from "@/context/AuthContext/SocketContext/SocketContext";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const axiosSecure = useAxiosSecure();
  const socket = useSocket();
  const { user, userData } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch user-specific notifications
  const fetchNotifications = async () => {
    if (!user || !userData) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        userId: userData._id,
        role: userData.role || "user"
      });
      
      const res = await axiosSecure.get(`/notifications/user?${params}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, userData]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || !userData?._id) return;

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      toast.info(`New notification: ${notification.subject}`);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket, userData]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    if (!userData?._id) return;
    
    try {
      await axiosSecure.patch(`/notifications/${notificationId}/read`, {
        userId: userData._id
      });
      
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!userData?._id) return;
    
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    try {
      await Promise.all(
        unreadNotifications.map(n =>
          axiosSecure.patch(`/notifications/${n._id}/read`, {
            userId: userData._id
          })
        )
      );
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking all as read:", err);
      toast.error("Failed to mark all as read");
    }
  };

  // Format time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "unread" && !n.isRead) ||
                         (filterStatus === "read" && n.isRead);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20">
                <Bell size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  My Notifications
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {unreadCount > 0 
                    ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                    : 'All caught up!'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:underline font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none min-w-[120px]"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Bell size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm || filterStatus !== "all" 
                  ? "No notifications found" 
                  : "No notifications yet"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You'll see notifications here when you receive them"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`group p-6 hover:bg-muted/20 transition-all cursor-pointer ${
                    !notification.isRead ? "bg-primary/5 border-l-4 border-l-primary" : ""
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-base font-semibold ${
                          !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.subject}
                        </h3>
                        {!notification.isRead && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        {notification.isRead && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={12} />
                            Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {notifications.length > 0 && (
          <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Showing {filteredNotifications.length} of {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </span>
              <span className="text-muted-foreground">
                {unreadCount} unread
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
