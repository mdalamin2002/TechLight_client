import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, LayoutDashboard, UserCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import { toast } from "react-toastify";
import { auth } from "@/firebase/firebase.init";

export default function UserMenu({ user, logOutUser }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logOutUser(auth)
      .then(() => {
        toast.success("Logged out successfully!");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Failed to logout. Please try again.");
      });
    setProfileOpen(false);
  };

  // Cache-busting avatar URL
  const getAvatarUrl = () => {
    const baseUrl = user?.photoURL || user?.avatar || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || "U")}`;
    
    // Add cache-busting parameter
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}t=${Date.now()}`;
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.email || "User";
  };

  if (!user) {
    return (
      <Button size="sm" asChild>
        <Link to="/auth/login" className="gap-2">
          <User size={18} />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
      </Button>
    );
  }

  return (
    <div className="block relative" ref={profileRef}>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 px-2 relative"
        onMouseEnter={() => setProfileOpen(true)}
        onMouseLeave={() => setProfileOpen(false)}
      >
        <img
          src={getAvatarUrl()}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
        />
        <ChevronDown size={16} className="hidden lg:block" />
        
        {/* Hover tooltip */}
        <AnimatePresence>
          {profileOpen && (
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: -2 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-card px-2 py-1 rounded-md border border-border shadow whitespace-nowrap"
            >
              {getUserDisplayName()}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            <div className="p-2">
              <Link
                to="/dashboard/my-profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <UserCircle size={18} />
                <span className="text-sm font-medium">Profile</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
