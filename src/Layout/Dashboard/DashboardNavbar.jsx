import React, { useState } from "react";
import { Bell, User, Search, Menu, X } from "lucide-react";

const DashboardNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-sidebar/95 border-b border-sidebar-border/60 shadow-sm backdrop-blur-xl">
      {/* Left Section - Mobile Menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Menu Button - Only visible on small screens */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 transition-all duration-300 border border-primary/20"
        >
          {isMobileMenuOpen ? (
            <X size={22} className="text-primary" />
          ) : (
            <Menu size={22} className="text-primary" />
          )}
        </button>

        {/* Search Box */}
        <div className="w-full max-w-md relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-input/50 text-foreground/90 placeholder:text-muted-foreground/70 border border-border/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 text-sidebar-foreground">
        {/* Notification Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative group p-2.5 rounded-xl hover:bg-primary/10 transition-all duration-300"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border/60 rounded-xl shadow-2xl p-4 z-20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <span className="text-xs text-muted-foreground">3 new</span>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg hover:bg-muted/50 transition cursor-pointer"
                    >
                      <p className="text-sm font-medium">New order received</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        2 minutes ago
                      </p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-sm text-primary hover:underline">
                  View all notifications
                </button>
              </div>
            </>
          )}
        </div>

        {/* Profile Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 hover:from-primary/20 hover:to-accent/15 text-primary transition-all duration-300 border border-primary/20"
          >
            <User size={20} />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfile(false)}
              />
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-card border border-border/60 rounded-xl shadow-2xl p-4 z-20">
                <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">John Doe</p>
                    <p className="text-xs text-muted-foreground truncate">
                      john@example.com
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 text-sm transition">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 text-sm transition">
                    Account
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-sm transition">
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
