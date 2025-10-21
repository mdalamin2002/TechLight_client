import React, { useState, useEffect } from "react";
import { Bell, X, Trash2, CheckCircle, Clock } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { useSocket } from "@/context/AuthContext/SocketContext/SocketContext";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";

const NotificationBell = () => {
  const axiosSecure = useAxiosSecure();
  const socket = useSocket();
  const { user, userData } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

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
      
      // Count unread notifications
      const unread = res.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, userData]);

  // Join user-specific room and listen for real-time notifications
  useEffect(() => {
    if (!socket || !userData?._id) return;

    // Join user and role rooms
    socket.emit("join_user_room", {
      userId: userData._id,
      role: userData.role || "user"
    });

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.info(`New notification: ${notification.subject}`, {
        position: "top-right",
        autoClose: 3000,
      });
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
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
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
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking all as read:", err);
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative group p-2.5 rounded-xl hover:bg-primary/10 transition-all duration-300"
      >
        <Bell size={20} className="text-sidebar-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-card border border-border/60 rounded-xl shadow-2xl z-20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Bell size={18} className="text-primary" />
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'No unread notifications'}
              </p>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Bell size={32} className="text-muted-foreground" />
                  </div>
                  <h4 className="text-foreground font-semibold mb-1">
                    No notifications yet
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    You'll see notifications here when you receive them
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`group p-4 hover:bg-muted/50 transition-all cursor-pointer ${
                        !notification.isRead ? "bg-primary/5" : ""
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.subject}
                            </h4>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
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

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border/30 p-3 bg-muted/30">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    // Could navigate to a full notifications page
                  }}
                  className="w-full text-sm text-primary hover:underline font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
